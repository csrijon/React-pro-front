import useFetch from '../../hooks/useFetch'
import contentService from '../../services/contentService'
import SectionHeading from '../common/SectionHeading'
import BlogCard from '../common/BlogCard'
import { Skeleton } from '../common/Skeletons'
import { ErrorState } from '../common/States'

export default function BlogPreview() {
  const { data, loading, error, reload } = useFetch(() => contentService.blogs(), [])
  return (
    <section className="container-x py-14 sm:py-16">
      <SectionHeading eyebrow="From the Blog" title="Latest Riding Blogs" to="/blog" linkLabel="All Articles" />
      {loading ? (
        <div className="grid gap-5 md:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-80" />)}</div>
      ) : error ? <ErrorState message={error.message} onRetry={reload} /> : (
        <div className="grid gap-5 md:grid-cols-3">{data.slice(0, 3).map((b) => <BlogCard key={b.slug} post={b} />)}</div>
      )}
    </section>
  )
}
