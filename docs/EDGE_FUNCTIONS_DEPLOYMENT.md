# Edge Functions Deployment Guide

## Overview

CoreLearnly uses 4 Supabase Edge Functions to handle secure operations that require server-side validation:

| Function | Purpose |
|----------|---------|
| `enroll-student` | Handle enrollment with seat limit validation |
| `get-session-join-url` | Securely return Zoom links with access checks |
| `toggle-lesson-progress` | Mark lessons as completed/incomplete |
| `submit-feedback` | Submit session ratings and comments |

---

## Prerequisites

### 1. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# npm (alternative)
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

This opens a browser to authenticate with your Supabase account.

### 3. Link Your Project

```bash
cd /path/to/CoreLearnly-Frontend
supabase link --project-ref YOUR_PROJECT_REF
```

Find your project ref in Supabase Dashboard → Settings → General → Reference ID.

---

## Deployment

### Deploy All Functions

```bash
supabase functions deploy
```

### Deploy Individual Function

```bash
supabase functions deploy enroll-student
supabase functions deploy get-session-join-url
supabase functions deploy toggle-lesson-progress
supabase functions deploy submit-feedback
```

---

## Environment Variables

Edge Functions automatically have access to:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key (keep secret!)

No manual configuration needed for these.

---

## Testing Functions

### Using cURL

```bash
# Enroll Student
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/enroll-student' \
  -H 'Authorization: Bearer USER_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"batch_id": "uuid-here", "is_free": true}'

# Get Session Join URL
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/get-session-join-url' \
  -H 'Authorization: Bearer USER_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "uuid-here"}'

# Toggle Lesson Progress
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/toggle-lesson-progress' \
  -H 'Authorization: Bearer USER_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"lesson_id": "uuid-here", "completed": true}'

# Submit Feedback
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/submit-feedback' \
  -H 'Authorization: Bearer USER_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"session_id": "uuid-here", "rating": 5, "comment": "Great class!"}'
```

### Using Supabase JS Client

```typescript
import { supabase } from './supabaseClient'

// Enroll in a batch
const { data, error } = await supabase.functions.invoke('enroll-student', {
  body: { batch_id: 'uuid', is_free: true }
})

// Get session join URL
const { data, error } = await supabase.functions.invoke('get-session-join-url', {
  body: { session_id: 'uuid' }
})

// Toggle lesson progress
const { data, error } = await supabase.functions.invoke('toggle-lesson-progress', {
  body: { lesson_id: 'uuid', completed: true }
})

// Submit feedback
const { data, error } = await supabase.functions.invoke('submit-feedback', {
  body: { session_id: 'uuid', rating: 5, comment: 'Excellent!' }
})
```

---

## Function Details

### 1. enroll-student

**Endpoint**: `POST /functions/v1/enroll-student`

**Request Body**:
```json
{
  "batch_id": "uuid",
  "is_free": true
}
```

**Validations**:
- User must be authenticated
- User cannot have existing active enrollment
- Total seats ≤ 40
- Free seats ≤ 15 (if `is_free: true`)
- Batch must be active

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "enrollment_id": "uuid",
    "batch_name": "Batch Alpha",
    "is_free": true
  }
}
```

---

### 2. get-session-join-url

**Endpoint**: `POST /functions/v1/get-session-join-url`

**Request Body**:
```json
{
  "session_id": "uuid"
}
```

**Validations**:
- User must be authenticated
- User must be enrolled in session's batch
- Free users can only access beginner sessions
- Session must be active

**Success Response** (200):
```json
{
  "success": true,
  "join_url": "https://zoom.us/j/...",
  "session_title": "Arrays & Strings",
  "expires_in": 1200
}
```

**Free User Restriction Response** (403):
```json
{
  "success": false,
  "join_url": null,
  "session_title": "System Design Basics",
  "error": "Free tier access is limited to Beginner module only. This is an intermediate session. Please upgrade to access."
}
```

---

### 3. toggle-lesson-progress

**Endpoint**: `POST /functions/v1/toggle-lesson-progress`

**Request Body**:
```json
{
  "lesson_id": "uuid",
  "completed": true
}
```

**Validations**:
- User must be authenticated
- User must have active enrollment
- Free users can only complete beginner lessons

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "lesson_id": "uuid",
    "completed": true,
    "completed_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### 4. submit-feedback

**Endpoint**: `POST /functions/v1/submit-feedback`

**Request Body**:
```json
{
  "session_id": "uuid",
  "rating": 5,
  "comment": "Great explanation of recursion!"
}
```

**Validations**:
- User must be authenticated
- User must be enrolled in session's batch
- Rating must be 1-5 integer
- One feedback per user per session
- Comment max 1000 characters

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "feedback_id": "uuid",
    "session_title": "Arrays & Strings",
    "rating": 5
  }
}
```

---

## Error Responses

All functions return consistent error format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (missing/invalid auth) |
| 403 | Forbidden (access denied) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Monitoring

### View Logs

```bash
# Stream logs for all functions
supabase functions logs

# Stream logs for specific function
supabase functions logs enroll-student
```

### Dashboard

View logs in Supabase Dashboard → Edge Functions → Select function → Logs

---

## Local Development

### Start Local Functions Server

```bash
supabase start
supabase functions serve
```

### Test Against Local

```bash
curl -X POST 'http://localhost:54321/functions/v1/enroll-student' \
  -H 'Authorization: Bearer YOUR_LOCAL_JWT' \
  -H 'Content-Type: application/json' \
  -d '{"batch_id": "uuid", "is_free": true}'
```

---

## Security Notes

1. **CORS**: Functions allow all origins (`*`). Consider restricting to your domain in production.

2. **Service Role Key**: Used server-side only, never exposed to client.

3. **Input Validation**: All inputs are validated before processing.

4. **Audit Logging**: All actions are logged to `audit_logs` table.

5. **Rate Limiting**: Consider adding rate limiting for production.

---

## Troubleshooting

### Function Not Found
- Ensure function is deployed: `supabase functions list`
- Check function name matches exactly

### 401 Unauthorized
- Verify JWT token is valid
- Check token hasn't expired
- Ensure `Authorization: Bearer` header format

### 500 Internal Error
- Check logs: `supabase functions logs function-name`
- Verify database tables exist
- Check environment variables are set
