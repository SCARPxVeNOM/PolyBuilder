# 🚀 Vercel Deployment Guide

Complete guide to deploy your Polygon Scaffold Platform to Vercel.

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ GitHub account with your repository
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Your environment variables ready:
  - `DEPLOYER_PRIVATE_KEY` - Your wallet private key with POL tokens
  - `POLYGONSCAN_API_KEY` - Get from [polygonscan.com/myapikey](https://polygonscan.com/myapikey)
  - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Get from [cloud.walletconnect.com](https://cloud.walletconnect.com)

## 🎯 Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended for First Time)

#### Step 1: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository: `SCARPxVeNOM/PolyBuilder`
4. Click **"Import"**

#### Step 2: Configure Project

Vercel will auto-detect Next.js settings:
- **Framework Preset**: Next.js ✅ (Auto-detected)
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅

#### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

```env
# Required for deployment
DEPLOYER_PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Optional but recommended
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional: Custom RPC URLs
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_RPC_URL=https://polygon-rpc.com

# Application
NEXT_PUBLIC_APP_NAME=Polygon Scaffold Platform
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Important:** 
- Never commit these values to GitHub
- Use different private keys for testnet and mainnet
- Keep your Polygonscan API key secret

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Get your live URL: `https://your-project.vercel.app`

---

### Option 2: Deploy via CLI

#### Step 1: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### Step 2: Deploy

```bash
# Development deployment (preview)
vercel

# Production deployment
vercel --prod
```

#### Step 3: Add Environment Variables via CLI

```bash
# Add secrets
vercel env add DEPLOYER_PRIVATE_KEY
vercel env add POLYGONSCAN_API_KEY
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

# For each command:
# 1. Choose environment: Production, Preview, Development (select all)
# 2. Paste the value
# 3. Press Enter
```

---

## 🔧 Post-Deployment Configuration

### 1. Update Your Repository

Add your Vercel URL to `package.json`:
```json
{
  "homepage": "https://your-project.vercel.app"
}
```

### 2. Configure Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed

### 3. Set up Automatic Deployments

Vercel automatically deploys on every push to `main`:
- ✅ **Production**: Deploys from `main` branch
- ✅ **Preview**: Deploys from pull requests
- ✅ **Branch Deployments**: Each branch gets a unique URL

### 4. Monitor Deployments

View deployment status:
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Analytics: Built-in performance monitoring
- Logs: Real-time deployment logs

---

## 🎨 Vercel Features Enabled

Your deployment includes:

- ✅ **Edge Network** - Global CDN for fast loading
- ✅ **Auto SSL** - HTTPS enabled by default
- ✅ **Serverless Functions** - API routes auto-scaled
- ✅ **Environment Variables** - Secure secret management
- ✅ **Git Integration** - Auto-deploy on push
- ✅ **Preview Deployments** - Test before production
- ✅ **Analytics** - Built-in performance tracking

---

## 🔒 Security Best Practices

### Environment Variables

1. **Never commit** `.env.local` to Git
2. **Use different keys** for development and production
3. **Rotate keys regularly** (every 3-6 months)
4. **Limit API access** - Only enable what you need

### Private Key Management

```bash
# Generate a new wallet for deployment (recommended)
# Use a dedicated deployment wallet with limited funds

# For testnet: Fund with test tokens only
# For mainnet: Keep minimum balance needed
```

### API Key Security

- Use read-only Polygonscan keys when possible
- Monitor API usage in Polygonscan dashboard
- Regenerate if compromised

---

## 🐛 Troubleshooting

### Build Fails

**Error**: "Build command failed"
```bash
# Solution: Test build locally first
npm run build

# If successful locally, check Vercel logs
vercel logs
```

**Error**: "Module not found"
```bash
# Solution: Clear cache and redeploy
vercel --force
```

### Environment Variables Not Working

1. Check variable names match exactly (case-sensitive)
2. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```
3. Variables starting with `NEXT_PUBLIC_` are exposed to browser

### API Routes Not Working

- Verify API routes are in `app/api/` directory
- Check function logs in Vercel dashboard
- Ensure environment variables are set

### Slow Performance

1. Enable **Edge Functions** in Vercel settings
2. Use **Image Optimization** for images
3. Check **Analytics** for bottlenecks

---

## 📊 Monitoring & Analytics

### Built-in Analytics

Vercel provides:
- Page load times
- Web Vitals (LCP, FID, CLS)
- Geographic distribution
- Device breakdown

Access at: `https://vercel.com/your-username/your-project/analytics`

### Custom Monitoring

Add your own:
```typescript
// app/layout.tsx
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL),
}
```

---

## 🔄 Continuous Deployment

### Automatic Workflow

```
Developer Push → GitHub → Vercel Webhook → Build → Deploy → Live
```

### Branch Strategy

- `main` → Production (https://your-project.vercel.app)
- `develop` → Preview (https://your-project-git-develop.vercel.app)
- Pull Requests → Unique preview URLs

---

## 💡 Tips & Best Practices

### Performance

1. **Enable ISR** (Incremental Static Regeneration)
   ```typescript
   export const revalidate = 3600; // Revalidate every hour
   ```

2. **Use Edge Runtime** for API routes
   ```typescript
   export const runtime = 'edge';
   ```

3. **Optimize Images**
   ```typescript
   import Image from 'next/image';
   ```

### SEO

1. Add metadata to pages
2. Generate sitemap
3. Configure robots.txt

### Cost Optimization

- Free tier includes:
  - 100 GB bandwidth/month
  - 6000 build minutes/month
  - Unlimited team members
  - Automatic SSL

---

## 🆘 Support

Need help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables added
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Updated README with live URL
- [ ] Tested wallet connection
- [ ] Tested contract deployment
- [ ] Verified API routes work
- [ ] Checked responsive design
- [ ] Set up custom domain (optional)
- [ ] Configured analytics
- [ ] Added error monitoring

---

**Your Polygon Scaffold Platform is ready to go live! 🚀**

Deploy now: [vercel.com/new](https://vercel.com/new)

