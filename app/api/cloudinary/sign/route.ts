import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';

function signUploadParams(params: Record<string, string>, apiSecret: string) {
  const sortedPairs = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));

  const toSign = sortedPairs.map(([key, value]) => `${key}=${value}`).join('&');
  return createHash('sha1').update(`${toSign}${apiSecret}`).digest('hex');
}

export async function POST(req: Request) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary environment variables are missing.' },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    folder?: string;
    public_id?: string;
    resource_type?: string;
    overwrite?: boolean;
  };

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signableParams: Record<string, string> = {
    timestamp,
    resource_type: body.resource_type || 'video',
    overwrite: String(body.overwrite ?? true),
  };

  if (body.folder) signableParams.folder = body.folder;
  if (body.public_id) signableParams.public_id = body.public_id;

  const signature = signUploadParams(signableParams, apiSecret);

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    params: signableParams,
  });
}
