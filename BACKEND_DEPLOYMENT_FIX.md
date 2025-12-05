# Backend Deployment to Vercel - Fix Guide

## ✅ Changes Made to Fix Serverless Crashes

### 1. **server.js Updates**
- ✅ Removed `app.listen()` from production (serverless doesn't use it)
- ✅ Added `module.exports = app` to export for Vercel
- ✅ Added database connection middleware for API routes
- ✅ Added global error handler
- ✅ Conditional static file serving (uploads only in development)

### 2. **config/db.js Updates**
- ✅ Added connection caching for serverless efficiency
- ✅ Added serverless-friendly timeouts
- ✅ Removed `process.exit(1)` that crashes serverless functions
- ✅ Returns connection for reuse

### 3. **vercel.json Configuration**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4. **Files Created**
- ✅ `.vercelignore` - Excludes unnecessary files from deployment
- ✅ `.env.example` - Template for required environment variables

## 🚀 Deployment Steps

### Step 1: Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

1. **MONGO_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

2. **JWT_SECRET**
   - A secure random string for JWT token generation
   - Example: Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **SENDGRID_API_KEY**
   - Your SendGrid API key for email service
   - Get from: https://app.sendgrid.com/settings/api_keys

4. **NODE_ENV**
   - Set to: `production`

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
cd backend
vercel --prod
```

#### Option B: Using Git Integration
1. Push your changes to GitHub
2. Vercel will automatically deploy

### Step 3: Update Frontend .env

After backend is deployed, update `frontend/.env`:
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

Replace `your-backend-url` with your actual Vercel backend URL.

### Step 4: Verify Deployment

Test your backend by visiting:
- `https://your-backend-url.vercel.app/` - Should show "Api is working..5"
- `https://your-backend-url.vercel.app/api/services` - Should connect to DB and return data

## 🐛 Troubleshooting

### If you still see 500 errors:

1. **Check Vercel Logs**
   - Go to your Vercel project → Deployments → Click on latest deployment → View Function Logs

2. **Common Issues:**
   - ❌ Missing environment variables → Check Settings → Environment Variables
   - ❌ MongoDB connection fails → Verify MONGO_URI is correct and MongoDB allows Vercel IPs
   - ❌ JWT_SECRET missing → Add it to environment variables

3. **MongoDB Atlas Setup**
   - Go to Network Access → Add `0.0.0.0/0` to allow all IPs (or Vercel's IPs)
   - Database Access → Ensure user has read/write permissions

## 📝 Local Development

To run locally after these changes:
```bash
cd backend
npm start
```

The server will run on `http://localhost:5000` as before.

## ✨ What's Different for Serverless

- Database connections are cached and reused
- No persistent server - each request is handled independently
- Static files (uploads) won't work - use cloud storage like Cloudinary or AWS S3
- Environment variables must be set in Vercel dashboard
