'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/PageContainer';
import { DataTable, Column } from '@/components/data-display/DataTable';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { Badge, Button, Dialog, Input, Select, Textarea, Label, Progress, Skeleton, DropdownMenu } from '@/components/ui';
import { useMockStore } from '@/stores/mock.store';
import { formatDate, formatBytes } from '@/lib/utils';
import type { KnowledgeDocument } from '@/types';
import {
  Upload, Search, FileText, File, Eye, RefreshCw, Trash2, MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

const FILE_TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  PDF: FileText, DOCX: File, TXT: File, CSV: File, JSON: File,
};

const FILE_TYPE_COLOR: Record<string, string> = {
  PDF: 'bg-red-50 text-red-700',
  DOCX: 'bg-blue-50 text-blue-700',
  TXT: 'bg-gray-100 text-gray-600',
  CSV: 'bg-green-50 text-green-700',
  JSON: 'bg-amber-50 text-amber-700',
};

// ─── Upload Dialog ────────────────────────────────────────────────────────────
function UploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dragging, setDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 80));
      setProgress(i);
    }
    setUploading(false);
    toast.success(`"${file.name}" uploaded successfully. Embedding in progress...`);
    setFile(null);
    setProgress(0);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Upload Knowledge Document" size="md">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-[12px] p-10 text-center transition-colors cursor-pointer ${
          dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        {file ? (
          <p className="text-sm font-medium text-gray-900">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">Drop file here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">.pdf, .docx, .txt, .csv, .json — max 10 MB</p>
          </>
        )}
        <input
          id="file-input"
          type="file"
          accept=".pdf,.docx,.txt,.csv,.json"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
      <div className="flex justify-end gap-2 mt-5">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpload} disabled={!file} loading={uploading}>
          <Upload className="w-4 h-4" /> Upload Document
        </Button>
      </div>
    </Dialog>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────
function DeleteDialog({ doc, onClose }: { doc: KnowledgeDocument | null; onClose: () => void }) {
  if (!doc) return null;
  return (
    <Dialog open={!!doc} onClose={onClose} title="Delete Document" size="sm">
      <p className="text-sm text-gray-600 mb-1">
        Are you sure you want to delete <span className="font-medium text-gray-900">"{doc.name}"</span>?
      </p>
      <p className="text-xs text-gray-400 mb-5">This will remove all {doc.totalChunks} chunks from the vector database.</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => { toast.error('Delete endpoint not yet implemented on backend.'); onClose(); }}>
          <Trash2 className="w-4 h-4" /> Delete
        </Button>
      </div>
    </Dialog>
  );
}

// ─── Knowledge Page ───────────────────────────────────────────────────────────
export function KnowledgePage() {
  const { documents } = useMockStore();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [deleteDoc, setDeleteDoc] = React.useState<KnowledgeDocument | null>(null);

  const filtered = React.useMemo(() => {
    return documents.filter((d) => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [documents, search, statusFilter]);

  const columns: Column<KnowledgeDocument>[] = [
    {
      key: 'name',
      header: 'Document',
      sortable: true,
      accessor: (d) => {
        const Icon = FILE_TYPE_ICON[d.fileType] ?? File;
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-[6px] bg-gray-50 shrink-0">
              <Icon className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 truncate max-w-[240px]">{d.name}</span>
          </div>
        );
      },
    },
    {
      key: 'fileType',
      header: 'Type',
      accessor: (d) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${FILE_TYPE_COLOR[d.fileType] ?? 'bg-gray-100 text-gray-600'}`}>
          {d.fileType}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (d) => <StatusBadge status={d.status} dot />,
    },
    {
      key: 'uploadDate',
      header: 'Upload Date',
      sortable: true,
      accessor: (d) => <span className="text-gray-500 text-sm">{formatDate(d.uploadDate)}</span>,
    },
    {
      key: 'totalChunks',
      header: 'Chunks',
      align: 'right',
      accessor: (d) => <span className="text-gray-500 text-sm font-mono">{d.totalChunks}</span>,
    },
    {
      key: 'sizeBytes',
      header: 'Size',
      align: 'right',
      accessor: (d) => <span className="text-gray-400 text-xs">{formatBytes(d.sizeBytes)}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      accessor: (d) => (
        <DropdownMenu
          trigger={
            <button className="p-1.5 rounded-[6px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
          items={[
            { label: 'View', icon: <Eye className="w-3.5 h-3.5" />, onClick: () => toast.info('Document viewer coming soon') },
            { label: 'Re-embed', icon: <RefreshCw className="w-3.5 h-3.5" />, onClick: () => toast.info('Re-embed endpoint not yet implemented') },
            { label: 'Delete', icon: <Trash2 className="w-3.5 h-3.5" />, onClick: () => setDeleteDoc(d), danger: true },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Knowledge Base"
        description={`${documents.filter((d) => d.status === 'READY').length} of ${documents.length} documents ready`}
        action={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="w-4 h-4" /> Upload Document
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-36"
        >
          <option value="ALL">All Status</option>
          <option value="READY">Ready</option>
          <option value="PROCESSING">Processing</option>
          <option value="ERROR">Error</option>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(d) => d.id}
        emptyTitle="No documents found"
        emptyDescription="Upload your first knowledge document to get started."
      />

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <DeleteDialog doc={deleteDoc} onClose={() => setDeleteDoc(null)} />
    </div>
  );
}
