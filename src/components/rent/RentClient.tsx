'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Search, CheckCircle2, Clock, AlertCircle, IndianRupee, Download, CreditCard, Calendar } from 'lucide-react'
import { markPaymentPaid } from '@/lib/actions/payments'
import { generateReceipt } from '@/lib/pdf-generator'
import { toast } from 'sonner'
import type { Payment } from '@/types'
import MarkPaidModal from './MarkPaidModal'

const statusConfig = {
  paid: { label: 'Paid', variant: 'success' as const, icon: CheckCircle2, color: 'text-emerald-600' },
  pending: { label: 'Pending', variant: 'warning' as const, icon: Clock, color: 'text-yellow-600' },
  overdue: { label: 'Overdue', variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
  partial: { label: 'Partial', variant: 'info' as const, icon: CreditCard, color: 'text-blue-600' },
}

interface Props { initialPayments: Payment[] }

export default function RentClient({ initialPayments }: Props) {
  const [payments, setPayments] = useState(initialPayments)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [markPaidId, setMarkPaidId] = useState<string | null>(null)

  const filtered = payments.filter(p => {
    const matchSearch = p.tenant_name.toLowerCase().includes(search.toLowerCase()) ||
      p.property_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total: payments.reduce((s, p) => s + p.amount, 0),
    collected: payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0),
    overdue: payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount + (p.late_fee ?? 0), 0),
  }

  const handleMarkPaid = async (paymentMethod: string, paidDate: string, lateFee: number) => {
    if (!markPaidId) return
    const result = await markPaymentPaid(markPaidId, paymentMethod, paidDate, lateFee)
    if (result.error) { toast.error(result.error); return }
    setPayments(prev => prev.map(p => p.id === markPaidId ? { ...p, ...result.data } : p))
    toast.success('Payment marked as paid')
    setMarkPaidId(null)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Rent Tracking</h2>
          <p className="text-sm text-gray-500 mt-0.5">{payments.length} payment records</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Expected', value: formatCurrency(stats.total), icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Collected', value: formatCurrency(stats.collected), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending', value: formatCurrency(stats.pending), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Overdue', value: formatCurrency(stats.overdue), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-base font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search tenant or property..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'paid', 'pending', 'overdue', 'partial'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filterStatus === status ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Tenant', 'Property', 'Amount', 'Due Date', 'Paid Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((payment) => {
                const config = statusConfig[payment.status] ?? statusConfig.pending
                const StatusIcon = config.icon
                return (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                          {payment.tenant_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{payment.tenant_name}</p>
                          <p className="text-xs text-gray-400">{payment.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-700">{payment.property_name}</p>
                      <p className="text-xs text-gray-400">{payment.month}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                      {(payment.late_fee ?? 0) > 0 && <p className="text-xs text-red-500">+{formatCurrency(payment.late_fee)} late fee</p>}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(payment.due_date)}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {payment.paid_date ? (
                        <div>
                          <p className="text-sm text-gray-700">{formatDate(payment.paid_date)}</p>
                          <p className="text-xs text-gray-400">{payment.payment_method}</p>
                        </div>
                      ) : <span className="text-sm text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                        <Badge variant={config.variant} className="capitalize">{config.label}</Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status !== 'paid' && (
                          <Button size="sm" variant="success" className="text-xs h-7 px-2.5" onClick={() => setMarkPaidId(payment.id)}>
                            Mark Paid
                          </Button>
                        )}
                        {payment.status === 'paid' && (
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 gap-1" onClick={() => generateReceipt(payment)}>
                            <Download className="w-3 h-3" /> Receipt
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">{search ? 'No payments found' : 'No payment records yet'}</p>
            <p className="text-gray-400 text-sm mt-1">Add tenants to automatically generate payment records</p>
          </div>
        )}
      </div>

      {markPaidId && (
        <MarkPaidModal
          onClose={() => setMarkPaidId(null)}
          onConfirm={handleMarkPaid}
        />
      )}
    </>
  )
}
