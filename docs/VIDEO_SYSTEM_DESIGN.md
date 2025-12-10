# CoreLearnly Video System Design

> Reference document for implementing secure video recording and delivery system.
> Created: December 2024

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Signed URL Implementation](#signed-url-implementation)
6. [React Components](#react-components)
7. [Cost Breakdown](#cost-breakdown)
8. [Workflow](#workflow)
9. [Implementation Phases](#implementation-phases)

---

## Overview

### Requirements

- **Secure video recordings**: Only logged-in, enrolled users can view
- **Protected URLs**: Time-limited signed URLs that expire (can't be shared)
- **Zoom integration**: Meeting links protected, shown only to enrolled students
- **Batch-based access**: Students see content only for their enrolled batch
- **Budget**: ₹2,000-5,000/month
- **Content volume**: 20-40 hours of recordings per month
- **Batch size**: 30-100 students

### Security Approach: Signed URLs

```
Normal URL (insecure):
https://cdn.bunny.net/video123.mp4  ❌ Can be shared

Signed URL (secure):
https://cdn.bunny.net/video123.mp4?token=abc123&expires=1702234567 ✅

Features:
- Token generated using secret key (only server knows)
- Expires in 2-4 hours
- Even if shared, stops working quickly
- Can add IP restriction (same IP that requested)
```

---

## Tech Stack

| Tool | Role | Video System Capability |
|------|------|------------------------|
| React + Vite | Frontend | Dashboard UI, video player |
| Supabase | Backend/Auth/DB | Auth, PostgreSQL, Edge Functions for signed URLs |
| Netlify | Hosting | Frontend hosting |
| Bunny.net Stream | Video CDN | Storage, streaming, signed URL support |
| Zoom Pro | Live classes | Meetings, local recording |

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        NETLIFY                                  │
│                    (React App)                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Student Dashboard                                            │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  • Login (Supabase Auth)                                │  │
│   │  • View batch schedule                                  │  │
│   │  • Join live class (Zoom)                               │  │
│   │  • Watch recordings (Bunny.net player)                  │  │
│   └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
└──────────────────────────────│──────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                       SUPABASE                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Database (PostgreSQL)                                      │
│  ├── users (managed by Supabase Auth)                          │
│  ├── batches (batch_id, name, start_date, zoom_link)           │
│  ├── enrollments (user_id, batch_id, status)                   │
│  ├── recordings (id, batch_id, title, bunny_video_id, date)    │
│  └── schedules (batch_id, day, time, topic)                    │
│                                                                 │
│  🔐 Row Level Security (RLS)                                   │
│  └── Users can only see their enrolled batch's content         │
│                                                                 │
│  ⚡ Edge Functions                                              │
│  ├── get-signed-video-url (generates Bunny.net signed URL)     │
│  └── get-zoom-link (returns Zoom link if class is active)      │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                      BUNNY.NET STREAM                           │
│           (Video storage + CDN + Signed URL support)           │
│                                                                 │
│  • Storage: $0.005/GB/month                                    │
│  • Streaming: $0.01/GB bandwidth (Asia)                        │
│  • Signed URLs: Built-in, free                                 │
│  • Geo-restriction: Optional (India only)                      │
│  • Referer restriction: Your domain only                       │
└────────────────────────────────────────────────────────────────┘
```

### Student Dashboard UI Mockup

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT DASHBOARD                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📅 Upcoming Classes                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  DSA - Arrays & Strings                              │   │
│  │  Today, 7:00 PM                                      │   │
│  │                                                      │   │
│  │  [Join Class] ← Button appears 10 min before class  │   │
│  │                                                      │   │
│  │  ⚠️ Link active only for your account               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📹 Past Recordings (Batch: Jan 2025)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  DSA - Linked Lists | Dec 8, 2024 | 2h 15m          │   │
│  │  [Watch Recording]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### SQL (Copy-paste into Supabase SQL Editor)

```sql
-- ============================================
-- CORELEARNLY VIDEO SYSTEM DATABASE SCHEMA
-- ============================================

-- Batches (e.g., "Jan 2025 Batch", "Feb 2025 Batch")
create table batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date,
  zoom_meeting_id text,      -- Zoom meeting ID (not full link)
  zoom_passcode text,        -- Stored securely
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Student enrollments
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  batch_id uuid references batches(id) on delete cascade,
  enrolled_at timestamptz default now(),
  status text default 'active', -- active, completed, cancelled
  unique(user_id, batch_id)
);

-- Recordings
create table recordings (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references batches(id) on delete cascade,
  title text not null,
  description text,
  bunny_video_id text not null,  -- Bunny.net video GUID
  duration_minutes int,
  recorded_at date not null,
  is_published boolean default false,
  created_at timestamptz default now()
);

-- Class schedule
create table schedules (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references batches(id) on delete cascade,
  day_of_week int not null,  -- 0=Sunday, 1=Monday, etc.
  start_time time not null,
  end_time time not null,
  topic text,
  class_type text default 'dsa'  -- dsa, lld, hld, ai
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
alter table batches enable row level security;
alter table enrollments enable row level security;
alter table recordings enable row level security;
alter table schedules enable row level security;

-- Batches: Users can see batches they're enrolled in
create policy "Users see enrolled batches" on batches
  for select using (
    id in (
      select batch_id from enrollments
      where user_id = auth.uid() and status = 'active'
    )
  );

-- Enrollments: Users can only see their own enrollments
create policy "Users see own enrollments" on enrollments
  for select using (auth.uid() = user_id);

-- Recordings: Users can only see recordings for their enrolled batches
create policy "Users see enrolled batch recordings" on recordings
  for select using (
    batch_id in (
      select batch_id from enrollments
      where user_id = auth.uid() and status = 'active'
    )
  );

-- Schedules: Users can see schedules for their enrolled batches
create policy "Users see enrolled batch schedules" on schedules
  for select using (
    batch_id in (
      select batch_id from enrollments
      where user_id = auth.uid() and status = 'active'
    )
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

create index idx_enrollments_user_id on enrollments(user_id);
create index idx_enrollments_batch_id on enrollments(batch_id);
create index idx_recordings_batch_id on recordings(batch_id);
create index idx_schedules_batch_id on schedules(batch_id);
```

### Admin Policies (Add if you need admin access)

```sql
-- Create admin role check function
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from auth.users
    where id = auth.uid()
    and raw_user_meta_data->>'role' = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Admin can do everything on all tables
create policy "Admin full access batches" on batches
  for all using (is_admin());

create policy "Admin full access enrollments" on enrollments
  for all using (is_admin());

create policy "Admin full access recordings" on recordings
  for all using (is_admin());

create policy "Admin full access schedules" on schedules
  for all using (is_admin());
```

---

## Signed URL Implementation

### Supabase Edge Function

Create file: `supabase/functions/get-signed-video-url/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BUNNY_TOKEN_KEY = Deno.env.get('BUNNY_TOKEN_KEY')!
const BUNNY_CDN_URL = Deno.env.get('BUNNY_CDN_URL')! // e.g., https://vz-xxxxx.b-cdn.net

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get user from auth header
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { recording_id } = await req.json()

    // Check if user has access to this recording (RLS will handle this)
    const { data: recording, error } = await supabase
      .from('recordings')
      .select('bunny_video_id, title, duration_minutes')
      .eq('id', recording_id)
      .eq('is_published', true)
      .single()

    if (error || !recording) {
      return new Response(
        JSON.stringify({ error: 'Recording not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate signed URL (expires in 4 hours)
    const expiresAt = Math.floor(Date.now() / 1000) + (4 * 60 * 60)
    const videoPath = `/${recording.bunny_video_id}/play.mp4`

    // Bunny.net token generation (SHA256)
    const hashableBase = BUNNY_TOKEN_KEY + videoPath + expiresAt
    const token = await generateSHA256(hashableBase)

    const signedUrl = `${BUNNY_CDN_URL}${videoPath}?token=${token}&expires=${expiresAt}`

    return new Response(JSON.stringify({
      url: signedUrl,
      title: recording.title,
      duration: recording.duration_minutes,
      expires_in: '4 hours'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateSHA256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

### Environment Variables (Supabase Dashboard)

Set these in Supabase Dashboard > Edge Functions > Secrets:

```
BUNNY_TOKEN_KEY=your_bunny_security_token
BUNNY_CDN_URL=https://vz-xxxxxxxx.b-cdn.net
```

### Deploy Edge Function

```bash
# Install Supabase CLI if not already
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy get-signed-video-url
```

---

## React Components

### Recording Player Component

```tsx
// src/components/RecordingPlayer.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface RecordingPlayerProps {
  recordingId: string
  title: string
  duration?: number
  recordedAt: string
}

export function RecordingPlayer({
  recordingId,
  title,
  duration,
  recordedAt
}: RecordingPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleWatch = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('get-signed-video-url', {
        body: { recording_id: recordingId }
      })

      if (error) throw error
      setVideoUrl(data.url)
    } catch (err) {
      setError('Unable to load video. Please try again.')
      console.error('Video load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="recording-card">
      <div className="recording-info">
        <h3>{title}</h3>
        <p className="recording-meta">
          {recordedAt} {duration && `• ${formatDuration(duration)}`}
        </p>
      </div>

      {!videoUrl ? (
        <button
          onClick={handleWatch}
          disabled={loading}
          className="watch-button"
        >
          {loading ? 'Loading...' : 'Watch Recording'}
        </button>
      ) : (
        <div className="video-container">
          <video
            src={videoUrl}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="video-player"
          />
          <p className="video-notice">
            This link expires in 4 hours. Do not share.
          </p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  )
}
```

### Recordings List Component

```tsx
// src/components/RecordingsList.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { RecordingPlayer } from './RecordingPlayer'

interface Recording {
  id: string
  title: string
  duration_minutes: number
  recorded_at: string
}

export function RecordingsList() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecordings() {
      const { data, error } = await supabase
        .from('recordings')
        .select('id, title, duration_minutes, recorded_at')
        .eq('is_published', true)
        .order('recorded_at', { ascending: false })

      if (!error && data) {
        setRecordings(data)
      }
      setLoading(false)
    }

    fetchRecordings()
  }, [])

  if (loading) return <div>Loading recordings...</div>

  if (recordings.length === 0) {
    return <div>No recordings available yet.</div>
  }

  return (
    <div className="recordings-list">
      <h2>Class Recordings</h2>
      {recordings.map((recording) => (
        <RecordingPlayer
          key={recording.id}
          recordingId={recording.id}
          title={recording.title}
          duration={recording.duration_minutes}
          recordedAt={recording.recorded_at}
        />
      ))}
    </div>
  )
}
```

### Zoom Link Component (Protected)

```tsx
// src/components/JoinClassButton.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface JoinClassButtonProps {
  batchId: string
  classTime: Date
}

export function JoinClassButton({ batchId, classTime }: JoinClassButtonProps) {
  const [canJoin, setCanJoin] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Enable join button 10 minutes before class
    const checkTime = () => {
      const now = new Date()
      const timeDiff = classTime.getTime() - now.getTime()
      const minutesBefore = timeDiff / (1000 * 60)
      setCanJoin(minutesBefore <= 10 && minutesBefore >= -120) // 10 min before to 2 hours after
    }

    checkTime()
    const interval = setInterval(checkTime, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [classTime])

  const handleJoinClass = async () => {
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('get-zoom-link', {
        body: { batch_id: batchId }
      })

      if (error) throw error

      // Open Zoom link in new tab
      window.open(data.zoom_url, '_blank')
    } catch (err) {
      alert('Unable to get class link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!canJoin) {
    return (
      <button disabled className="join-button disabled">
        Join Class (Available 10 min before)
      </button>
    )
  }

  return (
    <button
      onClick={handleJoinClass}
      disabled={loading}
      className="join-button active"
    >
      {loading ? 'Getting link...' : 'Join Class Now'}
    </button>
  )
}
```

---

## Cost Breakdown

### Monthly Costs

| Service | Cost | Notes |
|---------|------|-------|
| **Supabase** | Free | Free tier: 500MB DB, 50K Edge Function invocations |
| **Netlify** | Free | Free tier sufficient for expected traffic |
| **Zoom Pro** | ₹1,100/month | Required for meetings, local recording |
| **Bunny.net Storage** | ~₹20/month | 40GB @ $0.005/GB |
| **Bunny.net Bandwidth** | ~₹3,000-4,000/month | ~4TB @ $0.01/GB (Asia) |
| **Total** | **₹4,100-5,100/month** | Within budget |

### Bandwidth Calculation

```
Students: 100
Hours watched per student per month: 40 hours
Video quality: 720p (~1GB/hour)

Total bandwidth = 100 × 40 × 1GB = 4,000 GB = 4TB
Cost = 4TB × $0.01/GB = $40 ≈ ₹3,400
```

### Scaling Considerations

- If bandwidth exceeds budget, consider:
  - Lower video quality (540p = ~500MB/hour)
  - Bunny.net volume discounts
  - Cloudflare Stream as alternative

---

## Workflow

### Recording Upload Workflow

```
1. Conduct Zoom class (record locally on your computer)
2. After class, upload to Bunny.net dashboard (drag & drop)
3. Copy the Video ID from Bunny.net
4. Add entry in Supabase:

   INSERT INTO recordings (batch_id, title, bunny_video_id, duration_minutes, recorded_at)
   VALUES ('batch-uuid', 'DSA - Arrays', 'bunny-video-guid', 120, '2024-12-10');

5. Set is_published = true when ready for students
```

### Student Experience Flow

```
1. Student logs in (Supabase Auth)
2. Dashboard shows their batch's schedule and recordings
3. For live class:
   - "Join Class" button appears 10 min before
   - Click → Edge Function verifies enrollment → Returns Zoom link
4. For recordings:
   - Click "Watch" → Edge Function generates signed URL
   - Video plays in browser (URL expires in 4 hours)
```

---

## Implementation Phases

### Phase 1: MVP (Week 1-2)

- [ ] Set up Bunny.net account
- [ ] Create Supabase database tables
- [ ] Implement Edge Function for signed URLs
- [ ] Build basic recordings list page
- [ ] Manual video upload workflow

### Phase 2: Dashboard (Week 3-4)

- [ ] Student dashboard UI
- [ ] Batch-based content filtering
- [ ] Class schedule display
- [ ] Protected Zoom link integration

### Phase 3: Admin Features (Week 5-6)

- [ ] Admin panel for adding recordings
- [ ] Batch management interface
- [ ] Student enrollment management
- [ ] Analytics (view counts, etc.)

### Phase 4: Enhancements (Future)

- [ ] Video progress tracking
- [ ] Playback resume functionality
- [ ] Mobile-optimized player
- [ ] Automated Zoom recording upload (via Zapier/webhook)

---

## Bunny.net Setup Guide

### 1. Create Account

1. Go to https://bunny.net
2. Sign up for account
3. Add payment method

### 2. Create Stream Library

1. Dashboard → Stream → Create Library
2. Name: "CoreLearnly Recordings"
3. Pricing Zone: Asia & Oceania (cheaper for India)

### 3. Enable Token Authentication

1. Stream Library → Security
2. Enable "Token Authentication"
3. Copy the "Token Authentication Key" (save this!)
4. Set "Allowed Referrers" to your domain: `corelearnly.com`

### 4. Upload Videos

1. Stream Library → Videos → Upload
2. Drag and drop your recording
3. Copy the Video GUID after upload completes

---

## Security Checklist

- [ ] Supabase RLS policies enabled on all tables
- [ ] Bunny.net token authentication enabled
- [ ] Bunny.net referrer restriction set to your domain
- [ ] Edge Function validates user enrollment before returning URLs
- [ ] Signed URLs expire within 4 hours
- [ ] Video player has `controlsList="nodownload"`
- [ ] Right-click disabled on video player
- [ ] Zoom links never exposed in frontend code
- [ ] Environment variables stored securely (not in code)

---

## Troubleshooting

### "Access Denied" on video

1. Check user is logged in
2. Verify user has active enrollment in the batch
3. Check recording's `is_published` is `true`
4. Verify RLS policies are correct

### Signed URL not working

1. Check `BUNNY_TOKEN_KEY` is correct
2. Verify `BUNNY_CDN_URL` format
3. Check URL hasn't expired
4. Test token generation in Bunny.net dashboard

### Edge Function errors

```bash
# View logs
supabase functions logs get-signed-video-url
```

---

## Alternative Solutions Considered

| Solution | Pros | Cons | Cost |
|----------|------|------|------|
| **Bunny.net** (Chosen) | Cheap, flexible, good Asia CDN | Requires custom implementation | ₹3-4k/month |
| **Vdocipher** | DRM, ready-made, Indian company | More expensive, less control | ₹8-12k/month |
| **Cloudflare Stream** | Great CDN, simple API | Slightly more expensive | ₹5-7k/month |
| **AWS S3 + CloudFront** | Very flexible | Complex setup, variable pricing | ₹4-8k/month |
| **Vimeo OTT** | Full platform | Very expensive | ₹15k+/month |

---

## Resources

- [Bunny.net Stream Documentation](https://docs.bunny.net/docs/stream-overview)
- [Bunny.net Token Authentication](https://docs.bunny.net/docs/stream-security)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Zoom API Documentation](https://developers.zoom.us/docs/api/)
