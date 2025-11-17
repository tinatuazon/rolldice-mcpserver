import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/auth/callback`
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json(
      { error: 'access_denied', error_description: 'User denied access' },
      { status: 400 }
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { error: 'invalid_request', error_description: 'Missing code or state' },
      { status: 400 }
    );
  }

  try {
    // Decode state to get original redirect info
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { originalRedirectUri, originalState } = stateData;

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    
    if (!tokens.id_token) {
      return NextResponse.json(
        { error: 'invalid_grant', error_description: 'No ID token received' },
        { status: 400 }
      );
    }

    // Generate authorization code for the original client
    const authCode = Buffer.from(JSON.stringify({
      idToken: tokens.id_token,
      timestamp: Date.now()
    })).toString('base64');

    // Redirect back to original client with auth code
    const redirectUrl = new URL(originalRedirectUri);
    redirectUrl.searchParams.set('code', authCode);
    if (originalState) {
      redirectUrl.searchParams.set('state', originalState);
    }

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'Authentication failed' },
      { status: 500 }
    );
  }
}