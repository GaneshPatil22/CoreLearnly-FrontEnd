# CoreLearnly Frontend - Phase 1 Setup Complete! ✅

## What's Been Built

Phase 1 foundation is complete with:
- ✅ Complete folder structure
- ✅ Tailwind CSS with dark theme and purple accent
- ✅ React Router with all routes configured
- ✅ Navbar with smooth scroll and mobile menu
- ✅ Footer with social links
- ✅ Main layout wrapper
- ✅ Supabase configuration ready
- ✅ TypeScript types defined
- ✅ Placeholder pages for all routes

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project created

## Installation & Setup

### 1. Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note:** Supabase integration will be fully used in Phase 4. For now, the app will work without it for navigation testing.

### 3. Add Required Assets

Place these files in the `public/` directory:

- `syllabus.pdf` - Your course syllabus (for Download button)
- `mentor.jpg` or `mentor.png` - Mentor profile image (for Phase 2)

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Phase 1 Features

### Navigation
- **Navbar**: Sticky navigation with logo, links, and Apply Now button
- **Mobile Menu**: Hamburger menu for mobile devices
- **Smooth Scroll**: Anchor links scroll smoothly to sections on homepage
- **Footer**: Social links, quick links, and contact information

### Routes Working
- `/` - Homepage (with placeholder sections)
- `/apply` - Application form page (placeholder for Phase 4)
- `/privacy-policy` - Privacy policy page
- `/curriculum`, `/projects`, `/mentors` - Redirect to homepage sections

### Theme System
- **Dark Mode Only**: Pure dark theme with no light mode
- **Purple Accent**: #8B5CF6 (can be changed in one location)
- **Global Color Variables**: Defined in `src/index.css` and `tailwind.config.js`

To change the primary color, update these locations:
1. `src/index.css` - CSS variables (lines 10-11)
2. `tailwind.config.js` - Tailwind theme colors

## Project Structure

```
src/
├── components/
│   ├── common/          # Navbar, Footer
│   └── sections/        # (Ready for Phase 2)
├── pages/               # HomePage, ApplyPage, PrivacyPolicyPage
├── layout/              # MainLayout wrapper
├── router/              # React Router configuration
├── context/
│   └── theme/           # Theme context (dark mode only)
├── services/
│   └── supabase/        # Supabase client setup
├── queries/             # Supabase query functions
├── hooks/               # (Ready for custom hooks)
├── utils/               # (Ready for utilities)
└── types/               # TypeScript interfaces

public/
├── README.txt           # Instructions for assets
├── syllabus.pdf         # (You need to add this)
└── mentor.jpg           # (You need to add this)
```

## Testing Phase 1

### What to Check:
1. **Navigation**
   - Click logo - goes to homepage
   - Click nav links - smooth scroll to sections
   - Click "Apply Now" - goes to /apply page
   - Click "Download Syllabus" - downloads PDF (once you add it)

2. **Mobile Responsiveness**
   - Resize browser window
   - Hamburger menu appears on mobile
   - Menu items work correctly

3. **Footer**
   - All links work
   - Social icons present
   - Email link works

4. **Routing**
   - Try all routes manually in URL bar
   - Privacy policy page loads
   - Back button works

## Known Issues / Notes

- Supabase queries are configured but not connected to UI yet (Phase 4)
- Homepage sections are placeholders (Phase 2 will add content)
- No form validation or submission yet (Phase 4)
- Syllabus PDF download requires you to add the file
- Animations with Framer Motion will be added in Phase 3

## Next Steps

After testing Phase 1, we'll move to:

**Phase 2**: Add all homepage content
- Hero section with call-to-actions
- AI Weekend section
- Pricing section
- Curriculum with expandable modules
- Projects cards
- Mentor profile section

## Need Help?

If you encounter any issues:
1. Make sure all dependencies are installed: `npm install`
2. Check that you're using Node.js 18+
3. Clear browser cache and restart dev server
4. Check browser console for errors

## Deployment (Later)

Phase 1 is ready to deploy to:
- Vercel
- Netlify
- AWS Amplify
- Any static hosting service

We'll add deployment instructions in Phase 5.
