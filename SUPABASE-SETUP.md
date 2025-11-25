# Supabase Setup Guide for CoreLearnly

This guide will help you set up Supabase for the CoreLearnly application form.

## Prerequisites

- Supabase account (sign up at https://supabase.com)
- Your project should be in the `ap-south-1` region (Mumbai, India)

## Step 1: Create Tables

Log in to your Supabase dashboard and run these SQL commands in the SQL Editor:

### Create `enquiries` Table

```sql
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  education TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX idx_enquiries_email ON enquiries(email);
```

### Create `enquiry_status` Table

```sql
CREATE TABLE IF NOT EXISTS enquiry_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'interested', 'not-interested', 'converted')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for foreign key
CREATE INDEX idx_enquiry_status_enquiry_id ON enquiry_status(enquiry_id);
```

## Step 2: Set Up Row Level Security (RLS)

### Enable RLS on Both Tables

```sql
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_status ENABLE ROW LEVEL SECURITY;
```

### Create RLS Policies

#### For `enquiries` table:

```sql
-- Allow public to INSERT only
CREATE POLICY "Allow public insert on enquiries"
  ON enquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Disable all other operations for public
CREATE POLICY "Deny public select on enquiries"
  ON enquiries
  FOR SELECT
  TO public
  USING (false);

CREATE POLICY "Deny public update on enquiries"
  ON enquiries
  FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "Deny public delete on enquiries"
  ON enquiries
  FOR DELETE
  TO public
  USING (false);
```

#### For `enquiry_status` table:

```sql
-- Allow public to INSERT only
CREATE POLICY "Allow public insert on enquiry_status"
  ON enquiry_status
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Deny all other operations for public
CREATE POLICY "Deny public select on enquiry_status"
  ON enquiry_status
  FOR SELECT
  TO public
  USING (false);

CREATE POLICY "Deny public update on enquiry_status"
  ON enquiry_status
  FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "Deny public delete on enquiry_status"
  ON enquiry_status
  FOR DELETE
  TO public
  USING (false);
```

## Step 3: Get Your Credentials

1. Go to your Supabase project settings
2. Navigate to **API** section
3. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual credentials

3. **Important:** Never commit `.env.local` to git (it's already in .gitignore)

## Step 5: Test the Connection

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:5174/apply

3. Fill out and submit the form

4. Check your Supabase dashboard:
   - Go to **Table Editor**
   - Select `enquiries` table
   - You should see your test entry
   - Check `enquiry_status` table for the corresponding status entry

## Viewing Submitted Applications

To view applications in Supabase dashboard:

1. Go to **Table Editor**
2. Select `enquiries` table
3. You'll see all submissions with:
   - Full name
   - Email
   - Phone
   - Education
   - Message
   - Source
   - Created timestamp

To check application status:

1. Select `enquiry_status` table
2. Match `enquiry_id` with the enquiry's `id`
3. See current status: new, contacted, interested, not-interested, or converted

## Optional: Set Up Email Notifications

If you want to receive email notifications when someone submits the form:

1. Go to **Database** → **Webhooks** in Supabase
2. Create a new webhook for the `enquiries` table
3. Set trigger to `INSERT`
4. Configure your email service endpoint

## Security Notes

✅ **What's protected:**
- Users can ONLY insert new applications
- Users CANNOT read, update, or delete any data
- All queries are validated by RLS policies

✅ **What admins can do:**
- View all applications in Supabase dashboard
- Update enquiry status
- Export data
- Run custom queries

⚠️ **Important:**
- Keep your anon key in `.env.local` only
- Never expose service_role key in frontend code
- RLS policies prevent unauthorized access

## Troubleshooting

### "Failed to submit application"

Check:
1. `.env.local` file exists and has correct credentials
2. Tables are created in Supabase
3. RLS policies are set up correctly
4. Your project region is `ap-south-1`

### "Cannot read properties"

- Restart dev server after adding `.env.local`
- Clear browser cache
- Check browser console for specific error

### "Policy violation"

- Verify RLS policies allow INSERT for public
- Check table permissions in Supabase

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Project GitHub Issues: (your repo link)
