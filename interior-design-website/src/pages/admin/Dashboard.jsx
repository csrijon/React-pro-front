import { Link } from 'react-router-dom';
import { FolderKanban, Users, Layers, Inbox, CheckCircle2, FileEdit } from 'lucide-react';
import PageTitle from '../../components/admin/PageTitle';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { AreaChart, BarList, Donut } from '../../components/admin/Charts';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { useAsync } from '../../hooks/useAsync';
import { dashboardApi } from '../../services/api';
import { timeAgo } from '../../utils/helpers';

const Card = ({ title, children, className = '' }) => <section className={`a-card p-5 ${className}`}><h2 className="font-sans text-sm font-semibold mb-4">{title}</h2>{children}</section>;

export default function Dashboard() {
  const { data: d, loading, error, reload } = useAsync(() => dashboardApi.get(), []);
  if (loading) return <LoadingSpinner dark label="Loading dashboard" />;
  if (error) return <ErrorState dark error={error} onRetry={reload} />;
  const t = d.totals;
  return (
    <>
      <PageTitle title="Dashboard" text="Overview of your website and inquiries." />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total projects" value={t.projects} icon={FolderKanban} />
        <StatCard label="Designers" value={t.designers} icon={Users} />
        <StatCard label="Services" value={t.services} icon={Layers} />
        <StatCard label="Inquiries" value={t.inquiries} hint={`${d.inquiryStats[0].value} new`} icon={Inbox} />
        <StatCard label="Published" value={t.published} icon={CheckCircle2} />
        <StatCard label="Drafts" value={t.drafts} icon={FileEdit} />
      </div>
      <div className="grid lg:grid-cols-3 gap-3 mt-3">
        <Card title="Website visitors · last 7 days" className="lg:col-span-2"><AreaChart data={d.visitors} /></Card>
        <Card title="Projects by category"><Donut data={d.byCategory} /></Card>
        <Card title="Project views" className="lg:col-span-2"><BarList data={d.projectViews} /></Card>
        <Card title="Inquiry statistics"><BarList data={d.inquiryStats} /></Card>
        <Card title="Latest inquiries" className="lg:col-span-2">
          <ul className="divide-y divide-white/[0.06]">
            {d.latestInquiries.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0"><p className="font-semibold truncate">{i.name}</p><p className="text-xs text-cream/50 truncate">{i.projectType} · {timeAgo(i.createdAt)}</p></div>
                <StatusBadge status={i.status} />
              </li>
            ))}
          </ul>
          <Link to="/admin/inquiries" className="inline-block mt-3 text-xs text-sage hover:underline">View all inquiries</Link>
        </Card>
        <Card title="Recent activity">
          <ul className="space-y-3">{d.activity.map((a) => <li key={a.text} className="text-sm"><p className="text-cream/85">{a.text}</p><p className="text-xs text-cream/40">{timeAgo(a.at)}</p></li>)}</ul>
        </Card>
      </div>
    </>
  );
}
