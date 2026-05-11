import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { CreditCard } from 'lucide-react'
import type { Payment } from '@/types'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
  paid: 'success', pending: 'warning', overdue: 'destructive', partial: 'info',
}

interface Props { payments: Payment[] }

export default function PaymentStatusList({ payments }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Payment Status</h3>
        <Link href="/dashboard/rent" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No payments this month</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{payment.tenant_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{payment.unit} · {payment.month}</p>
              </div>
              <div className="flex items-center gap-3 ml-3">
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                <Badge variant={statusVariant[payment.status]} className="capitalize text-xs">{payment.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
