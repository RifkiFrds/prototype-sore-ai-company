'use client';

import * as React from 'react';
import Link from 'next/link';
import { useMockStore } from '@/stores/mock.store';
import { Badge, Button } from '@/components/ui';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ArrowLeft, Bot, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import type { ChatSession } from '@/types';

export function SessionViewerPage({ sessionId }: { sessionId: string }) {
  const { sessions } = useMockStore();
  const session = sessions.find((s) => s.id === sessionId) as ChatSession | undefined;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-sm">Session not found.</p>
        <Link href={ROUTES.sessions} className="mt-3 text-blue-600 hover:underline text-sm">← Back to Sessions</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.sessions} className="p-2 rounded-[8px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-base font-semibold text-gray-900">{session.title}</h1>
          <p className="text-xs text-gray-400">{session.messages.length} messages · {formatDateTime(session.createdAt)}</p>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Metadata Panel */}
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-[12px] border border-gray-200 p-5 space-y-4 sticky top-20">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Session Info</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Messages</span>
                  <span className="font-medium text-gray-700">{session.messages.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Started</span>
                  <span className="font-medium text-gray-700">{formatDateTime(session.createdAt)}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tools Used</p>
              <div className="flex flex-wrap gap-1.5">
                {[...new Set(session.messages.flatMap((m) => m.toolsUsed ?? []))].map((tool) => (
                  <Badge key={tool} variant="secondary" className="text-xs">{tool}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Message Timeline */}
        <div className="flex-1 space-y-3 min-w-0">
          {session.messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                )}
                <div className={cn('max-w-[70%]', isUser ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
                  <div
                    className={cn(
                      'px-4 py-3 rounded-[12px] text-sm leading-relaxed',
                      isUser
                        ? 'bg-blue-50 border border-blue-100 text-gray-800'
                        : 'bg-white border border-gray-200 text-gray-800',
                    )}
                  >
                    {msg.content}
                  </div>
                  <div className={cn('flex items-center gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}>
                    <span className="text-xs text-gray-400">{formatDateTime(msg.createdAt)}</span>
                    {msg.toolsUsed?.map((tool) => (
                      <Badge key={tool} variant="secondary" className="text-[10px] px-1.5 py-0">{tool}</Badge>
                    ))}
                  </div>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
