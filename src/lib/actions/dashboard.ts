'use server'

import { createClient } from '@/lib/supabase/server'
import type { DashboardStats, MonthlyChartData, ActivityLog, Notification } from '@/types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const empty: DashboardStats = {
    totalProperties: 0, totalUnits: 0, occupiedUnits: 0,
    totalTenants: 0, monthlyExpectedIncome: 0, collectedRent: 0,
    pendingRent: 0, overdueRent: 0, occupancyRate: 0,
    totalExpenses: 0, netProfit: 0,
  }
  if (!user) return empty

  const [propertiesRes, tenantsRes, paymentsRes, expensesRes] = await Promise.all([
    supabase.from('properties').select('units, occupied_units, monthly_rent, status').eq('user_id', user.id),
    supabase.from('tenants').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'active'),
    supabase.from('payments').select('amount, status, late_fee').eq('user_id', user.id).eq('month', getCurrentMonth()),
    supabase.from('expenses').select('amount').eq('user_id', user.id).gte('date', getMonthStart()).lte('date', getMonthEnd()),
  ])

  const properties = propertiesRes.data ?? []
  const totalProperties = properties.filter(p => p.status === 'active').length
  const totalUnits = properties.reduce((s, p) => s + (p.units ?? 0), 0)
  const occupiedUnits = properties.reduce((s, p) => s + (p.occupied_units ?? 0), 0)
  const monthlyExpectedIncome = properties.reduce((s, p) => s + (p.monthly_rent ?? 0) * (p.occupied_units ?? 0), 0)

  const payments = paymentsRes.data ?? []
  const collectedRent = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const pendingRent = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const overdueRent = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount + (p.late_fee ?? 0), 0)

  const totalExpenses = (expensesRes.data ?? []).reduce((s, e) => s + e.amount, 0)
  const netProfit = collectedRent - totalExpenses
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

  return {
    totalProperties,
    totalUnits,
    occupiedUnits,
    totalTenants: tenantsRes.count ?? 0,
    monthlyExpectedIncome,
    collectedRent,
    pendingRent,
    overdueRent,
    occupancyRate,
    totalExpenses,
    netProfit,
  }
}

export async function getMonthlyChartData(): Promise<MonthlyChartData[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const months: MonthlyChartData[] = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthLabel = d.toLocaleString('en-IN', { month: 'short' })
    const monthStr = d.toLocaleString('en-IN', { month: 'long', year: 'numeric' })
    const start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0]

    const [paymentsRes, expensesRes] = await Promise.all([
      supabase.from('payments').select('amount').eq('user_id', user.id).eq('status', 'paid').eq('month', monthStr),
      supabase.from('expenses').select('amount').eq('user_id', user.id).gte('date', start).lte('date', end),
    ])

    const income = (paymentsRes.data ?? []).reduce((s, p) => s + p.amount, 0)
    const expenses = (expensesRes.data ?? []).reduce((s, e) => s + e.amount, 0)
    months.push({ month: monthLabel, income, expenses })
  }

  return months
}

export async function getRecentActivity(limit = 8): Promise<ActivityLog[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}

export async function getNotifications(unreadOnly = false): Promise<Notification[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (unreadOnly) query = query.eq('read', false)

  const { data } = await query
  return data ?? []
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('notifications').update({ read: true }).eq('id', id).eq('user_id', user.id)
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
}

export async function deleteNotification(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('notifications').delete().eq('id', id).eq('user_id', user.id)
}

// ── helpers ──────────────────────────────────────────────────────────────────
function getCurrentMonth() {
  return new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })
}
function getMonthStart() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
}
function getMonthEnd() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0]
}

