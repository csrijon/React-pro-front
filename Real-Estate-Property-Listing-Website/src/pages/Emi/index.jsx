import { useSEO } from '../../utils/seo'
import PageHeader from '../../components/common/PageHeader'
import EmiCalculator from '../../components/common/EmiCalculator'

export default function Emi() {
  useSEO('Home Loan EMI Calculator', 'Estimate your monthly home loan EMI, total interest and total payable amount.')
  return (
    <>
      <PageHeader title="Home loan EMI calculator" subtitle="Plan your budget before you shortlist properties." />
      <div className="container-x py-10"><div className="card p-6 sm:p-8"><EmiCalculator /></div></div>
    </>
  )
}
