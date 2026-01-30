import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Mark as dynamic route (requires query params at runtime)
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Secure Download API
 * 
 * Generates signed URLs for downloading purchased software
 * Verifies purchase before allowing download
 * 
 * GET /api/download?token=BASE64_TOKEN
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Download token required' }, { status: 400 });
    }

    // Decode token (format: productId:purchaseId or productId:purchaseId:timestamp)
    let productId: string, purchaseId: string;
    
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      [productId, purchaseId] = decoded.split(':');
    } catch (e) {
      return NextResponse.json({ error: 'Invalid download token' }, { status: 400 });
    }

    if (!productId || !purchaseId) {
      return NextResponse.json({ error: 'Invalid download token format' }, { status: 400 });
    }

    // Verify purchase exists and is completed
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('*, product:products(*)')
      .eq('id', purchaseId)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'Purchase not found or invalid' },
        { status: 404 }
      );
    }

    // Check if purchase was refunded
    if (purchase.status === 'refunded') {
      return NextResponse.json(
        { error: 'Purchase has been refunded' },
        { status: 403 }
      );
    }

    // Log the download
    await supabase.from('download_logs').insert({
      purchase_id: purchaseId,
      product_id: productId,
      user_id: purchase.user_id,
      download_url: req.url,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
    });

    // Get the download URL (GitHub Release or direct URL)
    const downloadUrl = purchase.product.download_url;
    
    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Download URL not configured for this product' },
        { status: 404 }
      );
    }

    // Return download page with auto-download + fallback button
    return new NextResponse(
      `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Download ${purchase.product.name}</title>
  <meta http-equiv="refresh" content="2;url=${purchase.product.download_url}">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 600px;
      margin: 100px auto;
      padding: 40px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      color: #1f2937;
    }
    h1 {
      color: #6366f1;
      margin-bottom: 20px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 40px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: scale(1.05);
    }
    .btn-secondary {
      background: #6b7280;
    }
    .info {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }
    .status {
      font-size: 18px;
      color: #10b981;
      font-weight: 600;
      margin: 20px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid #e5e7eb;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
  <script>
    // Auto-download after 2 seconds
    setTimeout(function() {
      window.location.href = '${purchase.product.download_url}';
    }, 2000);
  </script>
</head>
<body>
  <div class="container">
    <h1>📦 Download ${purchase.product.name}</h1>
    
    <div class="status">
      <div class="spinner"></div>
      <span>Your download will start automatically...</span>
    </div>
    
    <div class="info">
      <strong>Product:</strong> ${purchase.product.name}<br>
      <strong>Version:</strong> ${purchase.product.version || '1.0.0'}<br>
      <strong>File Size:</strong> ${purchase.product.file_size_mb || 'N/A'} MB<br>
      <strong>Purchase Date:</strong> ${new Date(purchase.purchased_at).toLocaleDateString()}
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
      If the download doesn't start automatically:
    </p>

    <a href="${purchase.product.download_url}" class="btn">
      🔽 Click Here to Download
    </a>

    <br><br>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn btn-secondary">
      📊 Go to Dashboard
    </a>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      Need help? Contact us at <a href="mailto:support@appsto.software" style="color: #6366f1;">support@appsto.software</a>
    </p>
  </div>
</body>
</html>
      `,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('❌ Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}
