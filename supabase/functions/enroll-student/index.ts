// =============================================================================
// ENROLL-STUDENT EDGE FUNCTION
// =============================================================================
// Handles student enrollment with:
// - Seat limit validation (max 40 total, max 15 free)
// - One active enrollment per user check
// - Audit logging
// =============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EnrollRequest {
  batch_id: string
  is_free?: boolean
}

interface EnrollResponse {
  success: boolean
  data?: {
    enrollment_id: string
    batch_name: string
    is_free: boolean
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
    const { batch_id, is_free = false }: EnrollRequest = await req.json()

    if (!batch_id) {
      return jsonResponse({ success: false, error: 'batch_id is required' }, 400)
    }

    // 5. Use service role for validation queries (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 6. Check for existing active enrollment
    const { data: existingEnrollment } = await supabaseAdmin
      .from('enrollments')
      .select('id, batch_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (existingEnrollment) {
      return jsonResponse({
        success: false,
        error: 'You already have an active enrollment. Please complete or cancel it first.'
      }, 400)
    }

    // 7. Get batch with current enrollment counts
    const { data: batch, error: batchError } = await supabaseAdmin
      .from('batches')
      .select('id, name, max_seats, max_free_seats, is_active')
      .eq('id', batch_id)
      .single()

    if (batchError || !batch) {
      return jsonResponse({ success: false, error: 'Batch not found' }, 404)
    }

    if (!batch.is_active) {
      return jsonResponse({ success: false, error: 'This batch is no longer accepting enrollments' }, 400)
    }

    // 8. Get current enrollment counts
    const { count: totalEnrolled } = await supabaseAdmin
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('batch_id', batch_id)
      .eq('status', 'active')

    const { count: freeEnrolled } = await supabaseAdmin
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('batch_id', batch_id)
      .eq('status', 'active')
      .eq('is_free', true)

    // 9. Check seat limits
    if ((totalEnrolled || 0) >= batch.max_seats) {
      return jsonResponse({
        success: false,
        error: `Batch is full. Maximum ${batch.max_seats} seats reached.`
      }, 400)
    }

    if (is_free && (freeEnrolled || 0) >= batch.max_free_seats) {
      return jsonResponse({
        success: false,
        error: `No free seats available. Maximum ${batch.max_free_seats} free seats reached.`
      }, 400)
    }

    // 10. Create enrollment
    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: user.id,
        batch_id: batch_id,
        is_free: is_free,
        status: 'active',
        enrolled_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (enrollError) {
      console.error('Enrollment error:', enrollError)
      return jsonResponse({ success: false, error: 'Failed to create enrollment' }, 500)
    }

    // 11. Log audit event
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action: 'enrollment_create',
      resource_type: 'enrollment',
      resource_id: enrollment.id,
      metadata: {
        batch_id,
        batch_name: batch.name,
        is_free,
        seats_after: (totalEnrolled || 0) + 1,
        free_seats_after: is_free ? (freeEnrolled || 0) + 1 : freeEnrolled
      },
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
      user_agent: req.headers.get('user-agent')
    })

    // 12. Return success
    return jsonResponse({
      success: true,
      data: {
        enrollment_id: enrollment.id,
        batch_name: batch.name,
        is_free: is_free
      }
    }, 201)

  } catch (error) {
    console.error('Error in enroll-student:', error)
    return jsonResponse({ success: false, error: 'Internal server error' }, 500)
  }
})

function jsonResponse(data: EnrollResponse, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
