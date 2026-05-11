'use client'

import StatCard from './StatCard'
import IncomeChart from './IncomeChart'
import OccupancyChart from './OccupancyChart'
import RecentActivity from './RecentActivity'
import PaymentStatusList from './PaymentStatusList'
import { Building2, Users, IndianRupee, CheckCircle2, Clock, AlertCircle, Home, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { DashboardStats, MonthlyChartData, ActivityLog, Payment } from '@/types'

interface Props {
  stats: DashboardStats
  chartData: MonthlyChartData[]
  activity: ActivityLog[]
  recentPayments: Payment[]
  profile: any
}

export default function DashboardClient({ stats, chartData, activity, recentPayments, profile }: Props) {
  const greeting = getGreeting()
  const name = profile?.full_name?.split(' ')[0] ?? 'there'
  const currentMonth = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{greeting}, {name}! 👋</h2>
            <p className="text-blue-100 text-sm mt-0.5">Here&apos;s your property overview for {currentMonth}</p>
          </div>
          {stats.totalProperties > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.occupancyRate}% occupancy</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard title="Total Properties" value={String(stats.totalProperties)} subtitle={`${stats.totalUnits} total units`} icon={Building2} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Active Tenants" value={String(stats.totalTenants)} subtitle="Active leases" icon={Users} iconColor="text-purple-600" iconBg="bg-purple-50" />
        <StatCard title="Expected Income" value={formatCurrency(stats.monthlyExpectedIncome)} subtitle={currentMonth} icon={IndianRupee} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <StatCard title="Collected Rent" value={formatCurrency(stats.collectedRent)} subtitle={`${currentMonth}`} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Pending Rent" value={formatCurrency(stats.pendingRent)} subtitle="Awaiting payment" icon={Clock} iconColor="text-yellow-600" iconBg="bg-yellow-50" />
        <StatCard title="Overdue Rent" value={formatCurrency(stats.overdueRent)} subtitle="Incl. late fees" icon={AlertCircle} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Occupancy Rate" value={`${stats.occupancyRate}%`} subtitle={`${stats.occupiedUnits} of ${stats.totalUnits} units`} icon={Home} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Net Profit" value={formatCurrency(stats.netProfit)} subtitle={`After ${formatCurrency(stats.totalExpenses)} expenses`} icon={TrendingUp} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <IncomeChart data={chartData} />
        </div>
        <OccupancyChart occupied={stats.occupiedUnits} vacant={stats.totalUnits - stats.occupiedUnits} />
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PaymentStatusList payments={recentPayments} />
        <RecentActivity logs={activity} />
      </div>
    </>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
