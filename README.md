# 🎵 Lumous - Immersive Music Streaming Platform

A fullstack music streaming platform with a beautiful, modern interface featuring eye-catching colors and smooth animations. Built with vanilla JavaScript, Express.js, and SQLite.

![Lumous Platform](https://img.shields.io/badge/Lumous-Music%20Platform-7f5cff?style=for-the-badge)

## ✨ Features

- 🎨 **Stunning UI** - Modern, gradient-rich interface with smooth animations
- 🎧 **Music Streaming** - Play, pause, shuffle, repeat, and queue management
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- 🔐 **User Authentication** - JWT-based authentication system
- 📚 **Playlists** - Create, manage, and share playlists
- ❤️ **Likes & Favorites** - Like tracks and build your library
- 🔍 **Advanced Search** - Search tracks, artists, and playlists
- 📊 **Collections** - Curated mood-based collections
- 🎯 **Activity Feed** - Real-time community updates
- 🎭 **Live Channels** - Broadcast and join live music sessions
- 👤 **Profile Management** - Dedicated profile page with editable identity fields

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd "Sem 3 mini project 2"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and update the configuration if needed.

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Seed the database with demo data**
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Open the frontend**
   - Serve the root folder (e.g., VS Code Live Server, `python -m http.server 5500`, etc.)
   - Primary entry points: `index.html` (Discover), `explore.html`, `radio.html`, `live.html`, `library.html`, `profile.html`
   - The API will be available at `http://localhost:3000/api`

## 📁 Project Structure

```
lumous-music-platform/
├── index.html          # Discover surface
├── explore.html        # Explore journeys page
├── radio.html          # Radio control room
├── live.html           # Live rooms dashboard
├── library.html        # Personal library hub
├── profile.html        # Account & profile management
├── styles.css          # Frontend styles
├── script.js           # Frontend JavaScript
├── server.js           # Express server entry point
├── package.json        # Dependencies and scripts
├── env.example         # Environment variables template
├── database/
│   └── db.js           # Database initialization
├── middleware/
│   └── auth.js         # JWT authentication
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── tracks.js       # Track management
│   ├── playlists.js    # Playlist CRUD
│   ├── users.js        # User profiles
│   ├── collections.js  # Collections
│   └── search.js       # Search functionality
└── scripts/
    └── seed-db.js      # Database seeding
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tracks
- `GET /api/tracks` - Get all tracks (with filters)
- `GET /api/tracks/:id` - Get single track
- `GET /api/tracks/:id/stream` - Stream audio for the track (supports local or remote files)
- `POST /api/tracks/:id/like` - Like/unlike track (auth required)
- `GET /api/tracks/liked/all` - Get user's liked tracks (auth required)
- `GET /api/tracks/featured/spotlight` - Get featured tracks
- `POST /api/tracks/:id/play` - Increment play count

### Playlists
- `GET /api/playlists` - Get user's playlists (auth required)
- `GET /api/playlists/:id` - Get playlist with tracks (auth required)
- `POST /api/playlists` - Create playlist (auth required)
- `PUT /api/playlists/:id` - Update playlist (auth required)
- `DELETE /api/playlists/:id` - Delete playlist (auth required)
- `POST /api/playlists/:id/tracks` - Add track to playlist (auth required)
- `DELETE /api/playlists/:id/tracks/:trackId` - Remove track (auth required)

### Users
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update profile (auth required)
- `POST /api/users/follow` - Follow user/artist (auth required)
- `DELETE /api/users/follow/:followingId` - Unfollow (auth required)
- `GET /api/users/activity` - Get activity feed (auth required)

### Collections
- `GET /api/collections` - Get all collections
- `GET /api/collections/:id` - Get single collection

### Activity
- `GET /api/activity` - Get the public activity feed

### Search
- `GET /api/search?q=query` - Global search

## 🎨 Frontend Features

### Interactive Elements
- **Hero Section** - Featured track with animated waveform
- **Mood Cards** - Curated mood-based collections
- **Mix Grid** - AI-powered mixtapes
- **Release List** - Latest releases with metadata
- **Live Channels** - Real-time broadcast channels
- **Queue Management** - Visual queue with drag-to-reorder
- **Now Playing Panel** - Current track with controls
- **Authentication Surface** - Modal login/signup plus full profile management page
- **Dedicated Views** - Explore, Radio, Live Rooms, and Library layouts with bespoke editorial content

### Animations
- Floating gradient orbs in background
- Smooth card hover effects
- Scroll-triggered reveals
- Pulsing waveform visualizations
- Button press animations

## 🔐 Demo Credentials

After seeding the database:
- **Username:** `demo`
- **Password:** `demo123`

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

### Database Management
```bash
# Initialize database
npm run init-db

# Seed with demo data
npm run seed
```

### Environment Variables
Key variables in `.env`:
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret for JWT tokens
- `FRONTEND_URL` - CORS origin
- `DB_PATH` - SQLite database path

## 📝 Notes

- The frontend uses vanilla JavaScript (no frameworks)
- Backend uses Express.js with SQLite for simplicity
- Audio files are currently hosted externally (Pixabay CDN)
- For production, consider:
  - Using PostgreSQL or MongoDB
  - Implementing file upload for tracks
  - Adding CDN for static assets
  - Setting up proper authentication middleware
  - Adding rate limiting
  - Implementing caching

## 🎯 Future Enhancements

- [ ] Real-time WebSocket connections for live features
- [ ] File upload for custom tracks
- [ ] Advanced audio visualization
- [ ] Social features (comments, shares)
- [ ] Recommendation engine
- [ ] Offline playback support
- [ ] Progressive Web App (PWA)
- [ ] Multi-language support

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Credits

- Music tracks from [Pixabay](https://pixabay.com/music/)
- Images from [Unsplash](https://unsplash.com/)
- Icons and UI inspiration from modern music platforms

---

**Built with ❤️ for music lovers**

For questions or issues, please open an issue on the repository.

