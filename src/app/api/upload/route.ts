import { NextResponse } from 'next/server';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image upload service is not configured (missing IMGBB_API_KEY).',
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: 'No valid image file provided.' },
        { status: 400 }
      );
    }

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported image format. Allowed formats are JPG, JPEG, PNG, and WEBP.',
        },
        { status: 400 }
      );
    }

    // Validate size limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image exceeds maximum allowed size of 5 MB.',
        },
        { status: 400 }
      );
    }

    // Convert file to base64 for imgbb API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64Image);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });

    const imgbbData = await imgbbResponse.json();

    if (!imgbbResponse.ok || !imgbbData.success || !imgbbData.data?.url) {
      const errorMessage =
        imgbbData?.error?.message || 'External image hosting upload failed. Please try again.';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: imgbbData.data.url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal upload server error.',
      },
      { status: 500 }
    );
  }
}
