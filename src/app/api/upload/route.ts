import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { success, forbidden, validationError, internalError } from '@/lib/api-response';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return forbidden();
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return validationError({ file: 'No file uploaded' });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationError({ file: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.' });
    }

    if (file.size > MAX_FILE_SIZE) {
      return validationError({ file: 'File too large. Maximum size is 5MB.' });
    }

    const url = await uploadImage(file);
    return success({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return internalError(message);
  }
}
