import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Download Redirect API
 * Purpose: Professional download endpoint with analytics
 * 
 * Benefits:
 * - Professional email appearance (hide storage URLs)
 * - Track download analytics (IP, user agent, timestamp)
 * - Flexibility to change storage locations without updating emails
 * - Future: Add purchase validation for restricted downloads
 * 
 * Storage: Works with any public URL (Cloudflare R2, S3, GitHub Releases, etc.)
 * The API logs the download and redirects to the actual file URL
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { product: string } }
) {
  const product = params.product.toLowerCase();
  
  console.log('📥 Download request for:', product);

  try {
    // Get product details from database
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id, name, download_url, is_active')
      .eq('slug', product)
      .single();

    if (productError || !productData) {
      console.error('❌ Product not found:', product);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!productData.is_active) {
      console.error('❌ Product is inactive:', product);
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 403 }
      );
    }

    if (!productData.download_url) {
      console.error('❌ Download URL not configured for:', product);
      return NextResponse.json(
        { error: 'Download not available' },
        { status: 404 }
      );
    }

    // Optional: Extract purchase token from query params for validation
    // const searchParams = request.nextUrl.searchParams;
    // const purchaseId = searchParams.get('purchase');
    // const token = searchParams.get('token');
    // 
    // TODO: Validate purchase before allowing download
    // const { data: purchase } = await supabase
    //   .from('purchases')
    //   .select('id, status')
    //   .eq('id', purchaseId)
    //   .eq('download_token', token)
    //   .single();
    // 
    // if (!purchase || purchase.status !== 'completed') {
    //   return NextResponse.json({ error: 'Invalid or expired download link' }, { status: 403 });
    // }

    // Log download for analytics
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Log download (non-blocking - don't wait for result)
    supabase.from('download_logs').insert({
      product_id: productData.id,
      download_url: productData.download_url,
      ip_address: ip,
      user_agent: userAgent,
      downloaded_at: new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.error('⚠️ Failed to log download:', error);
    });

    console.log('✅ Redirecting to:', productData.download_url);
    
    // Redirect to actual download URL (Cloudflare R2, S3, etc.)
    return NextResponse.redirect(productData.download_url, 302);

  } catch (error) {
    console.error('❌ Download redirect error:', error);
    return NextResponse.json(
      { error: 'Download failed. Please contact support.' },
      { status: 500 }
    );
  }
}

/**
 * USAGE IN EMAILS:
 * 
 * Old (shows GitHub URL on hover):
 * <a href="https://github.com/M-UmarJaved/DeskSweepSoftware/releases/download/DeskSwepp/DeskSweep_Setup.exe">
 *   Download DeskSweep
 * </a>
 * 
 * New (shows professional URL):
 * <a href="https://appsto.software/api/download/desksweep">
 *   Download DeskSweep
 * </a>
 * 
 * OR with purchase tracking:
 * <a href="https://appsto.software/api/download/desksweep?purchase=abc123">
 *   Download DeskSweep
 * </a>
 */
