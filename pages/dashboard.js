import useSWR from 'swr';
import { useAuth } from '@/lib/auth';
import EmptyState from '@/components/empty-state';
import SiteTable from '../components/site-table';
import DashboardShell from '@/components/dashboard-shell';
import fetcher from '@/utils/fetcher';

const Dashboard = () => {
  const auth = useAuth();
  const { data } = useSWR('/api/sites', fetcher);

  if (!data) {
    <DashboardShell>
      <EmptyState />
    </DashboardShell>;
  }

  return (
    <DashboardShell>
      {data?.sites ? <SiteTable sites={data.sites} /> : <EmptyState />}
    </DashboardShell>
  );
};

export default Dashboard;
