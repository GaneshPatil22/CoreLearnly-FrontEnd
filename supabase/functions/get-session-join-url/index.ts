// =============================================================================
// GET-SESSION-JOIN-URL EDGE FUNCTION
// =============================================================================
// Securely returns Zoom link with:
// - Authentication check
// - Enrollment validation
// - Free tier restriction (beginner sessions only)
// - Attendance logging
// - Audit trail
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Token expiry in seconds (20 minutes)
const TOKEN_EXPIRY_SECONDS = 1200

interface JoinRequest {
  session_id: string
}

interface JoinResponse {
  success: boolean
  join_url: string | null
  session_title: string | null
  expires_in?: number
  error?: string
  message?: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({
        success: false,
        join_url: null,
        session_title: null,
        error: 'Missing authorization header'
      }, 401)
    }

    // 2. Create Supabase client with user's auth context
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    // 3. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return jsonResponse({
        success: false,
        join_url: null,
        session_title: null,
        error: 'Unauthorized - Please login'
      }, 401)
    }

    // 4. Parse request body
    const { session_id }: JoinRequest = await req.json()

    if (!session_id) {
      return jsonResponse({
        success: false,
        join_url: null,
        session_title: null,
        error: 'session_id is required'
      }, 400)
    }

    // 5. Use service role for queries
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 6. Get session details
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select('id, title, batch_id, session_type, zoom_link_encrypted, is_active')
      .eq('id', session_id)
      .single()

    if (sessionError || !session) {
      return jsonResponse({
        success: false,
        join_url: null,
        session_title: null,
        error: 'Session not found'
      }, 404)
    }

    if (!session.is_active) {
      return jsonResponse({
        success: false,
        join_url: null,
        session_title: session.title,
        error: 'This session is no longer active'
      }, 400)
    }

    // 7. Check user's enrollment in this batch
    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .select('id, is_free, status')
      .eq('user_id', user.id)
      .eq('batch_id', session.batch_id)
      .eq('status', 'active')
      .maybeSingle()

    if (!enrollment) {
      return jsonResponse({
        success: false,
        join_url: null,
        session_title: session.title,
        error: 'You are not enrolled in this batch'
      }, 403)
    }

    // 8. Check free tier restriction
    if (enrollment.is_free && session.session_type !== 'beginner') {
      return jsonResponse({
        success: false,
        join_url: null,
        session_title: session.title,
        error: `Free tier access is limited to Beginner module only. This is an ${session.session_type} session. Please upgrade to access.`
      }, 403)
    }

    // 9. Check if zoom link exists
    if (!session.zoom_link_encrypted) {
      return jsonResponse({
        success: true,
        join_url: null,
        session_title: session.title,
        message: 'Class link will be available shortly before the session starts'
      }, 200)
    }

    // 10. Decrypt zoom link
    const zoomLink = decryptZoomLink(session.zoom_link_encrypted)

    // 11. Generate join token for tracking
    const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS
    const joinToken = await generateJoinToken(user.id, session_id, expiresAt)

    // 12. Record attendance (upsert)
    await supabaseAdmin
      .from('attendance')
      .upsert({
        enrollment_id: enrollment.id,
        session_id: session_id,
        joined_at: new Date().toISOString(),
        device_info: parseDeviceInfo(req.headers.get('user-agent')),
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
        join_token: joinToken
      }, {
        onConflict: 'enrollment_id,session_id'
      })

    // 13. Log audit event
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'session_join',
      resource_type: 'session',
      resource_id: session_id,
      metadata: {
        session_title: session.title,
        session_type: session.session_type,
        is_free_user: enrollment.is_free,
        join_token: joinToken
      },
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
      user_agent: req.headers.get('user-agent')
    })

    // 14. Return success with zoom link
    return jsonResponse({
      success: true,
      join_url: zoomLink,
      session_title: session.title,
      expires_in: TOKEN_EXPIRY_SECONDS
    }, 200)

  } catch (error) {
    console.error('Error in get-session-join-url:', error)
    return jsonResponse({
      success: false,
      join_url: null,
      session_title: null,
      error: 'Internal server error'
    }, 500)
  }
})

/**
 * Decrypt zoom link
 * Currently using base64 encoding - replace with proper AES-256 in production
 */
function decryptZoomLink(encrypted: string): string {
  try {
    return atob(encrypted)
  } catch {
    return encrypted // Return as-is if not encoded
  }
}

/**
 * Generate a signed join token for tracking
 */
async function generateJoinToken(userId: string, sessionId: string, expiresAt: number): Promise<string> {
  const payload = `${userId}:${sessionId}:${expiresAt}`
  const encoder = new TextEncoder()
  const data = encoder.encode(payload)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)
}

/**
 * Parse user agent into device info
 */
function parseDeviceInfo(userAgent: string | null): object {
  if (!userAgent) return {}

  return {
    raw: userAgent.substring(0, 200), // Truncate for storage
    is_mobile: /mobile|android|iphone|ipad/i.test(userAgent),
    browser: extractBrowser(userAgent),
    os: extractOS(userAgent)
  }
}

function extractBrowser(ua: string): string {
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  return 'Other'
}

function extractOS(ua: string): string {
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  return 'Other'
}

function jsonResponse(data: JoinResponse, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
