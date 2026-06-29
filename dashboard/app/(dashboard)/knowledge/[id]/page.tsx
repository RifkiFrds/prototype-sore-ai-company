'use client';

import { DocumentViewerPage } from '@/features/knowledge/viewer/DocumentViewerPage';

export default function KnowledgeDetailRoute({ params }: { params: { id: string } }) {
  return <DocumentViewerPage documentId={params.id} />;
}
