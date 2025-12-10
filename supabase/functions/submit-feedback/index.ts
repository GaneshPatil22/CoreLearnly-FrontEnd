// =============================================================================
// SUBMIT-FEEDBACK EDGE FUNCTION
// =============================================================================
// Handles session feedback submission with:
// - Authentication check
// - Enrollment validation
// - One feedback per user per session
// - Rating validation (1-5)
// - Audit logging
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FeedbackRequest {
  session_id: string
  rating: number
  comment?: string
}

interface FeedbackResponse {
  success: boolean
  data?: {
    feedback_id: string
    session_title: string
    rating: number
  }
  error?: string
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
      return jsonResponse({ success: false, error: 'Missing authorization header' }, 401)
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
      return jsonResponse({ success: false, error: 'Unauthorized - Please login' }, 401)
    }

    // 4. Parse request body
    const { session_id, rating, comment }: FeedbackRequest = await req.json()

    if (!session_id) {
      return jsonResponse({ success: false, error: 'session_id is required' }, 400)
    }

    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return jsonResponse({ success: false, error: 'rating must be an integer between 1 and 5' }, 400)
    }

    // 5. Use service role for queries (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 6. Get session details
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select('id, title, batch_id')
      .eq('id', session_id)
      .single()

    if (sessionError || !session) {
      return jsonResponse({ success: false, error: 'Session not found' }, 404)
    }

    // 7. Check user's enrollment in this batch
    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .select('id, is_free')
      .eq('user_id', user.id)
      .eq('batch_id', session.batch_id)
      .eq('status', 'active')
      .maybeSingle()

    if (!enrollment) {
      return jsonResponse({
        success: false,
        error: 'You must be enrolled in this batch to submit feedback'
      }, 403)
    }

    // 8. Check for existing feedback
    const { data: existingFeedback } = await supabaseAdmin
      .from('session_feedback')
      .select('id')
      .eq('user_id', user.id)
      .eq('session_id', session_id)
      .maybeSingle()

    if (existingFeedback) {
      return jsonResponse({
        success: false,
        error: 'You have already submitted feedback for this session'
      }, 400)
    }

    // 9. Sanitize comment (basic XSS prevention)
    const sanitizedComment = comment
      ? comment.substring(0, 1000).replace(/<[^>]*>/g, '')
      : null

    // 10. Insert feedback
    const { data: feedback, error: feedbackError } = await supabaseAdmin
      .from('session_feedback')
      .insert({
        user_id: user.id,
        session_id: session_id,
        rating: rating,
        comment: sanitizedComment,
        submitted_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (feedbackError) {
      console.error('Feedback insert error:', feedbackError)
      return jsonResponse({ success: false, error: 'Failed to submit feedback' }, 500)
    }

    // 11. Log audit event
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'feedback_submit',
      resource_type: 'session_feedback',
      resource_id: feedback.id,
      metadata: {
        session_id,
        session_title: session.title,
        rating,
        has_comment: !!sanitizedComment,
        is_free_user: enrollment.is_free
      },
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
      user_agent: req.headers.get('user-agent')
    })

    // 12. Return success
    return jsonResponse({
      success: true,
      data: {
        feedback_id: feedback.id,
        session_title: session.title,
        rating: rating
      }
    }, 201)

  } catch (error) {
    console.error('Error in submit-feedback:', error)
    return jsonResponse({ success: false, error: 'Internal server error' }, 500)
  }
})

function jsonResponse(data: FeedbackResponse, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
