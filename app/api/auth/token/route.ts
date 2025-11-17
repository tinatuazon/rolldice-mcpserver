import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const grantType = body.get('grant_type');
    const code = body.get('code');

    if (grantType !== 'authorization_code') {
      return NextResponse.json(
        { error: 'unsupported_grant_type' },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Missing authorization code' },
        { status: 400 }
      );
    }

    try {
      // Decode the authorization code to get the ID token
      const authData = JSON.parse(Buffer.from(code as string, 'base64').toString());
      const { idToken, timestamp } = authData;

      // Check if token is not too old (5 minutes)
      const maxAge = 5 * 60 * 1000; // 5 minutes
      if (Date.now() - timestamp > maxAge) {
        return NextResponse.json(
          { error: 'invalid_grant', error_description: 'Authorization code expired' },
          { status: 400 }
        );
      }

      // Return the ID token as access token
      return NextResponse.json({
        access_token: idToken,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'openid profile email'
      });
    } catch {
      return NextResponse.json(
        { error: 'invalid_grant', error_description: 'Invalid authorization code' },
        { status: 400 }
      );
    }
  } catch (requestError) {
    console.error('Token exchange error:', requestError);
    return NextResponse.json(
      { error: 'server_error' },
      { status: 500 }
    );
  }
}