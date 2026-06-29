'use client';

import * as React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { queryClient } from '@/lib/query-client';
import { useMockStore } from '@/stores/mock.store';
import { Toaster } from 'sonner';

function MockDataInit() {
  const { isSeeded, seedAllMockData } = useMockStore();
  React.useEffect(() => {
    if (!isSeeded) seedAllMockData();
  }, [isSeeded, seedAllMockData]);
  return null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MockDataInit />
      <Sidebar />
      <Header />
      <PageContainer>{children}</PageContainer>
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}
