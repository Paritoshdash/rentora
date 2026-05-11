import DashboardLayout from '@/components/layout/DashboardLayout'
import { getDashboardStats, getMonthlyChartData, getRecentActivity, getNotifications } from '@/lib/actions/dashboard'
import { getPayments } from '@/lib/actions/payments'
import { getProfile } from '@/lib/actions/auth'
import DashboardClient from '@/components/dashboard/DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stats, chartData, activity, payments, profile, notifications] = await Promise.all([
    getDashboardStats(),
    getMonthlyChartData(),
    getRecentActivity(6),
    getPayments(),
    getProfile(),
    getNotifications(),
  ])

  const unreadCount = notifications.filter(n => !n.read).length
  const recentPayments = payments.slice(0, 6)

  return (
    <DashboardLayout title="Dashboard" unreadCount={unreadCount}>
      <DashboardClient
        stats={stats}
        chartData={chartData}
        activity={activity}
        recentPayments={recentPayments}
        profile={profile}
      />
    </DashboardLayout>
  )
}
