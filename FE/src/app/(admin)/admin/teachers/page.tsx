import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the TeachersPage component with API integration
const TeachersPage = dynamic(
  () => import('@/components/admin/TeachersPage'),
  { ssr: false, loading: () => <div className="p-8 text-center">Loading...</div> }
);

export default function TeachersManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Quản lý giáo viên</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin giáo viên, khóa học và thống kê
          </p>
        </div>
        <TeachersPage />
      </div>
    </Suspense>
  );
}
