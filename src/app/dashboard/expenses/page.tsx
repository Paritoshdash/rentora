import DashboardLayout from '@/components/layout/DashboardLayout'
import { getExpenses } from '@/lib/actions/expenses'
import { getProperties } from '@/lib/actions/properties'
import { getNotifications } from '@/lib/actions/dashboard'
import ExpensesClient from '@/components/expenses/ExpensesClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Expenses' }

export default async function ExpensesPage() {
  const [expenses, properties, notifications] = await Promise.all([
    getExpenses(),
    getProperties(),
    getNotifications(),
  ])
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout title="Expenses" unreadCount={unreadCount}>
      <ExpensesClient initialExpenses={expenses} properties={properties} />
    </DashboardLayout>
  )
}
