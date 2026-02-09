import { NextRequest, NextResponse } from 'next/server';

/**
 * GitHub Installation Handler
 * Saves installation data when user installs the GitHub App
 * 
 * POST /api/github-install
 * Body: { installation_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { installation_id } = body;

    if (!installation_id) {
      return NextResponse.json(
        { error: 'Installation ID is required' },
        { status: 400 }
      );
    }

    // In a production environment, this would save to Vercel KV
    // For now, we'll log it and return success
    const installationData = {
      installation_id,
      installed_at: new Date().toISOString(),
      plan: 'free',
      commits_this_month: 0,
      razorpay_customer_id: null,
    };

    console.log('Saving installation:', installationData);

    // TODO: Implement actual KV storage
    // await kv.set(`installation:${installation_id}`, JSON.stringify(installationData));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Installation saved',
        installation: installationData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving installation:', error);
    return NextResponse.json(
      { error: 'Failed to save installation' },
      { status: 500 }
    );
  }
}

/**
 * GET handler to check installation status
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const installationId = searchParams.get('installation_id');

  if (!installationId) {
    return NextResponse.json(
      { error: 'Installation ID is required' },
      { status: 400 }
    );
  }

  // TODO: Retrieve from KV
  // const installation = await kv.get(`installation:${installationId}`);

  return NextResponse.json(
    { 
      installation_id: installationId,
      exists: false, // Would check KV in production
      message: 'Installation check endpoint'
    },
    { status: 200 }
  );
}
