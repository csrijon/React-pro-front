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
import usePageTitle from '../../hooks/usePageTitle'

export default function Home() {
  usePageTitle('')
  return (
    <>
      <Hero />
      <FeatureBar />
      <CategoryShowcase />
      <ProductSection eyebrow="Hot Right Now" title="Trending Products" subtitle="What riders are adding to their garage this week." params={{ tag: 'trending', sort: 'popular' }} to="/shop?sort=popular" />
      <PromoBanners />
      <ProductSection bg="bg-ink-800/40 mt-10 border-y border-line" eyebrow="Customer Favourites" title="Best-Selling Accessories" params={{ tag: 'bestseller', sort: 'rating' }} to="/shop?sort=rating" />
      <ProductSection eyebrow="Just Landed" title="New Arrivals" params={{ tag: 'new', sort: 'newest' }} to="/shop?sort=newest" />
      <BrandStrip />
      <WhyChoose />
      <Testimonials />
      <BlogPreview />
      <NewsletterBand />
    </>
  )
}
