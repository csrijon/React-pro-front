import { Link } from 'react-router-dom';
import { GENDERS, genderLabel, genderSlug } from '../lib/api.js';
import { useFetch } from '../lib/hooks.jsx';
import { Reveal } from '../lib/motion.jsx';
import { BrandLogo, Empty, ErrorBox, ShoeImage, Spinner } from '../components/ui.jsx';

export function Brands() {
  const { data, error, loading, reload } = useFetch('/api/brands');
  if (loading) return <Spinner />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  return (
    <div className="container page">
      <h1>Brands we sell</h1>
      {data.brands.length === 0 ? <Empty title="No brands yet" /> : (
        <div className="grid brand-grid big">
          {data.brands.map((b) => (
            <Reveal as={Link} key={b.id} to={`/products?brand=${b.slug}`} className="card brand-card">
              <BrandLogo brand={b} size="lg" />
              <strong>{b.name}</strong><span className="small muted">{b.productCount} product{b.productCount === 1 ? '' : 's'}</span>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

export function Categories() {
  const { data, error, loading, reload } = useFetch('/api/categories');
  if (loading) return <Spinner />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  return (
    <div className="container page">
      <h1>Categories</h1>
      {GENDERS.map((g) => {
        const list = data.categories.filter((c) => c.gender === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key} className="section">
            <div className="section-head"><h2>{g.label}</h2><Link to={`/products/${g.slug}`}>View all {g.label.toLowerCase()} →</Link></div>
            <div className="grid cat-grid">
              {list.map((c) => (
                <Reveal as={Link} key={c.id} className="card cat-card" to={`/products/${genderSlug(c.gender)}/${c.slug}`}>
                  <ShoeImage src={c.imageUrl} alt="" />
                  <div><strong>{genderLabel(c.gender)} · {c.name}</strong><span className="small muted">{c.productCount} product{c.productCount === 1 ? '' : 's'}</span></div>
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
