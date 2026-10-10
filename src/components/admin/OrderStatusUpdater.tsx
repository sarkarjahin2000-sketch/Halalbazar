'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, Clock, AlertCircle } from 'lucide-react'

interface OrderStatusUpdaterProps {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: OrderStatusUpdaterProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus, note: note.trim() || undefined }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to update order')
      } else {
        toast.success(`Order status updated to ${status}!`)
        setNote('')
        router.refresh()
      }
    } catch {
      toast.error('Network error while updating')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
        Update Order State
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Fulfillment Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:border-amber-600"
          >
            <option value="PENDING">PENDING (Awaiting Confirmation)</option>
            <option value="CONFIRMED">CONFIRMED (Call verified)</option>
            <option value="PROCESSING">PROCESSING (Packaging)</option>
            <option value="SHIPPED">SHIPPED (With Courier)</option>
            <option value="DELIVERED">DELIVERED (Completed)</option>
            <option value="CANCELLED">CANCELLED (Rejected/Returned)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:border-amber-600"
          >
            <option value="UNPAID">UNPAID (Pending Cash on Delivery)</option>
            <option value="PAID">PAID (Cash Collected / Handed)</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
          Internal Event Log Note <span className="text-stone-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Spoke with customer, confirmed 500g Sidr Honey; dispatching tomorrow"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-600"
        />
      </div>

      <button
        type="button"
        onClick={handleUpdate}
        disabled={saving}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
      >
        {saving ? (
          <span>Updating...</span>
        ) : (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Save Status Changes</span>
          </>
        )}
      </button>
    </div>
  )
}
