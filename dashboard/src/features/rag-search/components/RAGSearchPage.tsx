'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui';
import { Button, Textarea, Slider } from '@/components/ui';
import { apiClient } from '@/services/api.client';
import type { RAGQueryResult, RAGChunkResult } from '@/types';
import { Search, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// ─── Similarity Score Bar ─────────────────────────────────────────────────────
function SimilarityBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-blue-700 shrink-0">{score.toFixed(3)}</span>
    </div>
  );
}

// ─── Search Result Card ───────────────────────────────────────────────────────
function SearchResultCard({ result, rank }: { result: RAGChunkResult; rank: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-[12px] p-4 space-y-2.5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-gray-300 shrink-0">#{rank}</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <p className="text-sm font-medium text-gray-900 truncate">{result.documentName}</p>
          </div>
        </div>
      </div>
      <SimilarityBar score={result.similarityScore} />
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{result.content}</p>
      <p className="text-xs text-gray-300 font-mono">chunk: {result.chunkId}</p>
    </div>
  );
}

// ─── Mock Results for Demo ────────────────────────────────────────────────────
function generateMockResults(query: string, topK: number): RAGChunkResult[] {
  const sources = ['SOP dan Kebijakan', 'Transkrip Rapat', 'Company Policy 2026', 'Employee Handbook', 'Marketing Strategy 2026'];
  return Array.from({ length: topK }, (_, i) => ({
    chunkId: `chunk-${Math.random().toString(36).slice(2, 10)}`,
    documentName: sources[i % sources.length],
    content: `Berdasarkan dokumen yang tersimpan dalam knowledge base, informasi terkait "${query}" dapat ditemukan pada bagian ini. Konten ini merupakan representasi dari embedding yang disimpan dalam pgvector dan diambil berdasarkan similarity score tertinggi dari query yang diberikan.`,
    similarityScore: Math.max(0.5, 0.98 - i * 0.08),
    metadata: { page: i + 1, section: `Section ${i + 1}` },
  }));
}

// ─── RAG Search Page ──────────────────────────────────────────────────────────
export function RAGSearchPage() {
  const [query, setQuery] = React.useState('');
  const [topK, setTopK] = React.useState(5);
  const [results, setResults] = React.useState<RAGChunkResult[] | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.post<RAGQueryResult>('/rag/query', { query, topK });
      setResults(res.data.results);
    } catch {
      // Fallback to mock results for demo
      await new Promise((r) => setTimeout(r, 600));
      setResults(generateMockResults(query, topK));
      toast.info('Using demo results — backend returned no data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="RAG Search Lab"
        description="Test semantic search quality against your knowledge base"
      />

      <div className="flex gap-5">
        {/* Input Panel */}
        <div className="w-80 shrink-0 space-y-4">
          <Card className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Query</label>
              <Textarea
                placeholder="Enter a question or search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
            <Slider
              label="Top K Results"
              value={topK}
              min={1}
              max={20}
              onChange={setTopK}
            />
            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={!query.trim() || loading}
              loading={loading}
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search Knowledge Base'}
            </Button>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Parameters</p>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div className="flex justify-between"><span>Endpoint</span><span className="font-mono text-gray-700">POST /api/rag/query</span></div>
              <div className="flex justify-between"><span>Top K</span><span className="font-semibold text-gray-700">{topK}</span></div>
              <div className="flex justify-between"><span>Model</span><span className="font-mono text-gray-700">pgvector</span></div>
            </div>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="flex-1 min-w-0">
          {!results && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">Enter a query to search the knowledge base</p>
              <p className="text-xs text-gray-400 mt-1">Results will show similarity scores and retrieved context chunks</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-3" />
              <p className="text-sm text-gray-500">Searching knowledge base...</p>
            </div>
          )}

          {results && !loading && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">
                Retrieved Context <span className="text-blue-600 font-semibold">({results.length} results)</span>
              </p>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <SearchResultCard key={r.chunkId} result={r} rank={i + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
