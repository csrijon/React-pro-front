import SectionHeading from '../common/SectionHeading'
import ProductRow from '../products/ProductRow'

export default function ProductSection({ eyebrow, title, subtitle, params, to, count = 4, bg = '' }) {
  return (
    <section className={bg}>
      <div className="container-x py-14 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} to={to} />
        <ProductRow params={params} count={count} />
      </div>
    </section>
  )
}
