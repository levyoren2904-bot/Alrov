'use server';

import { signIn, signOut } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';
import { AuthError } from 'next-auth';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: 'נא למלא אימייל וסיסמה' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'אימייל או סיסמה שגויים' };
    }
    return { error: 'אירעה שגיאה. נא לנסות שנית.' };
  }
}

export async function logout() {
  await signOut({ redirect: false });
}
