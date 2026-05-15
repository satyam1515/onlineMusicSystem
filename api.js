/**
 * API Service Layer
 * Handles all backend API calls
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('lumous_token');

// Set auth token
const setToken = (token) => {
  if (token) {
    localStorage.setItem('lumous_token', token);
  } else {
    localStorage.removeItem('lumous_token');
  }
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (username, email, password, display_name) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, display_name })
    });
    if (data.token) setToken(data.token);
    return data;
  },

  login: async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token) setToken(data.token);
    return data;
  },

  logout: () => {
    setToken(null);
  },

  getCurrentUser: async () => {
    try {
      return await apiRequest('/auth/me');
    } catch {
      return null;
    }
  }
};

// Tracks API
export const tracksAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/tracks?${params}`);
  },
  getStreamUrl: (id) => `${API_BASE_URL}/tracks/${id}/stream`,

  getById: async (id) => {
    return await apiRequest(`/tracks/${id}`);
  },

  like: async (id) => {
    return await apiRequest(`/tracks/${id}/like`, { method: 'POST' });
  },

  getLiked: async () => {
    return await apiRequest('/tracks/liked/all');
  },

  getFeatured: async () => {
    return await apiRequest('/tracks/featured/spotlight');
  },

  incrementPlay: async (id) => {
    return await apiRequest(`/tracks/${id}/play`, { method: 'POST' });
  }
};

// Playlists API
export const playlistsAPI = {
  getAll: async () => {
    return await apiRequest('/playlists');
  },

  getById: async (id) => {
    return await apiRequest(`/playlists/${id}`);
  },

  create: async (name, description, cover_url, is_public) => {
    return await apiRequest('/playlists', {
      method: 'POST',
      body: JSON.stringify({ name, description, cover_url, is_public })
    });
  },

  update: async (id, updates) => {
    return await apiRequest(`/playlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  delete: async (id) => {
    return await apiRequest(`/playlists/${id}`, { method: 'DELETE' });
  },

  addTrack: async (playlistId, trackId) => {
    return await apiRequest(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({ track_id: trackId })
    });
  },

  removeTrack: async (playlistId, trackId) => {
    return await apiRequest(`/playlists/${playlistId}/tracks/${trackId}`, {
      method: 'DELETE'
    });
  }
};

// Collections API
export const collectionsAPI = {
  getAll: async () => {
    return await apiRequest('/collections');
  },

  getById: async (id) => {
    return await apiRequest(`/collections/${id}`);
  }
};

// Search API
export const searchAPI = {
  search: async (query, type = null, limit = 20) => {
    const params = new URLSearchParams({ q: query, limit });
    if (type) params.append('type', type);
    return await apiRequest(`/search?${params}`);
  }
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    return await apiRequest('/users/profile');
  },

  updateProfile: async (updates) => {
    return await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  follow: async (followingId, followType = 'user') => {
    return await apiRequest('/users/follow', {
      method: 'POST',
      body: JSON.stringify({ following_id: followingId, follow_type: followType })
    });
  },

  unfollow: async (followingId) => {
    return await apiRequest(`/users/follow/${followingId}`, { method: 'DELETE' });
  },

  getActivity: async (limit = 20) => {
    return await apiRequest(`/users/activity?limit=${limit}`);
  }
};

// Activity API (public feed)
export const activityAPI = {
  getRecent: async (limit = 20) => {
    return await apiRequest(`/activity?limit=${limit}`);
  }
};

export { getToken, setToken };

