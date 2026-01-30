import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateRequest, PaginationSchema } from '@/lib/validation';

// Mark as dynamic route (requires auth headers at runtime)
export const dynamic = 'force-dynamic';

/**
 * Get all purchases for the authenticated user
 * 
 * SECURITY: Requires valid auth token
 * PERFORMANCE: Paginated results (default: 20 per page, max: 100)
 * 
 * GET /api/user/purchases?page=1&limit=20
 */
export async function GET(req: NextRequest) {
  try {
    // Get auth token from request headers
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // PERFORMANCE: Parse and validate pagination parameters
    const searchParams = req.nextUrl.searchParams;
    const paginationValidation = validateRequest(PaginationSchema, {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    });
    
    if (!paginationValidation.success) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters', details: paginationValidation.error },
        { status: 400 }
      );
    }
    
    const { page, limit } = paginationValidation.data;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // PERFORMANCE: Fetch purchases with pagination
    const { data: purchases, error: purchasesError, count } = await supabase
      .from('purchases')
      .select(`
        *,
        product:products(
          id,
          name,
          slug,
          version
        ),
        pricing_plan:pricing_plans(
          plan_name,
          devices
        ),
        licenses(
          id,
          license_key,
          is_active,
          is_used,
          activation_count,
          max_activations,
          created_at,
          activated_at
        )
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false })
      .range(from, to);

    if (purchasesError) {
      console.error('Error fetching purchases:', purchasesError);
      return NextResponse.json(
        { error: 'Failed to fetch purchases' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      purchases: purchases || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: to < (count || 0) - 1,
      },
    });
  } catch (error) {
    console.error('Error in purchases API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
