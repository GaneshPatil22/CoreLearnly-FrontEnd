# Deployment Guide

This guide covers deploying CoreLearnly Frontend to various hosting platforms.

## Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Vercel Deployment](#vercel-deployment-recommended)
- [Netlify Deployment](#netlify-deployment)
- [Cloudflare Pages](#cloudflare-pages)
- [Environment Variables](#environment-variables)
- [Post-Deployment Steps](#post-deployment-steps)
- [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Added required assets to `public/` directory:
  - `syllabus.pdf` - Course syllabus
  - `mentor.jpg` - Mentor photo
  - `og-image.png` - Social sharing image (1200x630px)
- [ ] Updated mentor information in `src/components/sections/MentorSection.tsx`
- [ ] Set up Supabase project with RLS policies (see `SUPABASE-SETUP.md`)
- [ ] Tested the build locally: `npm run build && npm run preview`
- [ ] Verified all environment variables are ready
- [ ] Updated URLs in `public/sitemap.xml` if domain differs from corelearnly.com
- [ ] Updated `public/robots.txt` sitemap URL if needed

---

## Vercel Deployment (Recommended)

Vercel is the recommended platform due to its simplicity and excellent React/Vite support.

### Option 1: Deploy via Vercel Dashboard

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect the framework settings

3. **Configure Build Settings**
   Vercel should auto-detect these, but verify:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add the following:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Make sure to add them for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? [Y/n] Y
# - Which scope? Select your account
# - Link to existing project? [y/N] N
# - Project name? CoreLearnly-Frontend
# - Directory? ./
# - Want to override settings? [y/N] N

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

### Custom Domain on Vercel

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain (e.g., `corelearnly.com`)
4. Update DNS records as instructed by Vercel
5. Wait for SSL certificate to be issued (automatic)

---

## Netlify Deployment

### Option 1: Deploy via Netlify Dashboard

1. **Push code to GitHub** (see Vercel section step 1)

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize Netlify
   - Select your repository

3. **Configure Build Settings**
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

4. **Add Environment Variables**
   - Click "Site settings" → "Environment variables"
   - Click "Add a variable"
   - Add:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `https://random-name-123456.netlify.app`

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize new site
netlify init

# Follow prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: corelearnly-frontend
# - Build command: npm run build
# - Deploy directory: dist

# Add environment variables
netlify env:set VITE_SUPABASE_URL "your_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_key"

# Deploy
netlify deploy --prod
```

### Custom Domain on Netlify

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `corelearnly.com`)
4. Update DNS records as instructed
5. SSL certificate will be provisioned automatically

### Netlify Redirects

Create `public/_redirects` file for proper routing:

```
/*    /index.html   200
```

This ensures React Router works correctly on page refresh.

---

## Cloudflare Pages

### Deploy via Cloudflare Dashboard

1. **Push code to GitHub** (see Vercel section)

2. **Create Pages Project**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Workers & Pages"
   - Click "Create application" → "Pages" → "Connect to Git"
   - Authorize Cloudflare and select repository

3. **Configure Build**
   - **Production branch**: `main`
   - **Framework preset**: Select "Vite"
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

4. **Add Environment Variables**
   - Scroll to "Environment variables"
   - Click "Add variable"
   - Add:
     ```
     VITE_SUPABASE_URL=your_url
     VITE_SUPABASE_ANON_KEY=your_key
     ```

5. **Deploy**
   - Click "Save and Deploy"
   - Your site will be live at `https://your-project.pages.dev`

### Custom Domain on Cloudflare Pages

1. Go to your Pages project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain
5. DNS records will be configured automatically if domain is on Cloudflare

---

## Environment Variables

All platforms require these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Finding Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Click "Settings" → "API"
4. Copy "Project URL" (for `VITE_SUPABASE_URL`)
5. Copy "anon public" key (for `VITE_SUPABASE_ANON_KEY`)

### Security Notes

- NEVER commit `.env` files to Git
- The `VITE_SUPABASE_ANON_KEY` is safe to expose in frontend code
- RLS policies in Supabase protect your data
- Keep your service role key private (not used in frontend)

---

## Post-Deployment Steps

### 1. Verify Deployment

- [ ] Visit your deployed site
- [ ] Test all pages: Home, Apply, Privacy Policy, 404
- [ ] Test form submission
- [ ] Verify mobile responsiveness
- [ ] Check browser console for errors
- [ ] Test all navigation links
- [ ] Verify animations work
- [ ] Check that syllabus PDF downloads

### 2. Test Form Functionality

1. Go to `/apply` page
2. Fill out the form with test data
3. Submit the form
4. Verify:
   - Success message appears
   - Data appears in Supabase "enquiries" table
   - "enquiry_status" table also has entry
   - Email validation works
   - Phone validation works
   - All required fields enforce validation

### 3. SEO Verification

- [ ] Check meta tags with [metatags.io](https://metatags.io)
- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt is accessible: `your-domain.com/robots.txt`
- [ ] Verify sitemap is accessible: `your-domain.com/sitemap.xml`
- [ ] Test social sharing on Facebook, Twitter, LinkedIn

### 4. Performance Testing

Test with [PageSpeed Insights](https://pagespeed.web.dev/):
- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90

### 5. Analytics (Optional)

Add Google Analytics or Plausible:

**For Google Analytics:**
1. Get your tracking ID from Google Analytics
2. Add to `index.html` before `</head>`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

---

## Troubleshooting

### Build Fails

**Error: `Cannot find module...`**
- Solution: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: `Build exceeded time limit`**
- Solution: Most platforms have generous limits (10+ minutes)
- Check for infinite loops or large dependencies

**Error: `Command 'npm run build' exited with 1`**
- Solution: Run `npm run build` locally to see the actual error
- Fix TypeScript errors or ESLint warnings

### Environment Variables Not Working

**Symptoms:** Form submission fails, console shows "Supabase not configured"

**Solutions:**
1. Verify variable names start with `VITE_`
2. Check spelling of variable names
3. Re-deploy after adding variables
4. Some platforms require rebuild after env var changes
5. Check that values don't have quotes around them
6. Verify you added them to "Production" environment

### 404 on Page Refresh

**Symptoms:** Direct URLs like `/apply` return 404

**Vercel:** Should work automatically

**Netlify:** Add `public/_redirects` file:
```
/*    /index.html   200
```

**Cloudflare:** Add `public/_redirects` file (same as Netlify)

### Supabase RLS Errors

**Error:** `new row violates row-level security policy`

**Solutions:**
1. See `SUPABASE-FIX.md` for detailed RLS fixes
2. Verify RLS policies allow INSERT for anon role
3. Check that anon key is correctly set
4. Verify table permissions with `GRANT INSERT ON enquiries TO anon`
5. Temporarily disable RLS for testing (not recommended for production)

### Images Not Loading

**Symptoms:** Mentor image or OG image doesn't appear

**Solutions:**
1. Verify files are in `public/` directory
2. Check file names match exactly (case-sensitive)
3. Clear cache and hard refresh (Ctrl+Shift+R)
4. Check browser console for 404 errors
5. Verify files were included in build (check `dist/` folder locally)

### Slow Load Times

**Solutions:**
1. Enable Cloudflare CDN if using Cloudflare Pages
2. Optimize images (compress, convert to WebP)
3. Check bundle size: `npm run build`
4. Consider code splitting for large components
5. Verify hosting platform has good CDN coverage

### Form Not Submitting

**Symptoms:** Button shows loading but nothing happens

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Supabase credentials are correct
4. RLS policies allow insertions
5. Try with RLS temporarily disabled to isolate issue

---

## Monitoring and Maintenance

### Automatic Deployments

All three platforms (Vercel, Netlify, Cloudflare) support automatic deployments:
- Push to `main` branch → automatic production deploy
- Push to other branches → automatic preview deploy
- Pull requests → automatic preview deploy with unique URL

### Rollback

**Vercel:**
- Go to "Deployments"
- Find previous working deployment
- Click "..." → "Promote to Production"

**Netlify:**
- Go to "Deploys"
- Find previous deploy
- Click "Publish deploy"

**Cloudflare:**
- Go to "Deployments"
- Find previous deploy
- Click "Rollback to this deployment"

### Logs

**Vercel:** Deployments → [Deployment] → "Building" tab
**Netlify:** Deploys → [Deploy] → "Deploy log"
**Cloudflare:** Deployments → [Deployment] → "Build logs"

---

## Cost Estimates

### Vercel
- **Free tier**: 100 GB bandwidth/month, unlimited sites
- **Pro**: $20/month (1 TB bandwidth)
- Recommended for: Most projects

### Netlify
- **Free tier**: 100 GB bandwidth/month, 300 build minutes
- **Pro**: $19/month (400 GB bandwidth)
- Recommended for: Projects with heavy build requirements

### Cloudflare Pages
- **Free tier**: Unlimited requests, unlimited bandwidth
- **Pro**: $20/month (additional build minutes)
- Recommended for: High-traffic sites

All three have excellent free tiers suitable for this project.

---

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Cloudflare: [community.cloudflare.com](https://community.cloudflare.com)

For project-specific issues, check:
- `README.md` - General setup
- `SUPABASE-SETUP.md` - Database setup
- `SUPABASE-FIX.md` - RLS troubleshooting

---

**Last Updated:** 2025-11-25
