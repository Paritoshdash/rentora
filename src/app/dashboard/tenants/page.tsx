import DashboardLayout from '@/components/layout/DashboardLayout'
import { getTenants } from '@/lib/actions/tenants'
import { getProperties } from '@/lib/actions/properties'
import { getNotifications } from '@/lib/actions/dashboard'
import TenantsClient from '@/components/tenants/TenantsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tenants' }

export default async function TenantsPage() {
  const [tenants, properties, notifications] = await Promise.all([
    getTenants(),
    getProperties(),
    getNotifications(),
  ])
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout title="Tenants" unreadCount={unreadCount}>
      <TenantsClient initialTenants={tenants} properties={properties} />
    </DashboardLayout>
  )
}
