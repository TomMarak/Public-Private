import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let s3Client: S3Client | null = null;

const getS3Client = () => {
  if (!s3Client) {
    s3Client = new S3Client({
      region: 'auto', // R2 uses 'auto' region
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }
  return s3Client;
};

export const uploadToR2 = async (file: Buffer | Uint8Array, key: string, contentType?: string): Promise<string> => {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read', // Make files publicly accessible
  });

  await client.send(command);

  // Return the public URL
  return getR2Url(key);
};

export const getR2Url = (key: string): string => {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) {
    throw new Error('R2_PUBLIC_URL environment variable is not set');
  }
  return `${publicUrl}/${key}`;
};

export const deleteFromR2 = async (key: string): Promise<void> => {
  const client = getS3Client();

  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  await client.send(command);
};

export const getSignedR2Url = async (key: string, expiresIn: number = 3600): Promise<string> => {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn });
};

// Utility function for generating unique file keys
export const generateFileKey = (originalName: string, prefix: string = 'uploads'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${prefix}/${timestamp}-${random}.${extension}`;
};

// Utility function for file validation
export const validateImageFile = (file: { size: number; type: string }): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (file.size > maxSize) {
    return { valid: false, error: 'Soubor je příliš velký. Maximální velikost je 10MB.' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Nepodporovaný typ souboru. Povolené formáty: JPEG, PNG, WebP, GIF.' };
  }

  return { valid: true };
};
