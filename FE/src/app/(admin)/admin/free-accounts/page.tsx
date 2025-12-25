import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the Container which handles API calls
const FreeAccountManagementPageContainer = dynamic(
	() => import('@/components/admin/FreeAccountManagementPageContainer'),
	{ ssr: false, loading: () => <div className="p-8 text-center">Loading...</div> }
);

export default function FreeAccountPage() {
	return (
		<Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
			<FreeAccountManagementPageContainer />
		</Suspense>
	);
}
