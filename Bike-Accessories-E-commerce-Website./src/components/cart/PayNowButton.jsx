import { useState } from 'react'
import { CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingButton from '../forms/LoadingButton'
import orderService from '../../services/orderService'
import { payWithRazorpay } from '../../utils/razorpay'

/** Retry payment for an order that is still "Pending Payment". Calls onPaid(order) after server-side verification. */
export default function PayNowButton({ order, onPaid, className = 'btn-primary' }) {
  const [busy, setBusy] = useState(false)
  if (order.status !== 'Pending Payment' || !order.payment?.checkout) return null
  const pay = async () => {
    setBusy(true)
    try {
      const proof = await payWithRazorpay(order)
      const paid = await orderService.verifyPayment(order.id, proof)
      toast.success('Payment received. Thank you!')
      onPaid?.(paid)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }
  return <LoadingButton type="button" onClick={pay} loading={busy} loadingText="Opening payment..." className={className}><CreditCard size={16} /> Pay now</LoadingButton>
}
