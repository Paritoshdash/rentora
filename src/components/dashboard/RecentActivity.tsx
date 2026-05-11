import { CreditCard, Users, Building2, Receipt, Activity } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { ActivityLog } from '@/types'
import Link from 'next/link'

const typeConfig = {
  payment: { icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  tenant: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  property: { icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
  expense: { icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50' },
}

interface Props { logs: ActivityLog[] }

export default function RecentActivity({ logs }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const config = typeConfig[log.type] ?? typeConfig.property
            const Icon = config.icon
            return (
              <div key={log.id} className="flex items-start gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{log.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{log.detail}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0 mt-0.5">
                  {formatDate(log.created_at)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
