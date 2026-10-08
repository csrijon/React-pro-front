import { Link } from 'react-router-dom';
import { GENDERS, genderLabel, genderSlug } from '../lib/api.js';
import { useFetch, useSettings } from '../lib/hooks.jsx';
import { Reveal } from '../lib/motion.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { BrandLogo, Empty, ErrorBox, ShoeImage, Spinner } from '../components/ui.jsx';

function Section({ title, to, children }) {
  return (
    <Reveal as="section" className="section container">
      <div className="section-head"><h2>{title}</h2>{to && <Link to={to}>View all →</Link>}</div>
      {children}
    </Reveal>
  );
}

export default function Home() {
  const { data, error, loading, reload } = useFetch('/api/home');
  const { settings } = useSettings();
  if (loading) return <Spinner />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  const { featured, newArrivals, popularCategories, brands } = data;
  return (
    <>
      <section className="hero">
        <span className="orb o1" aria-hidden="true" /><span className="orb o2" aria-hidden="true" />
        <div className="container hero-inner">
          <h1>Wholesale footwear for Men, Women &amp; Kids</h1>
          <p>Browse the full range from trusted brands. Register your shop to unlock wholesale prices.</p>
          <div className="hero-links">
            {GENDERS.map((g) => <Link key={g.key} className="btn light" to={`/products/${g.slug}`}>{g.label}</Link>)}
          </div>
        </div>
      </section>

      <Section title="Shop by category" to="/categories">
        {popularCategories.length === 0 ? <Empty title="No categories yet" /> : (
          <div className="grid cat-grid">
            {popularCategories.map((c) => (
              <Reveal as={Link} key={c.id} className="card cat-card" to={`/products/${genderSlug(c.gender)}/${c.slug}`}>
                <ShoeImage src={c.imageUrl} alt="" />
                <div><strong>{genderLabel(c.gender)} · {c.name}</strong><span className="small muted">{c.productCount} product{c.productCount === 1 ? '' : 's'}</span></div>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      {featured.length > 0 && (
        <Section title="Featured products" to="/products?featured=1">
          <div className="grid products">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </Section>
      )}

      <Section title="New arrivals" to="/products?sort=newest">
        {newArrivals.length === 0 ? <Empty title="No products yet">Check back soon.</Empty>
          : <div className="grid products">{newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
      </Section>

      {brands.length > 0 && (
        <Section title="Brands we sell" to="/brands">
          <div className="grid brand-grid">
            {brands.map((b) => (
              <Reveal as={Link} key={b.id} to={`/products?brand=${b.slug}`} className="card brand-card">
                <BrandLogo brand={b} /><strong>{b.name}</strong>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {settings.wholesaleEnabled !== false && (
        <Section title="How wholesale works">
          <ol className="steps">
            {[['Browse', 'Explore every brand, colour and size with live stock status.'], ['Register your shop', 'Send your shop details — it takes under a minute.'], ['Get approved', 'Once the owner approves your account, wholesale prices unlock on every product.']].map(([t, d], i) => (
              <li key={t} className="step"><span className="step-n">{i + 1}</span><div><strong>{t}</strong><p className="small muted">{d}</p></div></li>
            ))}
          </ol>
        </Section>
      )}

      {settings.wholesaleEnabled !== false && (
        <Reveal as="section" className="container section"><div className="cta-band"><div><h2>Are you a shop owner?</h2><p>{settings.wholesaleNote}</p></div><Link className="btn accent" to="/register">Register for wholesale</Link></div></Reveal>
      )}
    </>
  );
}
