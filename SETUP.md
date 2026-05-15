# 🚀 Lumous Setup Guide

Quick setup instructions to get your Lumous music platform running.

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Express.js (backend server)
- SQLite3 (database)
- JWT (authentication)
- bcryptjs (password hashing)
- And more...

## Step 2: Configure Environment

Copy the example environment file:
```bash
cp env.example .env
```

The default settings should work, but you can customize:
- `PORT` - Backend server port (default: 3000)
- `JWT_SECRET` - Change this in production!
- `FRONTEND_URL` - Your frontend URL for CORS

## Step 3: Initialize Database

Create the database tables:
```bash
npm run init-db
```

## Step 4: Seed Demo Data

Populate the database with sample tracks and collections:
```bash
npm run seed
```

This creates:
- 8 demo tracks
- 3 collections
- 1 demo user (username: `demo`, password: `demo123`)
- Sample activity feed

## Step 5: Start the Backend

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
✨ Lumous server running on port 3000
🌐 API available at http://localhost:3000/api
📊 Health check: http://localhost:3000/api/health
```

## Step 6: Open the Frontend

1. **Option A: VS Code Live Server**
   - Right-click `index.html`
   - Select "Open with Live Server"

2. **Option B: Python HTTP Server**
   ```bash
   python -m http.server 5500
   ```
   Then open: `http://localhost:5500`

3. **Option C: Direct File**
   - Simply open `index.html` in your browser
   - Note: Some features may not work due to CORS

## Step 7: Test the Connection

1. Open browser console (F12)
2. Check for any API connection errors
3. The app should automatically load tracks from the backend
4. If the backend is not running, it will fall back to local data

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Make sure Node.js 18+ is installed
- Check that `data/` directory exists (it will be created automatically)

### Frontend can't connect to API
- Ensure backend is running on port 3000
- Check browser console for CORS errors
- Verify `API_ENABLED = true` in `script.js`
- Check `FRONTEND_URL` in `.env` matches your frontend URL

### Database errors
- Delete `data/lumous.db` and run `npm run init-db` again
- Make sure you have write permissions in the project directory

### Module import errors
- Ensure you're using a modern browser that supports ES6 modules
- Use a local server (not `file://` protocol)

## Next Steps

- **Login**: Use demo credentials (demo/demo123) to test authenticated features
- **Explore**: Browse tracks, collections, and playlists
- **Create**: Make your own playlists (requires login)
- **Customize**: Modify tracks, add your own music, customize the UI

## Production Deployment

For production:
1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use a production database (PostgreSQL recommended)
4. Set up proper file storage for audio files
5. Configure HTTPS
6. Set up reverse proxy (nginx)
7. Enable rate limiting
8. Add monitoring and logging

---

**Enjoy your Lumous music platform! 🎵**

