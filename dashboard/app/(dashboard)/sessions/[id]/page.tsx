'use client';

import { SessionViewerPage } from '@/features/sessions/viewer/SessionViewerPage';

export default function SessionDetailRoute({ params }: { params: { id: string } }) {
  return <SessionViewerPage sessionId={params.id} />;
}
