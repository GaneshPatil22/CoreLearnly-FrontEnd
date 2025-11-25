# Fix Supabase RLS Policy Error

You're getting this error: `new row violates row-level security policy for table "enquiries"`

This means the RLS policy is blocking the insert. Here's the fix:

## Quick Fix - Run This SQL

Go to your Supabase SQL Editor and run:

```sql
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public insert on enquiries" ON enquiries;
DROP POLICY IF EXISTS "Deny public select on enquiries" ON enquiries;
DROP POLICY IF EXISTS "Deny public update on enquiries" ON enquiries;
DROP POLICY IF EXISTS "Deny public delete on enquiries" ON enquiries;

DROP POLICY IF EXISTS "Allow public insert on enquiry_status" ON enquiry_status;
DROP POLICY IF EXISTS "Deny public select on enquiry_status" ON enquiry_status;
DROP POLICY IF EXISTS "Deny public update on enquiry_status" ON enquiry_status;
DROP POLICY IF EXISTS "Deny public delete on enquiry_status" ON enquiry_status;

-- Enable RLS
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_status ENABLE ROW LEVEL SECURITY;

-- Create simple INSERT-only policy for enquiries
CREATE POLICY "Enable insert for anon users"
ON enquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- Create simple INSERT-only policy for enquiry_status
CREATE POLICY "Enable insert for anon users"
ON enquiry_status
FOR INSERT
TO anon
WITH CHECK (true);

-- Optional: Allow authenticated users full access (for admin dashboard)
CREATE POLICY "Enable all for authenticated users"
ON enquiries
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users"
ON enquiry_status
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

## What This Does

1. **Drops old policies** - Removes any conflicting policies
2. **Enables RLS** - Keeps tables secure
3. **Allows INSERT for anon** - Lets public submit forms
4. **Allows full access for authenticated** - Lets you view in dashboard

## Test After Running

1. Save the SQL in Supabase
2. Go back to http://localhost:5174/apply
3. Fill out and submit the form
4. Should show success message!
5. Check Supabase Table Editor to see the entry

## If Still Not Working

Try this even simpler policy:

```sql
-- Temporarily disable RLS for testing
ALTER TABLE enquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_status DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning:** Only do this for testing! Re-enable RLS before production.

## Verify Your Setup

After running the SQL, check:

1. Go to **Table Editor** → **enquiries**
2. Click the shield icon (RLS)
3. You should see: "Enable insert for anon users"
4. Do the same for **enquiry_status**

---

**Run the SQL now and try the form again!**
