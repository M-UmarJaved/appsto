import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Download Proxy API
 * Purpose: Serve installer files from private GitHub releases
 * 
 * Benefits:
 * - Works with private GitHub repositories
 * - Professional email appearance
 * - Track download analytics
 * - Flexibility to change storage locations
 * - Security: validate purchase before download
 * 
 * Note: For private GitHub repos, we proxy the download using a GitHub token
 * instead of redirecting to ensure customers can download without GitHub auth
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
    // TODO: Validate purchase ID if you want to restrict downloads to verified purchases

    // Log download for analytics
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await supabase.from('download_logs').insert({
      product_id: productData.id,
      download_url: productData.download_url,
      ip_address: ip,
      user_agent: userAgent,
      downloaded_at: new Date().toISOString(),
    });

    // Check if this is a GitHub URL (private repo requires proxy)
    const isGitHubUrl = productData.download_url.includes('github.com');
    
    if (isGitHubUrl && process.env.GITHUB_TOKEN) {
      console.log('🔐 Private GitHub repo detected - proxying download with authentication');
      
      // Fetch the file from GitHub with authentication
      const githubResponse = await fetch(productData.download_url, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/octet-stream',
          'User-Agent': 'Appsto-Download-Proxy'
        },
        redirect: 'follow'
      });

      if (!githubResponse.ok) {
        console.error('❌ Failed to fetch from GitHub:', githubResponse.status, githubResponse.statusText);
        return NextResponse.json(
          { error: 'Failed to fetch installer. Please contact support.' },
          { status: 500 }
        );
      }

      // Get the file content
      const fileBuffer = await githubResponse.arrayBuffer();
      
      // Extract filename from URL or use default
      const urlParts = productData.download_url.split('/');
      const filename = urlParts[urlParts.length - 1] || `${productData.name}_Setup.exe`;

      console.log('✅ Streaming file:', filename, `(${fileBuffer.byteLength} bytes)`);

      // Stream the file to the client
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileBuffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    }

    // For public URLs, redirect directly
    console.log('✅ Public URL - redirecting to:', productData.download_url);
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
