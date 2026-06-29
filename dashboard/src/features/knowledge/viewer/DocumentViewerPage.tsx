'use client';

import Link from 'next/link';
import { useMockStore } from '@/stores/mock.store';
import { Card } from '@/components/ui';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { formatDate, formatBytes } from '@/lib/utils';
import { ArrowLeft, FileText, Hash, Calendar, Database } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function DocumentViewerPage({ documentId }: { documentId: string }) {
  const { documents } = useMockStore();
  const doc = documents.find((d) => d.id === documentId);

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 text-sm">Document not found.</p>
        <Link href={ROUTES.knowledge} className="mt-3 text-blue-600 hover:underline text-sm">← Back to Knowledge</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.knowledge} className="p-2 rounded-[8px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-base font-semibold text-gray-900">{doc.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusBadge status={doc.status} dot />
            <span className="text-xs text-gray-400">{doc.fileType}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Metadata */}
        <Card className="p-5 lg:col-span-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Metadata</p>
          <div className="space-y-3">
            {[
              { icon: FileText, label: 'File Type', value: doc.fileType },
              { icon: Hash, label: 'Total Chunks', value: `${doc.totalChunks} chunks` },
              { icon: Database, label: 'File Size', value: formatBytes(doc.sizeBytes) },
              { icon: Calendar, label: 'Upload Date', value: formatDate(doc.uploadDate) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
                <span className="font-medium text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Chunk Preview */}
        <Card className="p-5 lg:col-span-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Embedding Chunks ({doc.totalChunks})
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {Array.from({ length: Math.min(doc.totalChunks, 10) }, (_, i) => (
              <div key={i} className="bg-gray-50 rounded-[8px] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-gray-400">chunk_{String(i + 1).padStart(3, '0')}</span>
                  <span className="text-xs text-gray-300">~{Math.floor(Math.random() * 200 + 100)} tokens</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  Chunk content from "{doc.name}" — section {i + 1}. This chunk has been processed and embedded into the pgvector database for semantic search retrieval.
                </p>
              </div>
            ))}
            {doc.totalChunks > 10 && (
              <p className="text-xs text-gray-400 text-center py-2">... and {doc.totalChunks - 10} more chunks</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
