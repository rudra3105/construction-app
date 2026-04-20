import { getCurrentUser } from '../lib/auth';
import { redirect } from 'next/navigation';

export default function HomePage() {
  const user = getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }
  redirect('/login');
}
