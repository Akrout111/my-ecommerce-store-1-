import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata = { title: 'Reset Password | Persona' };

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token || '';

  return <ResetPasswordForm token={token} />;
}
