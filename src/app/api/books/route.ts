import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'booknook_jwt_access_super_secret_key_2026_catron';

async function signJwt(payload: Record<string, unknown>, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };

  const encodeBase64Url = (obj: Record<string, unknown>): string => {
    const json = JSON.stringify(obj);
    return Buffer.from(json)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const headerB64 = encodeBase64Url(header);
  const payloadB64 = encodeBase64Url(payload);
  const dataToSign = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign));
  const sigB64 = Buffer.from(signature)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${dataToSign}.${sigB64}`;
}

export async function POST(request: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. No session found.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const token = await signJwt(
      {
        userId: session.user.id || '',
        email: session.user.email,
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + 15 * 60,
      },
      JWT_SECRET
    );

    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message || 'Failed to create book' },
      { status: 500 }
    );
  }
}
