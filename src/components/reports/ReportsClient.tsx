'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Download, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react'
import { generateMonthlyReport } from '@/lib/pdf-generator'
import type { DashboardStats, MonthlyChartData, Payment, Expense } from '@/types'

const EXPENSE_COLORS = ['#f59e0b', '#8b5cf6', '#f97316', '#3b82f6', '#6b7280']

interface Props {
  stats: DashboardStats
  chartData: MonthlyChartData[]
  payments: Payment[]
  expenses: Expense[]
}

export default function ReportsClient({ stats, chartData, payments, expenses }: Props) {
  const expenseByCategory = Object.entries(
    expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc }, {} as Record<string, number>)
  ).map(([name, value], i) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, color: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }))

  const paidCount = payments.filter(p => p.status === 'paid').length
  const pendingCount = payments.filter(p => p.status === 'pending').length
  const overdueCount = payments.filter(p => p.status === 'overdue').length

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Financial overview and insights</p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0" onClick={() => generateMonthlyReport(payments, new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }))}>
          <Download className="w-4 h-4" /> Download Report
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-xl font-bold text-emerald-700">{formatCurrency(stats.collectedRent)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 shadow-sm text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-100">Net Profit</p>
              <p className="text-xl font-bold">{formatCurrency(stats.netProfit)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Monthly Income vs Expenses</h3>
          <p className="text-sm text-gray-500 mb-4">Last 6 months</p>
          {chartData.every(d => d.income === 0 && d.expenses === 0) ? (
            <div className="h-60 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Expense Breakdown</h3>
          <p className="text-sm text-gray-500 mb-4">By category</p>
          {expenseByCategory.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-gray-400 text-sm">No expenses recorded</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {expenseByCategory.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {expenseByCategory.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Payment Status Summary</h3>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => generateMonthlyReport(payments, new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }))}>
            <Download className="w-3.5 h-3.5" /> PDF
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Total', count: payments.length, color: 'text-gray-700', bg: 'bg-gray-50' },
            { label: 'Paid', count: paidCount, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Pending', count: pendingCount, color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Overdue', count: overdueCount, color: 'text-red-700', bg: 'bg-red-50' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-lg p-3 text-center ${stat.bg}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
        {payments.length > 0 && (
          <>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(paidCount / payments.length) * 100}%` }} />
              <div className="bg-yellow-400 h-full transition-all" style={{ width: `${(pendingCount / payments.length) * 100}%` }} />
              <div className="bg-red-500 h-full transition-all" style={{ width: `${(overdueCount / payments.length) * 100}%` }} />
            </div>
            <div className="flex gap-4 mt-2">
              {[{ label: `Paid ${Math.round((paidCount / payments.length) * 100)}%`, color: 'bg-emerald-500' }, { label: `Pending ${Math.round((pendingCount / payments.length) * 100)}%`, color: 'bg-yellow-400' }, { label: `Overdue ${Math.round((overdueCount / payments.length) * 100)}%`, color: 'bg-red-500' }].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
