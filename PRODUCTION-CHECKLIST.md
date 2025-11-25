# Production Checklist

Use this checklist before deploying CoreLearnly to production.

## Pre-Deployment

### Code Quality
- [ ] Run `npm run lint` and fix all errors
- [ ] Run `npm run build` successfully
- [ ] No console errors in development mode
- [ ] All TypeScript errors resolved
- [ ] Remove all `console.log()` statements (or use proper logging)
- [ ] No TODO comments left in code

### Assets
- [ ] Add `public/syllabus.pdf` - Course syllabus for download
- [ ] Add `public/mentor.jpg` - Mentor profile photo (optimized, < 500KB)
- [ ] Add `public/og-image.png` - Social sharing image (1200x630px, < 300KB)
- [ ] Verify all images are optimized (compressed)
- [ ] Test syllabus PDF download link works

### Content Updates
- [ ] Update mentor name in `src/components/sections/MentorSection.tsx`
- [ ] Update mentor bio in `src/components/sections/MentorSection.tsx`
- [ ] Update mentor LinkedIn/Twitter URLs in `src/components/sections/MentorSection.tsx`
- [ ] Verify pricing is correct in `src/components/sections/PricingSection.tsx`
- [ ] Verify all curriculum modules are accurate
- [ ] Verify all project descriptions are accurate
- [ ] Update contact email in Footer if needed
- [ ] Update social media links in Footer

### SEO & Meta
- [ ] Update `<title>` in `index.html` if needed
- [ ] Update meta description in `index.html`
- [ ] Update Open Graph title/description in `index.html`
- [ ] Update `og:url` to your production domain
- [ ] Update `og:image` URL to your production domain
- [ ] Update Twitter card meta tags
- [ ] Update `public/sitemap.xml` URLs to production domain
- [ ] Update `public/robots.txt` sitemap URL to production domain
- [ ] Verify canonical URL is correct

### Configuration
- [ ] Create Supabase project (see `SUPABASE-SETUP.md`)
- [ ] Set up Supabase tables: `enquiries` and `enquiry_status`
- [ ] Configure Supabase RLS policies (see `SUPABASE-FIX.md`)
- [ ] Test Supabase connection with production credentials
- [ ] Create `.env.production` with production Supabase credentials
- [ ] Verify environment variables don't have trailing spaces
- [ ] Double-check all URLs are production URLs (not localhost)

### Security
- [ ] Supabase RLS policies enabled for production
- [ ] Test RLS policies work correctly
- [ ] Verify `VITE_SUPABASE_ANON_KEY` is the anon key (not service key)
- [ ] No sensitive data in Git history
- [ ] `.env` files in `.gitignore`
- [ ] No API keys or secrets in code

## Deployment

### Build Test
- [ ] Run `npm run build` locally
- [ ] Check `dist/` folder contents
- [ ] Verify bundle size is acceptable (< 500KB gzipped)
- [ ] Run `npm run preview` and test locally
- [ ] Test all pages in preview mode
- [ ] Test form submission in preview mode

### Platform Setup (Choose One)

#### Vercel
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure build settings (auto-detected)
- [ ] Add environment variables
- [ ] Deploy to production
- [ ] Verify deployment succeeded

#### Netlify
- [ ] Create Netlify account
- [ ] Import GitHub repository
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Add `public/_redirects` file
- [ ] Deploy to production
- [ ] Verify deployment succeeded

#### Cloudflare Pages
- [ ] Create Cloudflare account
- [ ] Create Pages project
- [ ] Connect to GitHub
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy to production
- [ ] Verify deployment succeeded

### Domain Setup (If using custom domain)
- [ ] Purchase domain or have domain ready
- [ ] Add custom domain in hosting platform
- [ ] Configure DNS records
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify SSL certificate issued
- [ ] Test HTTPS access

## Post-Deployment Testing

### Functional Testing
- [ ] Visit production URL
- [ ] Test homepage loads correctly
- [ ] Test all 7 homepage sections display
- [ ] Click "Apply Now" and verify form page loads
- [ ] Fill and submit application form with test data
- [ ] Verify success message appears
- [ ] Check Supabase dashboard for test enquiry
- [ ] Test Privacy Policy page
- [ ] Test 404 page by visiting non-existent URL
- [ ] Test syllabus PDF download

### Navigation Testing
- [ ] Click all navbar links
- [ ] Test navbar on mobile (hamburger menu)
- [ ] Test smooth scroll to sections
- [ ] Test "Back to Top" button appears and works
- [ ] Verify scroll progress indicator works
- [ ] Test all footer links
- [ ] Verify logo rotates on scroll

### Form Validation Testing
- [ ] Submit empty form - verify all errors show
- [ ] Enter invalid email - verify error shows
- [ ] Enter invalid phone - verify error shows
- [ ] Enter name < 2 chars - verify error shows
- [ ] Enter message > 1000 chars - verify error shows
- [ ] Submit valid form - verify success
- [ ] Verify loading state shows during submission

### Responsive Testing
- [ ] Test on desktop (1920px, 1440px, 1280px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Test on mobile (375px, 414px)
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Verify no horizontal scroll on any device

### Performance Testing
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90
- [ ] Fix any major issues found

### SEO Testing
- [ ] Test with [Meta Tags Checker](https://metatags.io/)
- [ ] Verify title displays correctly
- [ ] Verify description displays correctly
- [ ] Verify og:image displays correctly
- [ ] Test social sharing on Facebook
- [ ] Test social sharing on Twitter/X
- [ ] Test social sharing on LinkedIn
- [ ] Verify robots.txt accessible: `your-domain.com/robots.txt`
- [ ] Verify sitemap.xml accessible: `your-domain.com/sitemap.xml`

### Accessibility Testing
- [ ] Test keyboard navigation (Tab through all elements)
- [ ] Test with screen reader (NVDA or JAWS)
- [ ] Verify all images have alt text
- [ ] Verify sufficient color contrast
- [ ] Verify form labels are properly associated
- [ ] Test focus indicators are visible

## Post-Launch

### Monitoring Setup
- [ ] Add Google Analytics (optional)
- [ ] Add error tracking (Sentry, optional)
- [ ] Set up uptime monitoring (UptimeRobot, optional)
- [ ] Configure Slack/email notifications for downtime

### Search Engine Submission
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Verify ownership of domain
- [ ] Request indexing of homepage

### Social Media
- [ ] Post launch announcement
- [ ] Share production URL
- [ ] Test all social sharing buttons work
- [ ] Verify og:image shows correctly when shared

### Documentation
- [ ] Update README.md with production URL
- [ ] Document any production-specific issues encountered
- [ ] Update team on deployment completion
- [ ] Share access credentials with team (if needed)

### Backup & Security
- [ ] Backup Supabase database
- [ ] Set up automatic database backups
- [ ] Document recovery process
- [ ] Test rollback process

## Ongoing Maintenance

### Weekly
- [ ] Check Supabase for new enquiries
- [ ] Monitor application errors
- [ ] Check uptime status
- [ ] Review analytics (if configured)

### Monthly
- [ ] Update npm dependencies: `npm outdated`
- [ ] Test after updates
- [ ] Review performance metrics
- [ ] Backup database

### Quarterly
- [ ] Review and update content
- [ ] Update curriculum if needed
- [ ] Update pricing if needed
- [ ] Review SEO performance

## Rollback Plan

If issues occur after deployment:

1. **Vercel**: Go to Deployments → Find last working → Promote to Production
2. **Netlify**: Go to Deploys → Find last working → Publish deploy
3. **Cloudflare**: Go to Deployments → Find last working → Rollback

## Emergency Contacts

- Hosting support: [Your hosting platform support]
- Supabase support: support@supabase.io
- Domain registrar: [Your domain provider]

## Known Issues

Document any known issues here:

### Supabase RLS
- RLS policies may need adjustment for production
- See `SUPABASE-FIX.md` for troubleshooting
- Temporarily disabling RLS is NOT recommended for production

### Browser Compatibility
- IE11 not supported (uses modern JavaScript)
- Safari 13+ required for some animations

## Success Criteria

Your deployment is successful when:

- [ ] All checklist items completed
- [ ] Zero console errors on production
- [ ] Form submissions save to Supabase
- [ ] PageSpeed score > 90 on all metrics
- [ ] Site loads in < 3 seconds on 3G
- [ ] All responsive breakpoints tested
- [ ] SEO meta tags verified
- [ ] Custom domain working (if applicable)
- [ ] SSL certificate active
- [ ] No broken links

---

**Date Completed:** _______________

**Deployed By:** _______________

**Production URL:** _______________

**Notes:**
_______________________________________
_______________________________________
_______________________________________

---

**Last Updated:** 2025-11-25
