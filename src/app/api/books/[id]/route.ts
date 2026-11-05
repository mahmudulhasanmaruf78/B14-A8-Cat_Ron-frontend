import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getApiBaseUrl } from '@/lib/api-client';

const API_BASE_URL = getApiBaseUrl();
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'booknook_jwt_secret_key_change_me_in_production';

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PATCH',
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
      { success: false, message: (error as Error).message || 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const token = await signJwt(
      {
        userId: session.user.id || '',
        email: session.user.email,
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + 15 * 60,
      },
      JWT_SECRET
    );

    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message || 'Failed to delete book' },
      { status: 500 }
    );
  }
}

