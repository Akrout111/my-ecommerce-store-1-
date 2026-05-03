import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { success, forbidden, validationError, internalError } from '@/lib/api-response';

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

    const url = await uploadImage(file);
    return success({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return internalError(message);
  }
}
