'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Bell, AlertCircle, Clock, FileText, CheckCircle2, CheckCheck, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { markNotificationRead, markAllNotificationsRead, deleteNotification } from '@/lib/actions/dashboard'
import { toast } from 'sonner'
import type { Notification } from '@/types'

const typeConfig: Record<string, { icon: any; color: string; bg: string; variant: any }> = {
  overdue: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', variant: 'destructive' },
  due_soon: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', variant: 'warning' },
  agreement_expiry: { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', variant: 'info' },
  payment: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', variant: 'success' },
  general: { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50', variant: 'info' },
}

interface Props { initialNotifications: Notification[] }

export default function NotificationsClient({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState('all')
  const [isPending, startTransition] = useTransition()

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      await markNotificationRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    })
  }

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    })
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="gap-2 shrink-0" onClick={handleMarkAllRead} disabled={isPending}>
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </Button>
        )}
      </div>

      <div className="flex gap-2 mb-5">
        {['all', 'unread', 'read'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn('px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize', filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}
          >
            {f}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((notification) => {
          const config = typeConfig[notification.type] ?? typeConfig.general
          const Icon = config.icon
          return (
            <div key={notification.id} className={cn('bg-white rounded-xl border p-4 shadow-sm transition-all', notification.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30')}>
              <div className="flex items-start gap-3">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                        <Badge variant={config.variant} className="text-xs capitalize">{notification.type.replace('_', ' ')}</Badge>
                        {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(notification.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!notification.read && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600" onClick={() => handleMarkRead(notification.id)}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" onClick={() => handleDelete(notification.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications</p>
            <p className="text-gray-400 text-sm mt-1">You&apos;re all caught up!</p>
          </div>
        )}
      </div>
    </>
  )
}
