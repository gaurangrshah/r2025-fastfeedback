import useSWR from 'swr';
import { useAuth } from '@/lib/auth';
import EmptyState from '@/components/empty-state';
import SiteTable from '../components/site-table';
import DashboardShell from '@/components/dashboard-shell';
import fetcher from '@/utils/fetcher';

const Dashboard = () => {
  const { user } = useAuth();
  // use token to authenticate for our request
  const { data } = useSWR(user ? ['/api/sites', user.token] : null, fetcher);

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
