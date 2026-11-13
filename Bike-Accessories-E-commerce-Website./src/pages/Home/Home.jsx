import Hero from '../../components/home/Hero'
import FeatureBar from '../../components/home/FeatureBar'
import CategoryShowcase from '../../components/home/CategoryShowcase'
import ProductSection from '../../components/home/ProductSection'
import PromoBanners from '../../components/home/PromoBanners'
import BrandStrip from '../../components/home/BrandStrip'
import WhyChoose from '../../components/home/WhyChoose'
import Testimonials from '../../components/home/Testimonials'
import BlogPreview from '../../components/home/BlogPreview'
import NewsletterBand from '../../components/home/NewsletterBand'
import LazySection from '../../components/common/LazySection'
import usePageTitle from '../../hooks/usePageTitle'

// Hero, feature bar and categories are the first screen. Everything below mounts (and fetches its data)
// only when the visitor scrolls near it, keeping the initial load small.
export default function Home() {
  usePageTitle('')
  return (
    <>
      <Hero />
      <FeatureBar />
      <CategoryShowcase />
      <LazySection minHeight={720}><ProductSection eyebrow="Hot Right Now" title="Trending Products" subtitle="What riders are adding to their garage this week." params={{ tag: 'trending', sort: 'popular' }} to="/shop?sort=popular" /></LazySection>
      <LazySection minHeight={420}><PromoBanners /></LazySection>
      <LazySection minHeight={720}><ProductSection bg="bg-ink-800/40 mt-10 border-y border-line" eyebrow="Customer Favourites" title="Best-Selling Accessories" params={{ tag: 'bestseller', sort: 'rating' }} to="/shop?sort=rating" /></LazySection>
      <LazySection minHeight={720}><ProductSection eyebrow="Just Landed" title="New Arrivals" params={{ tag: 'new', sort: 'newest' }} to="/shop?sort=newest" /></LazySection>
      <LazySection minHeight={300}><BrandStrip /></LazySection>
      <LazySection minHeight={560}><WhyChoose /></LazySection>
      <LazySection minHeight={420}><Testimonials /></LazySection>
      <LazySection minHeight={460}><BlogPreview /></LazySection>
      <LazySection minHeight={380}><NewsletterBand /></LazySection>
    </>
  )
}
