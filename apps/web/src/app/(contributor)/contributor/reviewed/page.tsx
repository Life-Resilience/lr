import { redirect } from 'next/navigation';

export default function ReviewedPage() {
  redirect('/contributor/contributions?filter=REVIEWED');
}
