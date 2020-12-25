import useSWR from 'swr';
import { useAuth } from '@/lib/auth';
import EmptyState from '@/components/empty-state';
import SiteTable from '../components/site-table';
import SiteTableSkeleton from '../components/site-table-skeleton';
import SiteTableHeader from '../components/site-table-header';
import DashboardShell from '@/components/dashboard-shell';
import fetcher from '@/utils/fetcher';

const Dashboard = () => {
  const { user } = useAuth();
  // use token to authenticate for our request
  const { data } = useSWR(user ? ['/api/sites', user.token] : null, fetcher);

  if (!data) {
    <DashboardShell>
      <SiteTableHeader />
      <SiteTableSkeleton />
    </DashboardShell>;
  }

  return (
    <DashboardShell>
      <SiteTableHeader />
      {data?.sites ? <SiteTable sites={data.sites} /> : <EmptyState />}
    </DashboardShell>
  );
};

export default Dashboard;
