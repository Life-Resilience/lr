import { redirect } from 'next/navigation';

export default function PendingPage() {
  redirect('/contributor/contributions?filter=PENDING');
}
