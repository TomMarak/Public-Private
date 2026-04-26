import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, generateFileKey, validateImageFile } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile({
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique file key
    const fileKey = generateFileKey(file.name, 'uploads');

    // Upload to R2
    const fileUrl = await uploadToR2(buffer, fileKey, file.type);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      key: fileKey,
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}