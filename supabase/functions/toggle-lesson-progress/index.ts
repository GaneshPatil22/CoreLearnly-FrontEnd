// =============================================================================
// TOGGLE-LESSON-PROGRESS EDGE FUNCTION
// =============================================================================
// Handles marking lessons as completed/incomplete with:
// - Authentication check
// - Enrollment validation
// - Free tier restriction (beginner lessons only)
// - Audit logging
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ToggleRequest {
  lesson_id: string
  completed: boolean
}

interface ToggleResponse {
  success: boolean
  data?: {
    lesson_id: string
    completed: boolean
    completed_at: string | null
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
    const { lesson_id, completed }: ToggleRequest = await req.json()

    if (!lesson_id) {
      return jsonResponse({ success: false, error: 'lesson_id is required' }, 400)
    }

    if (typeof completed !== 'boolean') {
      return jsonResponse({ success: false, error: 'completed must be a boolean' }, 400)
    }

    // 5. Use service role for queries (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 6. Get lesson details with module info
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from('lessons')
      .select(`
        id,
        title,
        module_id,
        modules!inner (
          id,
          type
        )
      `)
      .eq('id', lesson_id)
      .single()

    if (lessonError || !lesson) {
      return jsonResponse({ success: false, error: 'Lesson not found' }, 404)
    }

    // 7. Check user has any active enrollment
    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .select('id, is_free, batch_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!enrollment) {
      return jsonResponse({
        success: false,
        error: 'You need an active enrollment to track progress'
      }, 403)
    }

    // 8. Check free tier restriction
    const moduleType = (lesson.modules as { type: string }).type
    if (enrollment.is_free && moduleType !== 'beginner') {
      return jsonResponse({
        success: false,
        error: `Free tier access is limited to Beginner module only. This is a ${moduleType} lesson.`
      }, 403)
    }

    // 9. Upsert progress record
    const now = new Date().toISOString()
    const progressData = {
      user_id: user.id,
      lesson_id: lesson_id,
      completed: completed,
      completed_at: completed ? now : null,
      updated_at: now
    }

    const { data: progress, error: progressError } = await supabaseAdmin
      .from('user_progress')
      .upsert(progressData, {
        onConflict: 'user_id,lesson_id'
      })
      .select('lesson_id, completed, completed_at')
      .single()

    if (progressError) {
      console.error('Progress update error:', progressError)
      return jsonResponse({ success: false, error: 'Failed to update progress' }, 500)
    }

    // 10. Log audit event
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: completed ? 'lesson_complete' : 'lesson_incomplete',
      resource_type: 'lesson',
      resource_id: lesson_id,
      metadata: {
        lesson_title: lesson.title,
        module_type: moduleType,
        is_free_user: enrollment.is_free
      },
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
      user_agent: req.headers.get('user-agent')
    })

    // 11. Return success
    return jsonResponse({
      success: true,
      data: {
        lesson_id: progress.lesson_id,
        completed: progress.completed,
        completed_at: progress.completed_at
      }
    }, 200)

  } catch (error) {
    console.error('Error in toggle-lesson-progress:', error)
    return jsonResponse({ success: false, error: 'Internal server error' }, 500)
  }
})

function jsonResponse(data: ToggleResponse, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
