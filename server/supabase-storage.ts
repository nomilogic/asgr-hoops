
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment variables');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || 'asgr-images';

export interface UploadImageResult {
  url: string;
  path: string;
}

export async function uploadPlayerImage(
  playerId: number,
  imageFile: Buffer,
  fileName: string
): Promise<UploadImageResult> {
  const fileExt = fileName.split('.').pop();
  const filePath = `players/${playerId}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageFile, {
      contentType: `image/${fileExt}`,
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload player image: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath
  };
}

export async function uploadCollegeLogo(
  collegeName: string,
  imageFile: Buffer,
  fileName: string
): Promise<UploadImageResult> {
  const fileExt = fileName.split('.').pop();
  const sanitizedName = collegeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filePath = `colleges/${sanitizedName}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageFile, {
      contentType: `image/${fileExt}`,
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload college logo: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    url: urlData.publicUrl,
    path: filePath
  };
}

export async function uploadImageFromLocalPath(
  localPath: string,
  storagePath: string
): Promise<UploadImageResult> {
  const fs = await import('fs');
  const imageBuffer = fs.readFileSync(localPath);
  
  const fileExt = localPath.split('.').pop();
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, imageBuffer, {
      contentType: `image/${fileExt}`,
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload image from local path: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  return {
    url: urlData.publicUrl,
    path: storagePath
  };
}

export async function getImageUrl(filePath: string): Promise<string> {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}
