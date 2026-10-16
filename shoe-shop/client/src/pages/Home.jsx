import { Link } from 'react-router-dom';
import { GENDERS, genderLabel, genderSlug, inr } from '../lib/api.js';
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

const StripIcon = ({ path }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>
);

export default function Home() {
  const { data, error, loading, reload } = useFetch('/api/home');
  const { settings } = useSettings();
  if (loading) return <Spinner />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  const { featured, newArrivals, popularCategories, brands } = data;

  const strip = [
    { label: 'Live stock on every style', text: 'Accurate availability, updated as it sells', icon: <><path d="M20 6 9 17l-5-5" /></> },
    { label: 'Men, Women & Kids', text: 'The whole family in one collection', icon: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14.5 15.3A5 5 0 0 1 21 20" /></> },
    settings.wholesaleEnabled !== false
      ? { label: 'Wholesale pricing', text: 'Unlocked after your shop is approved', icon: <><path d="M3 9.5 12 4l9 5.5M5 10v9h14v-9M9 19v-5h6v5" /></> }
      : { label: 'Trusted brands', text: 'A curated range you can rely on', icon: <><path d="M12 3l2.5 5.2 5.5.8-4 3.9.9 5.5L12 16l-4.9 2.6.9-5.5-4-3.9 5.5-.8z" /></> },
    { label: 'Personal service', text: 'Enquire or order in a tap', icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></> },
  ];

  return (
    <>
      <section className="hero">
        <span className="orb o1" aria-hidden="true" /><span className="orb o2" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Wholesale footwear</span>
            <h1>Men, Women &amp; Kids <em>footwear</em> in one place</h1>
            <p>Browse the full range from trusted brands. Register your shop to unlock wholesale prices.</p>
            <div className="hero-links">
              {GENDERS.map((g) => <Link key={g.key} className="btn light" to={`/products/${g.slug}`}>{g.label}</Link>)}
            </div>
            <ul className="hero-points">
              <li>Live stock on every style</li>
              <li>All brands, colours &amp; sizes</li>
              <li>Wholesale prices after approval</li>
            </ul>
          </div>
          {featured.length > 0 && (
            <div className="hero-art">
              {featured.slice(0, 3).map((p, i) => (
                <Link key={p.id} className={`hero-tile t${i + 1}`} to={`/product/${p.slug}`} aria-label={p.name}>
                  <ShoeImage src={p.image} alt={p.name} priority={i === 0} sizes="(min-width: 900px) 300px, 44vw" widths={[320, 480, 640]} />
                  <span className="hero-tile-cap">
                    <strong>{p.name}</strong>
                    <span>MRP {inr(p.mrp.min)}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="value-strip" aria-label="Why shop with us">
        <div className="container value-strip-row">
          {strip.map((s) => (
            <div className="value-item" key={s.label}>
              <span className="value-ico" aria-hidden="true"><StripIcon path={s.icon} /></span>
              <span className="value-text"><strong>{s.label}</strong><span className="small muted">{s.text}</span></span>
            </div>
          ))}
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

      {newArrivals?.length > 0 && (
        <Section title="New arrivals" to="/products?sort=newest">
          <div className="grid products">{newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </Section>
      )}

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
        <Reveal as="section" className="container section">
          <div className="cta-band">
            <div><h2>Are you a shop owner?</h2><p>{settings.wholesaleNote}</p></div>
            <Link className="btn accent" to="/register">Register for wholesale</Link>
          </div>
        </Reveal>
      )}
    </>
  );
}
