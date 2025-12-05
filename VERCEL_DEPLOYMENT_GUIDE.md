# Vercel Deployment Guide for MotoCare

## 📋 Overview
This guide explains how to deploy your MotoCare project (frontend + backend) to Vercel.

## 🚀 Deployment Steps

### 1. **Deploy Backend to Vercel**

#### A. Prepare Backend
1. Your backend already has a `vercel.json` configuration file
2. Make sure all dependencies are in `package.json`

#### B. Deploy Backend
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Select the **`backend`** folder as the root directory
5. Vercel will auto-detect it as a Node.js project

#### C. Set Environment Variables in Vercel
In your Vercel project settings, add these environment variables:

**Key-Value pairs to add:**

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://motocare:motocarep@motocare.ltnksjw.mongodb.net/?retryWrites=true&w=majority&appName=motocare` |
| `JWT_SECRET` | `mySuperSecretKey123` |
| `SENDGRID_API_KEY` | `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` |
| `PORT` | `5000` |

**Important Notes:**
- ⚠️ Do NOT use the `@secret-name` syntax - just paste the actual values directly
- ⚠️ Make sure there are no extra spaces before or after the values
- ✅ The environment variables are set in Vercel Dashboard, NOT in `vercel.json`

⚠️ **IMPORTANT**: Never commit your `.env` file to GitHub. Use Vercel's environment variables feature.

#### D. Get Your Backend URL
After deployment, Vercel will give you a URL like:
```
https://your-backend-name.vercel.app
```

### 2. **Deploy Frontend to Vercel**

#### A. Update Frontend Environment Variable
1. Open `frontend/.env` file
2. Update the `REACT_APP_API_URL` with your deployed backend URL:

```env
REACT_APP_API_URL=https://your-backend-name.vercel.app
```

#### B. Deploy Frontend
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** again
3. Import the same repository
4. Select the **`frontend`** folder as the root directory
5. Vercel will auto-detect it as a React project

#### C. Set Environment Variable in Vercel
In your frontend Vercel project settings, add:

```
REACT_APP_API_URL=https://your-backend-name.vercel.app
```

### 3. **Update Backend CORS Settings**

After deploying your frontend, you need to update your backend to allow requests from your frontend URL.

Edit `backend/server.js`:

```javascript
const cors = require('cors');

// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', // Local development
    'https://your-frontend-name.vercel.app' // Production frontend
  ],
  credentials: true
}));
```

Redeploy your backend after making this change.

## 📁 File Structure Updates Made

### Files Created:
1. **`frontend/.env`** - Local environment configuration
2. **`frontend/.env.example`** - Example environment file
3. **`frontend/src/config/api.js`** - Centralized API URL configuration
4. **`backend/vercel.json`** - Vercel deployment configuration

### Files Updated:
All API calls now use environment variables instead of hardcoded URLs:
- `frontend/src/api/booking.js`
- `frontend/src/api/job.js`
- `frontend/src/api/vehicleService.js`
- `frontend/src/api/data.js`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`
- `frontend/src/pages/AdminRegister.jsx`
- `frontend/src/pages/MyBooking.jsx`
- `frontend/src/pages/admin/AdminJobView.jsx`
- `frontend/src/pages/admin/ServicePage.jsx`

## 🔍 How to Find Your Backend URL

### Option 1: After Deploying to Vercel
1. Deploy your backend project to Vercel
2. Go to your project dashboard
3. You'll see the deployment URL at the top: `https://your-project.vercel.app`
4. Copy this URL

### Option 2: Custom Domain (Optional)
1. In Vercel project settings, go to **Domains**
2. Add a custom domain like `api.motocare.com`
3. Use this as your `REACT_APP_API_URL`

## 🧪 Testing

### Local Testing (Before Deployment):
```bash
# Frontend
cd frontend
npm start

# Backend (in another terminal)
cd backend
npm start
```

### After Deployment:
1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Test login, registration, and booking features
3. Check browser console for any CORS or API errors

## 🔐 Security Reminders

1. **Never commit `.env` files** to GitHub
2. Add `.env` to your `.gitignore`:
   ```
   # Environment variables
   .env
   .env.local
   .env.production
   ```
3. Use different secrets for production vs development
4. Rotate your API keys regularly

## 📝 Quick Reference

### Environment Variables

**Frontend (.env):**
```env
REACT_APP_API_URL=https://your-backend.vercel.app
```

**Backend (Vercel Dashboard):**
```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
SENDGRID_API_KEY=<your-sendgrid-key>
PORT=5000
```

## 🆘 Troubleshooting

### CORS Errors
- Make sure your backend CORS settings include your frontend URL
- Redeploy backend after updating CORS

### API Not Found (404)
- Verify `REACT_APP_API_URL` is set correctly
- Check that backend is deployed and running

### Environment Variables Not Working
- Restart your local dev server after changing `.env`
- In production, redeploy after changing Vercel environment variables

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Deploying Node.js Apps](https://vercel.com/docs/frameworks/more-frameworks#node.js)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Need help?** Check the Vercel deployment logs for detailed error messages.
