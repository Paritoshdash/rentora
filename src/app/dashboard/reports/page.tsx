import DashboardLayout from '@/components/layout/DashboardLayout'
import { getDashboardStats, getMonthlyChartData, getNotifications } from '@/lib/actions/dashboard'
import { getPayments } from '@/lib/actions/payments'
import { getExpenses } from '@/lib/actions/expenses'
import ReportsClient from '@/components/reports/ReportsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Reports' }

export default async function ReportsPage() {
  const [stats, chartData, payments, expenses, notifications] = await Promise.all([
    getDashboardStats(),
    getMonthlyChartData(),
    getPayments(),
    getExpenses(),
    getNotifications(),
  ])
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout title="Reports & Analytics" unreadCount={unreadCount}>
      <ReportsClient stats={stats} chartData={chartData} payments={payments} expenses={expenses} />
    </DashboardLayout>
  )
}
