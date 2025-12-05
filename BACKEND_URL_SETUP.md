# ✅ Backend URL Configuration - Complete

## 🎯 What Was Done

Your project has been successfully configured to work with **environment variables** instead of hardcoded URLs. This allows you to easily deploy to Vercel or any other hosting platform.

## 📝 Summary of Changes

### 1. **Created Configuration Files**

#### `frontend/.env`
```env
REACT_APP_API_URL=http://localhost:5000
```
- This is for local development
- **Update this after deploying your backend to Vercel**

#### `frontend/.env.example`
```env
REACT_APP_API_URL=http://localhost:5000
```
- Template file for other developers

#### `frontend/src/config/api.js`
```javascript
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```
- Centralized API configuration

#### `backend/vercel.json`
- Vercel deployment configuration for Node.js backend

### 2. **Updated All API Calls**

All files now use the environment variable instead of hardcoded `http://localhost:5000`:

**API Files:**
- ✅ `src/api/booking.js`
- ✅ `src/api/job.js`
- ✅ `src/api/vehicleService.js`
- ✅ `src/api/data.js`

**Page Files:**
- ✅ `src/pages/Login.jsx`
- ✅ `src/pages/Register.jsx`
- ✅ `src/pages/AdminRegister.jsx`
- ✅ `src/pages/MyBooking.jsx`
- ✅ `src/pages/admin/AdminJobView.jsx`
- ✅ `src/pages/admin/ServicePage.jsx`

## 🚀 How to Find Your Backend URL

### **Step 1: Deploy Backend to Vercel**

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click **"Add New Project"**
4. Select your repository
5. **Important:** Set root directory to `backend`
6. Add environment variables in Vercel dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `SENDGRID_API_KEY`
   - `PORT` (set to 5000)
7. Click **"Deploy"**

### **Step 2: Get Your Backend URL**

After deployment completes, Vercel will show you a URL like:
```
https://moto-care-backend.vercel.app
```
or
```
https://your-project-name-backend.vercel.app
```

**This is your backend URL!** 🎉

### **Step 3: Update Frontend Configuration**

Update your `frontend/.env` file:
```env
REACT_APP_API_URL=https://moto-care-backend.vercel.app
```

### **Step 4: Deploy Frontend to Vercel**

1. Create **another new project** in Vercel
2. Select the same repository
3. **Important:** Set root directory to `frontend`
4. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://moto-care-backend.vercel.app` (your backend URL)
5. Click **"Deploy"**

## 🔧 Local Development

Your local setup still works! Just use:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

The `.env` file automatically uses `http://localhost:5000` for local development.

## 📋 Deployment Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set in Vercel
- [ ] Backend URL copied
- [ ] Frontend `.env` updated with backend URL
- [ ] Frontend environment variable set in Vercel
- [ ] Frontend deployed to Vercel
- [ ] CORS updated in backend to allow frontend URL
- [ ] Test login/register on production
- [ ] Test booking creation on production

## 🔐 Security Notes

- ✅ `.env` is in `.gitignore` - your secrets are safe
- ⚠️ **Never commit** API keys or database credentials to GitHub
- 🔄 Use Vercel's environment variables for production secrets

## 📚 Documentation

For detailed deployment steps, see: **`VERCEL_DEPLOYMENT_GUIDE.md`**

## 🆘 Need Help?

If you get CORS errors after deployment:

1. Open `backend/server.js`
2. Update CORS settings to include your frontend URL:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app' // Add this
  ]
}));
```

3. Redeploy backend

---

**You're all set!** 🎉 Your backend URL will be whatever Vercel assigns after you deploy.
