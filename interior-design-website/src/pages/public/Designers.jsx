import PageHeader from '../../components/public/PageHeader';
import DesignerCard from '../../components/public/DesignerCard';
import Reveal from '../../components/common/Reveal';
import ErrorState from '../../components/common/ErrorState';
import CtaBand from '../../components/public/CtaBand';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { designersApi } from '../../services/api';
import { useSite } from '../../context/SiteContext';

export default function Designers() {
  const dp = useSite().pages.designersPage;
  useDocumentMeta(dp.seoTitle || 'Designers', dp.seoDescription);
  const { data, loading, error, reload } = useAsync(() => designersApi.list(), []);
  return (
    <>
      <PageHeader title={dp.heading} text={dp.text} />
      <div className="shell pb-24">
        {loading && <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton aspect-[4/5]" />)}</div>}
        {error && <ErrorState error={error} onRetry={reload} />}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {(data || []).map((d, i) => <Reveal key={d.id} delay={(i % 4) * 0.08} className={i % 2 ? 'lg:mt-14' : ''}><DesignerCard designer={d} /></Reveal>)}
        </div>
      </div>
      <CtaBand heading={dp.ctaHeading} text={dp.ctaText} label={dp.ctaLabel} />
    </>
  );
}
