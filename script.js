/**
 * Lumous – immersive music streaming experience
 * ------------------------------------------------
 * This script orchestrates data hydration, UI rendering,
 * and the reactive audio player controls for the Lumous surface.
 */

import {
  authAPI,
  tracksAPI,
  playlistsAPI,
  collectionsAPI,
  searchAPI,
  usersAPI,
  activityAPI
} from './api.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => scope.querySelectorAll(selector);
const pageId = document.body.dataset.page || "discover";

// API connection state
let useAPI = false;
const API_ENABLED = true; // Set to false to use local catalog

const secondsToClock = (seconds) => {
    const safeSeconds = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = (safeSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
};

const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const now = Date.now();
    const value = new Date(dateString).getTime();
    const diffMs = Math.max(0, now - value);
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
};

const catalog = {
    tracks: [
        {
            id: "prism-halo",
            title: "Heat Waves",
            artist: "Glass Animals",
            cover: "https://upload.wikimedia.org/wikipedia/en/b/b0/Glass_Animals_-_Heat_Waves.png",
            url: "D:\Sem 3 mini project 2\songs\Glass Animals - Heat Waves (Official Video) - GlassAnimalsVEVO.mp3",
            duration: 215,
            genre: "Cinematic electronica",
            mood: "Luminous",
            bpm: 92,
            spotlight: true
        },
        {
            id: "chromatic-tide",
            title: "Chromatic Tide",
            artist: "Neon Weaver",
            cover: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=900&auto=format&fit=crop",
            url: "https://cdn.pixabay.com/download/audio/2021/09/16/audio_6c33275f62.mp3?filename=corporate-summer-10636.mp3",
            duration: 186,
            genre: "Future chill",
            mood: "Night drive",
            bpm: 104
        },
        {
            id: "aurora-script",
            title: "Aurora Script",
            artist: "Luma Codes",
            cover: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop",
            url: "https://cdn.pixabay.com/download/audio/2021/09/16/audio_4df1f6d9f8.mp3?filename=future-bass-10663.mp3",
            duration: 212,
            genre: "Electro pop",
            mood: "Vibrant",
            bpm: 118
        },
        {
            id: "midnight-mirror",
            title: "Midnight Mirror",
            artist: "Nova North",
            cover: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=900&auto=format&fit=crop",
            url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3b9e936a61.mp3?filename=escape-140850.mp3",
            duration: 201,
            genre: "Alt synth",
            mood: "Midnight",
            bpm: 96
        },
        {
            id: "violet-sea",
            title: "Violet Sea",
            artist: "Serein",
            cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=900&auto=format&fit=crop",
            url: "https://cdn.pixabay.com/download/audio/2021/09/16/audio_3a2206f432.mp3?filename=your-love-10667.mp3",
            duration: 194,
            genre: "Indie wave",
            mood: "Dreamy",
            bpm: 98
        },
        {
            id: "solar-lattice",
            title: "Solar Lattice",
            artist: "Cascade Lines",
            cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=900&auto=format&fit=crop",
            url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_b873b65ad6.mp3?filename=lifeline-124213.mp3",
            duration: 223,
            genre: "Ambient techno",
            mood: "Energised",
            bpm: 126
        },
        {
            id: "neon-rivulet",
            title: "Neon Rivulet",
            artist: "Eonia",
            cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=900&auto=format&fit=crop",
            url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_640e09f7b9.mp3?filename=night-crafting-124135.mp3",
            duration: 206,
            genre: "Lo-fi drift",
            mood: "Calm",
            bpm: 74
        },
        {
            id: "superluminal",
            title: "Superluminal",
            artist: "Vector Bloom",
            cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop",
            url: "https://cdn.pixabay.com/download/audio/2021/09/16/audio_799da7de25.mp3?filename=dream-sequence-110844.mp3",
            duration: 238,
            genre: "Progressive electronica",
            mood: "Elevated",
            bpm: 130
        }
    ],
    collections: [
        {
            id: "halo-drift",
            name: "Halo Drift",
            subtitle: "Synthwave focus",
            color: "linear-gradient(135deg, rgba(141, 97, 255, 0.35), rgba(86, 168, 255, 0.4))",
            trackIds: ["prism-halo", "midnight-mirror", "violet-sea"]
        },
        {
            id: "luma-lounge",
            name: "Luma Lounge",
            subtitle: "Ease into the glow",
            color: "linear-gradient(135deg, rgba(60, 239, 255, 0.4), rgba(127, 92, 255, 0.35))",
            trackIds: ["neon-rivulet", "chromatic-tide", "violet-sea"]
        },
        {
            id: "nocturne",
            name: "IRIS Nocturne",
            subtitle: "Night code sessions",
            color: "linear-gradient(135deg, rgba(255, 106, 213, 0.35), rgba(127, 92, 255, 0.4))",
            trackIds: ["superluminal", "solar-lattice", "midnight-mirror"]
        }
    ],
    artists: [
        {
            id: "astra",
            name: "Astra Aeon",
            role: "Composer · Berlin",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
            listeners: "128k"
        },
        {
            id: "nova",
            name: "Nova North",
            role: "Producer · Reykjavík",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
            listeners: "96k"
        },
        {
            id: "serein",
            name: "Serein",
            role: "Vocalist · Tokyo",
            avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop",
            listeners: "81k"
        }
    ],
    moods: [
        {
            id: "zenith",
            title: "Zenith Focus",
            tagline: "Slow builds • Pulse coding",
            listeners: "42k tuned",
            badge: "Flow",
            gradient: "linear-gradient(135deg, rgba(132, 102, 255, 0.4), rgba(255, 106, 213, 0.35))"
        },
        {
            id: "dawn",
            title: "Dawn Break",
            tagline: "Glow up your morning",
            listeners: "58k tuned",
            badge: "Rise",
            gradient: "linear-gradient(135deg, rgba(60, 239, 255, 0.4), rgba(127, 92, 255, 0.32))"
        },
        {
            id: "midnight",
            title: "Midnight Loom",
            tagline: "Nocturnal bass lines",
            listeners: "36k tuned",
            badge: "Night",
            gradient: "linear-gradient(135deg, rgba(255, 122, 173, 0.35), rgba(100, 70, 255, 0.3))"
        },
        {
            id: "nebula",
            title: "Nebula Drift",
            tagline: "Wide space ambients",
            listeners: "21k tuned",
            badge: "Deep",
            gradient: "linear-gradient(135deg, rgba(255, 215, 137, 0.3), rgba(60, 239, 255, 0.28))"
        }
    ],
    mixes: [
        {
            id: "flux",
            title: "Flux Frequency",
            description: "Carefully weighted harmonics for focus sprints.",
            listeners: "32k active",
            emoji: "⚡",
            gradient: "linear-gradient(135deg, rgba(60, 239, 255, 0.35), rgba(124, 92, 255, 0.35))",
            trackIds: ["solar-lattice", "superluminal", "prism-halo"]
        },
        {
            id: "mirage",
            title: "Mirage Bloom",
            description: "Dreamy textures with crisp percussion for design flow.",
            listeners: "28k active",
            emoji: "🌸",
            gradient: "linear-gradient(135deg, rgba(255, 122, 173, 0.35), rgba(127, 92, 255, 0.35))",
            trackIds: ["violet-sea", "chromatic-tide", "neon-rivulet"]
        },
        {
            id: "parallax",
            title: "Parallax Echo",
            description: "Layered polyrhythms for deep concentration.",
            listeners: "25k active",
            emoji: "🛰️",
            gradient: "linear-gradient(135deg, rgba(132, 102, 255, 0.32), rgba(60, 239, 255, 0.32))",
            trackIds: ["midnight-mirror", "solar-lattice", "aurora-script"]
        },
        {
            id: "radiant",
            title: "Radiant Field",
            description: "Feel-good uptempo cuts to light up the room.",
            listeners: "34k active",
            emoji: "🌈",
            gradient: "linear-gradient(135deg, rgba(255, 215, 137, 0.32), rgba(60, 239, 255, 0.36))",
            trackIds: ["aurora-script", "prism-halo", "superluminal"]
        }
    ],
    releases: [
        {
            id: "release-prism",
            title: "Prism Halo",
            artist: "Astra Aeon",
            cover: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=400&auto=format&fit=crop",
            released: "2 hours ago",
            mood: "Cinematic electronica",
            trackId: "prism-halo"
        },
        {
            id: "release-mirror",
            title: "Midnight Mirror",
            artist: "Nova North",
            cover: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=400&auto=format&fit=crop",
            released: "Yesterday",
            mood: "Nocturnal synth",
            trackId: "midnight-mirror"
        },
        {
            id: "release-rivulet",
            title: "Neon Rivulet",
            artist: "Eonia",
            cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=400&auto=format&fit=crop",
            released: "3 days ago",
            mood: "Lo-fi drift",
            trackId: "neon-rivulet"
        },
        {
            id: "release-flux",
            title: "Flux Frequency",
            artist: "Vector Bloom",
            cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
            released: "1 week ago",
            mood: "Progressive electronica",
            trackId: "superluminal"
        }
    ],
    liveChannels: [
        {
            id: "live-spectrum",
            title: "Spectrum Labs",
            host: "DJ Nyx",
            listeners: "2.4k",
            tags: ["Neon", "Live visuals"],
            cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: "live-pulse",
            title: "Pulse Grid",
            host: "Astra Aeon",
            listeners: "1.9k",
            tags: ["Synth", "Chill"],
            cover: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop"
        },
        {
            id: "live-celestial",
            title: "Celestial Coding",
            host: "Nodewave Collective",
            listeners: "3.1k",
            tags: ["Live coding", "Ambient"],
            cover: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop"
        }
    ],
    activity: [
        { id: "a1", message: "Eonia just joined Spectrum Labs", time: "Live" },
        { id: "a2", message: 'Nova North dropped "Midnight Mirror"', time: "1h" },
        { id: "a3", message: "14 friends liked Flux Frequency", time: "3h" },
        { id: "a4", message: "Astra Aeon scheduled Lumous+ premiere", time: "Tomorrow" }
    ]
};

const normalizeApiTrack = (track) => ({
    id: track.id.toString(),
    title: track.title,
    artist: track.artist,
    cover: track.cover_url,
    url: tracksAPI.getStreamUrl(track.id),
    duration: track.duration,
    genre: track.genre,
    mood: track.mood,
    bpm: track.bpm,
    spotlight: track.spotlight === 1
});

const releaseFromTrack = (track) => ({
    id: `release-${track.id}`,
    title: track.title,
    artist: track.artist,
    cover: track.cover,
    released: "Fresh from API",
    mood: `${track.genre ?? ""}${track.genre && track.mood ? " • " : ""}${track.mood ?? ""}`,
    trackId: track.id
});

const state = {
    queue: [...catalog.tracks],
    index: 0,
    isPlaying: false,
    shuffle: false,
    repeat: false,
    liked: new Set(),
    savedCollections: new Set(),
    heroTrackId: catalog.tracks.find((t) => t.spotlight)?.id ?? catalog.tracks[0]?.id,
    user: null,
    profileStats: null
};

// Element references
const audio = $("#audio");
const toast = $("#toast");
const seek = $("#seek");
const volume = $("#volume");
const btnPlay = $("#btn-play");
const btnPrev = $("#btn-prev");
const btnNext = $("#btn-next");
const btnShuffle = $("#btn-shuffle");
const btnRepeat = $("#btn-repeat");
const btnLike = $("#btn-like");
const btnAddQueue = $("#btn-add-queue");
const btnClearQueue = $("#btn-clear-queue");
const btnShare = $("#btn-share");
const btnOpenLyrics = $("#btn-open-lyrics");
const btnLyrics = $("#btn-lyrics");
const btnDevice = $("#btn-device");
const btnHeroPlay = $("#hero-play");
const btnHeroBookmark = $("#hero-bookmark");
const searchInput = $("#search-input");

const sidebarAvatar = $(".profile-card .avatar");
const profileNameEl = $(".profile-name");
const profilePlanEl = $(".profile-plan");
const accountBtn = $("#btn-account");
const profilePlanLabel = $("#profile-plan-label");
const profileEmailLabel = $("#profile-email-label");
const profilePlaylistsCount = $("#profile-playlists-count");
const profileLikedCount = $("#profile-liked-count");
const profileFollowingCount = $("#profile-following-count");
const profileForm = $("#profile-form");
const profileStatusEl = $("#profile-status");
const profileDisplayInput = $("#profile-display-input");
const profileAvatarInput = $("#profile-avatar-input");
const profileRefreshBtn = $("#btn-profile-refresh");
const logoutBtn = $("#btn-logout");

const npCover = $("#np-cover");
const npTitle = $("#np-title");
const npArtist = $("#np-artist");
const playerCover = $("#player-cover");
const playerTitle = $("#player-title");
const playerArtist = $("#player-artist");
const timeCurrent = $("#time-current");
const timeTotal = $("#time-total");

const getActiveDuration = () => {
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : null;
    return duration ?? state.queue[state.index]?.duration ?? 0;
};

// Rendering helpers
const getTrackById = (id) => catalog.tracks.find((track) => track.id === id);

function renderHero() {
    const heroTrack = getTrackById(state.heroTrackId) ?? catalog.tracks[0];
    if (!heroTrack) return;

    $("#hero-title").textContent = heroTrack.title;
    $("#hero-artist").textContent = heroTrack.artist;
    $("#hero-duration").textContent = secondsToClock(heroTrack.duration);
    $("#hero-genre").textContent = heroTrack.genre;
    $("#hero-cover").src = heroTrack.cover;
    $("#hero-description").textContent = `Experience ${heroTrack.title}, a ${heroTrack.genre.toLowerCase()} journey tuned for ${heroTrack.mood.toLowerCase()} sessions.`;

    btnHeroBookmark.setAttribute("aria-pressed", state.savedCollections.has(heroTrack.id));
}

function renderCollections() {
    const root = $("#collection-list");
    if (!root) return;
    root.innerHTML = "";

    catalog.collections.forEach((collection) => {
        const button = document.createElement("button");
        button.className = "collection-item";
        button.style.backgroundImage = `${collection.color}, linear-gradient(135deg, rgba(12, 6, 44, 0.9), rgba(18, 8, 52, 0.92))`;
        button.style.backgroundBlendMode = "screen";
        button.style.borderColor = "rgba(127, 92, 255, 0.28)";
        button.innerHTML = `
            <div class="meta">
                <span>${collection.name}</span>
                <span>${collection.subtitle}</span>
            </div>
            <span>${collection.trackIds.length} trks</span>
        `;
        button.addEventListener("click", () => {
            state.queue = collection.trackIds.map(getTrackById).filter(Boolean);
            state.index = 0;
            setSource(state.queue[state.index]);
            renderQueue();
            renderReleases(state.queue.map((track) => ({
                id: `release-${track.id}`,
                title: track.title,
                artist: track.artist,
                cover: track.cover,
                released: "In rotation",
                mood: track.genre,
                trackId: track.id
            })));
            play();
            showToast(`${collection.name} is now playing`);
        });
        root.appendChild(button);
    });
}

function renderFollowingArtists() {
    const root = $("#sidebar-artists");
    if (!root) return;
    root.innerHTML = "";

    catalog.artists.forEach((artist) => {
        const button = document.createElement("button");
        button.className = "artist-item";
        button.innerHTML = `
            <div class="meta">
                <span>${artist.name}</span>
                <span>${artist.role}</span>
            </div>
            <span>${artist.listeners}</span>
        `;
        button.addEventListener("click", () => {
            showToast(`Following ${artist.name}. Personalized sets coming soon.`);
        });
        root.appendChild(button);
    });
}

function renderMoods() {
    const root = $("#mood-grid");
    if (!root) return;
    root.innerHTML = "";

    catalog.moods.forEach((mood) => {
        const card = document.createElement("article");
        card.className = "mood-card";
        card.style.backgroundImage = `${mood.gradient}, linear-gradient(135deg, rgba(12, 6, 44, 0.85), rgba(24, 12, 68, 0.78))`;
        card.style.backgroundBlendMode = "screen";
        card.innerHTML = `
            <span class="badge" style="background:${mood.gradient}">${mood.badge}</span>
            <strong>${mood.title}</strong>
            <span>${mood.tagline}</span>
            <span>${mood.listeners}</span>
        `;
        card.addEventListener("click", () => showToast(`${mood.title} mix queued.`));
        root.appendChild(card);
    });
}

function renderMixes() {
    const root = $("#mix-grid");
    if (!root) return;
    root.innerHTML = "";

    catalog.mixes.forEach((mix) => {
        const firstTrack = getTrackById(mix.trackIds[0]);
        const card = document.createElement("article");
        card.className = "mix-card";
        card.style.backgroundImage = `${mix.gradient}, linear-gradient(135deg, rgba(18, 8, 52, 0.82), rgba(30, 12, 72, 0.8))`;
        card.style.backgroundBlendMode = "screen";
        card.innerHTML = `
            <span class="badge">${mix.emoji} ${mix.listeners}</span>
            <strong>${mix.title}</strong>
            <span>${mix.description}</span>
            <span>${mix.trackIds.length} tracks • Featuring ${firstTrack?.artist ?? "Unknown"}</span>
        `;
        card.addEventListener("click", () => {
            state.queue = mix.trackIds.map(getTrackById).filter(Boolean);
            state.index = 0;
            setSource(state.queue[state.index]);
            renderQueue();
            play();
            showToast(`${mix.title} is on.`);
        });
        root.appendChild(card);
    });
}

function renderReleases(releases = catalog.releases) {
    const root = $("#release-list");
    if (!root) return;
    root.innerHTML = "";

    releases.forEach((release) => {
        const track = getTrackById(release.trackId);
        const item = document.createElement("article");
        item.className = "release-item";
        item.innerHTML = `
            <img src="${release.cover}" alt="${release.title} cover">
            <div class="release-info">
                <strong>${release.title}</strong>
                <span>${release.artist} • ${release.mood}</span>
            </div>
            <button class="text-btn">${release.released}</button>
        `;
        item.addEventListener("click", () => {
            if (!track) return;
            playTrackById(track.id);
        });
        root.appendChild(item);
    });
}

function renderLiveChannels() {
    const root = $("#live-channel-list");
    if (!root) return;
    root.innerHTML = "";

    catalog.liveChannels.forEach((channel) => {
        const card = document.createElement("article");
        card.className = "live-card";
        card.innerHTML = `
            <header>
                <img src="${channel.cover}" alt="${channel.title} cover" style="width:48px;height:48px;border-radius:14px;object-fit:cover;border:1px solid rgba(127,92,255,0.3);">
                <div>
                    <strong>${channel.title}</strong>
                    <span>Hosted by ${channel.host}</span>
                </div>
            </header>
            <span class="status">Live • ${channel.listeners} listeners</span>
            <span>${channel.tags.join(" • ")}</span>
        `;
        card.addEventListener("click", () => showToast(`Joined ${channel.title} live broadcast.`));
        root.appendChild(card);
    });
}

function renderQueue() {
    const root = $("#queue-list");
    if (!root) return;
    root.innerHTML = "";

    state.queue.forEach((track, index) => {
        const item = document.createElement("article");
        item.className = "queue-item";
        if (index === state.index) item.classList.add("active");
        item.innerHTML = `
            <img src="${track.cover}" alt="${track.title} cover">
            <div class="queue-meta">
                <span>${track.title}</span>
                <span>${track.artist}</span>
            </div>
            <button class="text-btn">${secondsToClock(track.duration)}</button>
        `;
        item.addEventListener("click", () => {
            state.index = index;
    setSource(state.queue[state.index]);
            play();
        });
        root.appendChild(item);
    });
}

function renderActivity() {
    const root = $("#activity-feed");
    if (!root) return;
    root.innerHTML = "";

    catalog.activity.forEach((event) => {
        const li = document.createElement("li");
        li.textContent = `${event.message} • ${event.time}`;
        root.appendChild(li);
    });
}

function setSource(track) {
    if (!track) return;
    const sourceUrl = track.url || (useAPI && track.id ? tracksAPI.getStreamUrl(track.id) : track.audio_url);
    if (!sourceUrl) {
        console.warn("Missing audio source for track", track);
        return;
    }
    audio.src = sourceUrl;
    audio.volume = parseFloat(volume.value);
    updateNowPlaying();
}

function updateNowPlaying() {
    const current = state.queue[state.index];
    if (!current) return;

    npCover.src = current.cover;
    npTitle.textContent = current.title;
    npArtist.textContent = current.artist;

    playerCover.src = current.cover;
    playerTitle.textContent = current.title;
    playerArtist.textContent = current.artist;

    btnLike.setAttribute("aria-pressed", state.liked.has(current.id));
    renderQueue();
}

function play() {
    state.isPlaying = true;
    audio.play().catch(() => {
        state.isPlaying = false;
        reflectPlayState();
    });
    reflectPlayState();
}

function pause() {
    audio.pause();
    state.isPlaying = false;
    reflectPlayState();
}

function togglePlay() {
    state.isPlaying ? pause() : play();
}

function prev() {
    if (audio.currentTime > 4) {
        audio.currentTime = 0;
        return;
    }
    state.index = (state.index - 1 + state.queue.length) % state.queue.length;
    setSource(state.queue[state.index]);
    play();
}

function next() {
    if (state.shuffle) {
        const randomIndex = Math.floor(Math.random() * state.queue.length);
        state.index = randomIndex;
    } else {
        state.index = (state.index + 1) % state.queue.length;
    }
    setSource(state.queue[state.index]);
    play();
}

function reflectPlayState() {
    btnPlay.textContent = state.isPlaying ? "⏸️" : "▶️";
    btnPlay.setAttribute("aria-pressed", state.isPlaying);
    btnShuffle.setAttribute("aria-pressed", state.shuffle);
    btnRepeat.setAttribute("aria-pressed", state.repeat);
}

function playTrackById(id) {
    const index = state.queue.findIndex((track) => track.id === id);
    if (index >= 0) {
        state.index = index;
        setSource(state.queue[state.index]);
        play();
        return;
    }

    const fallback = getTrackById(id);
    if (fallback) {
        state.queue.unshift(fallback);
        state.index = 0;
        setSource(fallback);
        renderQueue();
        play();
    }
}

async function handleSearchInput(event) {
    const query = event.target.value.trim();
    if (!query) {
        if (useAPI) {
            try {
                const releasesData = await tracksAPI.getAll({ limit: 10 });
                renderReleases(releasesData.tracks.map(t => ({
                    id: `release-${t.id}`,
                    title: t.title,
                    artist: t.artist,
                    cover: t.cover_url,
                    released: "From catalog",
                    mood: `${t.genre} • ${t.mood}`,
                    trackId: t.id.toString()
                })));
            } catch {
                renderReleases();
            }
        } else {
            renderReleases();
        }
        return;
    }

    if (useAPI) {
        try {
            const results = await searchAPI.search(query);
            const releases = results.results.tracks?.map(t => ({
                id: `search-${t.id}`,
                title: t.title,
                artist: t.artist,
                cover: t.cover_url,
                released: "From search",
                mood: `${t.genre || ''} • ${t.mood || ''}`,
                trackId: t.id.toString()
            })) || [];

            renderReleases(releases);
            showToast(`Found ${releases.length} track${releases.length === 1 ? "" : "s"}.`);
        } catch (error) {
            console.error('Search error:', error);
            showToast("Search unavailable. Using local search.");
            // Fallback to local
            const matches = catalog.tracks.filter((track) =>
                `${track.title} ${track.artist} ${track.genre}`.toLowerCase().includes(query.toLowerCase())
            );
            renderReleases(matches.map(track => ({
                id: `search-${track.id}`,
                title: track.title,
                artist: track.artist,
                cover: track.cover,
                released: "From catalog",
                mood: `${track.genre} • ${track.mood}`,
                trackId: track.id
            })));
        }
    } else {
        // Local search
        const matches = catalog.tracks.filter((track) =>
            `${track.title} ${track.artist} ${track.genre}`.toLowerCase().includes(query.toLowerCase())
        );

        if (!matches.length) {
            renderReleases([]);
            showToast("No results found. Try another vibe.");
            return;
        }

        renderReleases(
            matches.map((track) => ({
                id: `search-${track.id}`,
                title: track.title,
                artist: track.artist,
                cover: track.cover,
                released: "From catalog",
                mood: `${track.genre} • ${track.mood}`,
                trackId: track.id
            }))
        );
        showToast(`Showing ${matches.length} result${matches.length === 1 ? "" : "s"}.`);
    }
}

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

let authModalEl = null;
let currentAuthMode = "login";

function ensureAuthModal() {
    if (authModalEl) return authModalEl;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div id="auth-modal" class="auth-modal" aria-hidden="true">
            <div class="auth-dialog" role="dialog" aria-modal="true">
                <button class="auth-close" type="button" aria-label="Close authentication modal">&times;</button>
                <div class="auth-tabs">
                    <button type="button" data-auth-tab="login" class="active">Login</button>
                    <button type="button" data-auth-tab="signup">Sign up</button>
                </div>
                <form id="auth-login-form" class="auth-form active">
                    <label>
                        Username or email
                        <input type="text" name="username" required autocomplete="username" />
                    </label>
                    <label>
                        Password
                        <input type="password" name="password" required autocomplete="current-password" />
                    </label>
                    <button class="primary-btn" type="submit">Login</button>
                    <p class="auth-helper" data-auth-message="login"></p>
                </form>
                <form id="auth-signup-form" class="auth-form">
                    <label>
                        Username
                        <input type="text" name="username" required autocomplete="username" />
                    </label>
                    <label>
                        Email
                        <input type="email" name="email" required autocomplete="email" />
                    </label>
                    <label>
                        Display name
                        <input type="text" name="display_name" placeholder="How should we address you?" />
                    </label>
                    <label>
                        Password
                        <input type="password" name="password" required minlength="6" autocomplete="new-password" />
                    </label>
                    <button class="primary-btn" type="submit">Create account</button>
                    <p class="auth-helper" data-auth-message="signup"></p>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper.firstElementChild);
    authModalEl = $("#auth-modal");
    authModalEl.querySelectorAll("[data-auth-tab]").forEach((button) => {
        button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
    });
    $("#auth-login-form", authModalEl)?.addEventListener("submit", handleLoginSubmit);
    $("#auth-signup-form", authModalEl)?.addEventListener("submit", handleSignupSubmit);
    $(".auth-close", authModalEl)?.addEventListener("click", closeAuthModal);
    authModalEl.addEventListener("click", (event) => {
        if (event.target === authModalEl) closeAuthModal();
    });
    return authModalEl;
}

function setAuthTab(mode = "login") {
    currentAuthMode = mode;
    const modal = ensureAuthModal();
    modal.querySelectorAll("[data-auth-tab]").forEach((button) => {
        button.classList.toggle("active", button.dataset.authTab === mode);
    });
    $("#auth-login-form", modal)?.classList.toggle("active", mode === "login");
    $("#auth-signup-form", modal)?.classList.toggle("active", mode === "signup");
}

function openAuthModal(mode = "login") {
    const modal = ensureAuthModal();
    setAuthTab(mode);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}

function closeAuthModal() {
    if (!authModalEl) return;
    authModalEl.classList.remove("open");
    authModalEl.setAttribute("aria-hidden", "true");
    setAuthMessage("login", "");
    setAuthMessage("signup", "");
}

function setAuthMessage(mode, message) {
    if (!authModalEl) return;
    const el = authModalEl.querySelector(`[data-auth-message="${mode}"]`);
    if (el) el.textContent = message || "";
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");
    if (!username || !password) return;
    submitBtn.disabled = true;
    setAuthMessage("login", "Signing you in…");
    try {
        const result = await authAPI.login(username, password);
        state.user = result.user;
        closeAuthModal();
        updateAccountSurface();
        showToast(`Welcome back ${state.user?.display_name ?? state.user?.username ?? ""}`.trim());
        if (pageId === "profile") {
            await renderProfilePage(true);
        }
    } catch (error) {
        console.error("Login error:", error);
        setAuthMessage("login", error.message || "Unable to sign in");
    } finally {
        submitBtn.disabled = false;
    }
}

async function handleSignupSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const payload = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        display_name: formData.get("display_name")
    };
    if (!payload.username || !payload.email || !payload.password) return;
    submitBtn.disabled = true;
    setAuthMessage("signup", "Creating your account…");
    try {
        const result = await authAPI.register(payload.username, payload.email, payload.password, payload.display_name);
        state.user = result.user;
        closeAuthModal();
        updateAccountSurface();
        showToast("Account created. Welcome to Lumous!");
        if (pageId === "profile") {
            await renderProfilePage(true);
        }
    } catch (error) {
        console.error("Signup error:", error);
        setAuthMessage("signup", error.message || "Unable to create account");
    } finally {
        submitBtn.disabled = false;
    }
}

function updateAccountSurface() {
    if (profileNameEl) {
        profileNameEl.textContent = state.user?.display_name || "Guest Listener";
    }
    if (profilePlanEl) {
        profilePlanEl.textContent = state.user
            ? `${(state.user.plan || "Free").replace(/^./, (char) => char.toUpperCase())} Plan`
            : "Guest • Sign in";
    }
    if (sidebarAvatar) {
        sidebarAvatar.src = state.user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=lumous";
    }
    if (accountBtn) {
        accountBtn.textContent = state.user ? "View profile" : "Sign in / Create account";
    }
}

async function hydrateAuth() {
    try {
        const response = await authAPI.getCurrentUser();
        state.user = response?.user || null;
    } catch {
        state.user = null;
    }
    updateAccountSurface();
}

function handleLogout(event) {
    event?.preventDefault();
    authAPI.logout();
    state.user = null;
    state.profileStats = null;
    updateAccountSurface();
    showToast("Signed out.");
    if (pageId === "profile") {
        renderProfilePage();
    }
}

function toggleProfileForm(disabled) {
    if (!profileForm) return;
    Array.from(profileForm.elements).forEach((element) => {
        element.disabled = disabled;
    });
}

function setProfileStatus(message) {
    if (!profileStatusEl) return;
    profileStatusEl.innerHTML = message ? `<li>${message}</li>` : "";
}

function updateProfileSummary() {
    if (!state.user) return;
    if (profilePlanLabel) {
        profilePlanLabel.textContent = `${(state.user.plan || "Free").replace(/^./, (c) => c.toUpperCase())} plan`;
    }
    if (profileEmailLabel) {
        profileEmailLabel.textContent = state.user.email || state.user.username || "—";
    }
    const playlists = state.profileStats?.playlists?.count ?? 0;
    const liked = state.profileStats?.liked_tracks?.count ?? 0;
    const following = state.profileStats?.following?.count ?? 0;
    if (profilePlaylistsCount) profilePlaylistsCount.textContent = playlists.toString();
    if (profileLikedCount) profileLikedCount.textContent = liked.toString();
    if (profileFollowingCount) profileFollowingCount.textContent = following.toString();
}

function updateProfileFormFields() {
    if (!profileForm || !state.user) return;
    if (profileDisplayInput) {
        profileDisplayInput.value = state.user.display_name || "";
    }
    if (profileAvatarInput) {
        profileAvatarInput.value = state.user.avatar_url || "";
    }
}

async function renderProfilePage(forceFetch = false) {
    if (pageId !== "profile") return;
    if (!profileStatusEl) return;
    if (!state.user) {
        setProfileStatus("Sign in to manage your profile.");
        toggleProfileForm(true);
        if (profilePlanLabel) profilePlanLabel.textContent = "Guest";
        if (profileEmailLabel) profileEmailLabel.textContent = "Sign in to personalise";
        if (profilePlaylistsCount) profilePlaylistsCount.textContent = "0";
        if (profileLikedCount) profileLikedCount.textContent = "0";
        if (profileFollowingCount) profileFollowingCount.textContent = "0";
        return;
    }

    toggleProfileForm(false);
    setProfileStatus("Fetching your latest data…");
    try {
        if (forceFetch || !state.profileStats) {
            const profileData = await usersAPI.getProfile();
            state.profileStats = profileData.stats;
            state.user = { ...state.user, ...profileData.user };
        }
        updateProfileSummary();
        updateProfileFormFields();
        setProfileStatus("Profile synced.");
    } catch (error) {
        console.error("Profile fetch error:", error);
        setProfileStatus(error.message || "Failed to load profile");
    }
}

async function handleProfileForm(event) {
    event.preventDefault();
    if (!state.user) {
        openAuthModal("login");
        return;
    }
    const submitBtn = profileForm?.querySelector('button[type="submit"]');
    const formData = new FormData(profileForm);
    const payload = {
        display_name: formData.get("display_name") || state.user.display_name,
        avatar_url: formData.get("avatar_url") || state.user.avatar_url
    };
    if (submitBtn) submitBtn.disabled = true;
    try {
        const result = await usersAPI.updateProfile(payload);
        state.user = { ...state.user, ...result.user };
        updateAccountSurface();
        updateProfileSummary();
        showToast("Profile updated.");
    } catch (error) {
        console.error("Profile update error:", error);
        showToast(error.message || "Failed to update profile");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

function setupProfilePageEvents() {
    if (profileForm) {
        profileForm.addEventListener("submit", handleProfileForm);
    }
    if (profileRefreshBtn) {
        profileRefreshBtn.addEventListener("click", (event) => {
            event.preventDefault();
            renderProfilePage(true);
        });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            if (!state.user) {
                openAuthModal("login");
                return;
            }
            handleLogout();
            window.location.href = "index.html";
        });
    }
}

async function toggleLike() {
    const current = state.queue[state.index];
    if (!current) return;

    try {
        if (useAPI && current.id) {
            const result = await tracksAPI.like(current.id);
            if (result.liked) {
                state.liked.add(current.id);
                showToast(`Liked ${current.title}.`);
            } else {
                state.liked.delete(current.id);
                showToast(`Removed ${current.title} from liked.`);
            }
            btnLike.setAttribute("aria-pressed", result.liked);
        } else {
            // Local fallback
            if (state.liked.has(current.id)) {
                state.liked.delete(current.id);
                showToast(`Removed ${current.title} from liked.`);
            } else {
                state.liked.add(current.id);
                showToast(`Liked ${current.title}.`);
            }
            btnLike.setAttribute("aria-pressed", state.liked.has(current.id));
        }
    } catch (error) {
        console.error('Like error:', error);
        showToast('Please login to like tracks.');
    }
}

function addCurrentToQueueEnd() {
    const current = state.queue[state.index];
    if (!current) return;
    state.queue.push(current);
    renderQueue();
    showToast(`${current.title} duplicated to queue.`);
}

function clearQueueKeepingCurrent() {
    const current = state.queue[state.index];
    if (!current) return;
    state.queue = [current];
    state.index = 0;
    renderQueue();
    showToast("Queue cleared except now playing.");
}

function toggleHeroBookmark() {
    const heroTrack = getTrackById(state.heroTrackId);
    if (!heroTrack) return;
    if (state.savedCollections.has(heroTrack.id)) {
        state.savedCollections.delete(heroTrack.id);
        showToast(`Removed ${heroTrack.title} from Library.`);
    } else {
        state.savedCollections.add(heroTrack.id);
        showToast(`Saved ${heroTrack.title} to Library.`);
    }
    btnHeroBookmark.setAttribute("aria-pressed", state.savedCollections.has(heroTrack.id));
}

function shareCurrentTrack() {
    const current = state.queue[state.index];
    if (!current) return;
    const shareText = `Listening to ${current.title} by ${current.artist} on Lumous.`;
    if (navigator.share) {
        navigator.share({ title: current.title, text: shareText }).catch(() => {
            navigator.clipboard?.writeText(shareText);
            showToast("Copied track share link to clipboard.");
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => showToast("Copied track details."));
    } else {
        showToast(shareText);
    }
}

function setupObservers() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    [".hero-card", ".content-section", ".panel-card"].forEach((selector) => {
        $$(selector).forEach((element) => observer.observe(element));
    });
}

function setupEventListeners() {
    accountBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        if (state.user) {
            if (pageId !== "profile") {
                window.location.href = "profile.html";
            }
        } else {
            openAuthModal("login");
        }
    });

    btnPlay.addEventListener("click", togglePlay);
    btnPrev.addEventListener("click", prev);
    btnNext.addEventListener("click", next);

    btnShuffle.addEventListener("click", () => {
    state.shuffle = !state.shuffle;
        btnShuffle.setAttribute("aria-pressed", state.shuffle);
        showToast(state.shuffle ? "Shuffle engaged." : "Shuffle off.");
});

    btnRepeat.addEventListener("click", () => {
    state.repeat = !state.repeat;
        audio.loop = state.repeat;
        btnRepeat.setAttribute("aria-pressed", state.repeat);
        showToast(state.repeat ? "Repeat enabled." : "Repeat off.");
    });

    volume.addEventListener("input", () => {
        audio.volume = parseFloat(volume.value);
    });

    seek.addEventListener("input", () => {
        const duration = getActiveDuration();
        if (!duration) return;
        audio.currentTime = (parseFloat(seek.value) / 100) * duration;
    });

    audio.addEventListener("loadedmetadata", () => {
        const total = getActiveDuration();
        timeTotal.textContent = secondsToClock(total);
        if (audio.currentTime === 0) {
            seek.value = "0";
            timeCurrent.textContent = "0:00";
        }
    });

    audio.addEventListener("timeupdate", () => {
        const current = audio.currentTime;
        const total = getActiveDuration();
        timeCurrent.textContent = secondsToClock(current);
        timeTotal.textContent = secondsToClock(total);
        if (total) {
            seek.value = ((current / total) * 100).toString();
        }
    });

    // Track play count on play
    audio.addEventListener("play", async () => {
        const current = state.queue[state.index];
        if (useAPI && current?.id) {
            try {
                await tracksAPI.incrementPlay(current.id);
            } catch (e) {
                // Silent fail
            }
        }
    });

    audio.addEventListener("ended", () => {
        if (state.repeat) {
            audio.currentTime = 0;
            play();
        } else {
    next();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.target.closest("input,textarea")) return;
        if (event.code === "Space") {
            event.preventDefault();
            togglePlay();
        }
        if (event.code === "ArrowRight") next();
        if (event.code === "ArrowLeft") prev();
    });

    btnLike.addEventListener("click", toggleLike);
    btnAddQueue.addEventListener("click", addCurrentToQueueEnd);
    btnClearQueue.addEventListener("click", clearQueueKeepingCurrent);
    btnShare.addEventListener("click", shareCurrentTrack);
    btnOpenLyrics.addEventListener("click", () => showToast("Lyrics synced beta coming soon."));
    btnLyrics.addEventListener("click", () => showToast("Opening immersive lyrics mode."));
    btnDevice.addEventListener("click", () => showToast("Connect to Lumous Beam device."));
    btnHeroPlay.addEventListener("click", () => playTrackById(state.heroTrackId));
    btnHeroBookmark.addEventListener("click", toggleHeroBookmark);

    $("#btn-now-playing")?.addEventListener("click", () => showToast("Tuning into live Lumous sessions."));
    $("#btn-notifications")?.addEventListener("click", () => showToast("Notifications synced."));
    $("#btn-settings")?.addEventListener("click", () => showToast("Opening preferences soon."));
    $("#btn-new-collection")?.addEventListener("click", () => showToast("Create collaborative collections in Lumous+."));
    $("#btn-manage-following")?.addEventListener("click", () => showToast("Manage followed artists in profile."));

    searchInput?.addEventListener("input", handleSearchInput);

    document.addEventListener("click", (event) => {
        const target = event.target.closest("[data-track-id]");
        if (!target) return;
        const trackId = target.getAttribute("data-track-id");
        if (!trackId) return;
        event.preventDefault();
        playTrackById(trackId);
        const track = getTrackById(trackId);
        if (track) {
            showToast(`Tuning into ${track.title}.`);
        }
    });
}

async function init() {
    updateAccountSurface();

    // Try to load from API first
    if (API_ENABLED) {
        try {
            await loadFromAPI();
            useAPI = true;
        } catch (error) {
            console.warn('API not available, using local catalog:', error);
            useAPI = false;
        }
    }

    // Fallback to local catalog
    if (!useAPI) {
        renderHero();
        renderCollections();
        renderFollowingArtists();
        renderMoods();
        renderMixes();
        renderReleases();
        renderLiveChannels();
        renderQueue();
        renderActivity();
    }

    setSource(state.queue[state.index]);
    reflectPlayState();

    setupObservers();
    setupEventListeners();

    if (pageId === "profile") {
        setupProfilePageEvents();
        renderProfilePage();
    }

    btnLike.setAttribute("aria-pressed", state.liked.has(state.queue[state.index]?.id));

    await hydrateAuth();

    if (pageId === "profile") {
        await renderProfilePage(true);
    }
}

async function loadFromAPI() {
    try {
        const [
            tracksData,
            collectionsData,
            featuredData,
            activityData
        ] = await Promise.all([
            tracksAPI.getAll(),
            collectionsAPI.getAll(),
            tracksAPI.getFeatured(),
            activityAPI.getRecent(8)
        ]);

        if (tracksData.tracks && tracksData.tracks.length > 0) {
            const normalized = tracksData.tracks.map(normalizeApiTrack);
            catalog.tracks = normalized;
            catalog.releases = normalized.slice(0, 8).map(releaseFromTrack);
            state.queue = [...catalog.tracks];
            state.heroTrackId = catalog.tracks.find(t => t.spotlight)?.id ?? catalog.tracks[0]?.id;
        }

        if (collectionsData.collections && collectionsData.collections.length > 0) {
            catalog.collections = collectionsData.collections.map(c => ({
                id: c.id.toString(),
                name: c.name,
                subtitle: c.subtitle,
                color: c.color_gradient,
                trackIds: (c.tracks || []).map(track => track.id.toString())
            }));
        }

        if (featuredData.tracks && featuredData.tracks.length > 0) {
            const hero = featuredData.tracks[0];
            state.heroTrackId = hero.id.toString();
        }

        if (activityData.activities && activityData.activities.length > 0) {
            catalog.activity = activityData.activities.map(event => ({
                id: event.id.toString(),
                message: event.message,
                time: formatRelativeTime(event.created_at)
            }));
        }

        renderHero();
        renderCollections();
        renderFollowingArtists();
        renderMoods();
        renderMixes();
        renderReleases(catalog.releases);
        renderLiveChannels();
        renderQueue();
        renderActivity();

        try {
            const likedData = await tracksAPI.getLiked();
            if (likedData.tracks) {
                likedData.tracks.forEach(track => {
                    state.liked.add(track.id.toString());
                });
            }
        } catch (e) {
            // User might be browsing without auth
        }
    } catch (error) {
        console.error('Failed to load from API:', error);
        throw error;
    }
}

init();
