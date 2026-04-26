# 🚀 Vercel Deployment Guide

This guide will help you deploy your Market Intelligence Project to Vercel with automatic CI/CD.

## 📋 Prerequisites

- GitHub repository already set up (✅ Done)
- Vercel account (free at [vercel.com](https://vercel.com))
- Node.js installed locally

## 🔗 Method 1: Connect GitHub Repository (Recommended)

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `josep06-en/market-intelligence-project`

### Step 2: Configure Build Settings

Vercel will automatically detect your settings. Verify:

```json
{
  "Build Command": "cd frontend && npm run build",
  "Output Directory": "frontend/dist",
  "Install Command": "cd frontend && npm install"
}
```

### Step 3: Deploy

Click **"Deploy"** and wait for the build to complete.

### Step 4: Automatic Deployments

Your project is now set up for:
- ✅ Automatic deployments on push to `main` branch
- ✅ Preview deployments for pull requests
- ✅ Custom domain support

## 🖥️ Method 2: Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy from Project Root

```bash
cd "c:\Users\Josep Segarro\Desktop\market-intelligence-project"
vercel
```

Follow the prompts:
- Link to existing project (if already deployed)
- Or create new project
- Confirm build settings

### Step 4: Deploy with CI/CD

```bash
# Enable automatic deployments
vercel --prod
```

## ⚙️ Configuration Details

### vercel.json Explained

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/data/(.*)",
      "dest": "/data/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

**What this does:**
- Builds the frontend using Vite
- Serves static data files from `/data/` directory
- Routes all other requests to the frontend app

### Environment Variables

No environment variables are required for this project. Vercel automatically sets:
- `NODE_ENV=production`

## 🎯 Deployment Features

### ✅ What You Get

- **Automatic HTTPS**: Free SSL certificate
- **Global CDN**: Fast loading worldwide
- **Preview Deployments**: Test changes before merging
- **Custom Domains**: Add your own domain
- **Analytics**: Built-in performance analytics
- **Zero Downtime**: Seamless deployments

### 📱 Mobile Optimization

Your app is already optimized for mobile devices:
- Responsive design with Tailwind CSS
- Touch-friendly navigation
- Optimized images and assets
- Fast loading with Vite's build optimization

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Verify `frontend/vite.config.ts` settings

2. **Data Files Not Loading**
   - Ensure `/data/` directory is committed to git
   - Check routing in `vercel.json`

3. **404 Errors**
   - Verify routes configuration in `vercel.json`
   - Check that `base` path in Vite config is `/`

### Debug Mode

Add debug logging to your build:
```bash
vercel --debug
```

## 🌐 Custom Domain Setup

1. In Vercel dashboard, go to **"Settings"** → **"Domains"**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provision

## 📊 Performance Optimization

Your app is already optimized with:
- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Images and fonts optimized
- **Caching**: Proper cache headers set

## 🔄 CI/CD Pipeline

Your deployment pipeline:

```
Git Push → Vercel Build → Deploy → Live URL
```

### Branch Strategy

- `main` → Production deployment
- `feature/*` → Preview deployments
- Pull requests → Automatic preview environments

## 📈 Monitoring

Vercel provides:
- **Build Logs**: Real-time build status
- **Function Logs**: API and serverless logs
- **Performance Metrics**: Core Web Vitals
- **Error Tracking**: Automatic error capture

## 🎉 Success!

Once deployed, your app will be available at:
- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-branch-name.your-project.vercel.app`

Your Market Intelligence Project is now live with:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Mobile-optimized
- ✅ CI/CD pipeline
- ✅ Preview deployments

---

**Need help?** Check [Vercel Docs](https://vercel.com/docs) or open an issue on GitHub!
