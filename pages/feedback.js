import useSWR from 'swr';

import { useAuth } from '@/lib/auth';
import fetcher from '@/utils/fetcher';
import EmptyState from '@/components/empty-state';
import DashboardShell from '@/components/dashboard-shell';
import FeedbackTable from '@/components/feedback-table';
import FeedbackTableHeader from '@/components/feedback-table-header';
import FeedbackTableSkeleton from '@/components/feedback-table-skeleton';

const MyFeedback = () => {
  const { user } = useAuth();
  const { data } = useSWR(user ? ['/api/feedback', user.token] : null, fetcher);

  if (!data) {
    return (
      <DashboardShell>
        <FeedbackTableHeader />
        <FeedbackTableSkeleton />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <FeedbackTableHeader />
      {data?.feedback ? <FeedbackTable feedback={data.feedback} /> : <EmptyState />}
    </DashboardShell>
  );
};

export default MyFeedback;
