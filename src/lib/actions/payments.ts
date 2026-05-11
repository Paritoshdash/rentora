'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Payment } from '@/types'

export async function getPayments(filters?: {
  status?: string
  month?: string
  tenantId?: string
}): Promise<Payment[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('due_date', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.month) query = query.eq('month', filters.month)
  if (filters?.tenantId) query = query.eq('tenant_id', filters.tenantId)

  const { data, error } = await query
  if (error) {
    console.error('getPayments error:', error)
    return []
  }
  return data ?? []
}

export async function markPaymentPaid(
  id: string,
  paymentMethod: string,
  paidDate: string,
  lateFee = 0
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('payments')
    .update({
      status: 'paid',
      paid_date: paidDate,
      payment_method: paymentMethod,
      late_fee: lateFee,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Payment received',
    detail: `${data.tenant_name} paid ₹${data.amount.toLocaleString('en-IN')} for ${data.month}`,
    type: 'payment',
  })

  await supabase.from('notifications').insert({
    user_id: user.id,
    type: 'payment',
    title: 'Payment Received',
    message: `${data.tenant_name} paid ₹${data.amount.toLocaleString('en-IN')} for ${data.month}`,
    read: false,
  })

  revalidatePath('/dashboard/rent')
  revalidatePath('/dashboard')
  return { data }
}

export async function updatePaymentStatus(id: string, status: string, notes?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('payments')
    .update({ status, notes })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard/rent')
  revalidatePath('/dashboard')
  return { data }
}

export async function createPayment(formData: {
  tenant_id: string
  amount: number
  due_date: string
  month: string
  status: string
  late_fee?: number
  notes?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Get tenant details
  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, unit, property_id, properties(name)')
    .eq('id', formData.tenant_id)
    .single()

  if (!tenant) return { error: 'Tenant not found' }

  const { data, error } = await supabase
    .from('payments')
    .insert({
      ...formData,
      user_id: user.id,
      tenant_name: tenant.name,
      property_name: (tenant.properties as any)?.name ?? '',
      unit: tenant.unit,
      late_fee: formData.late_fee ?? 0,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard/rent')
  revalidatePath('/dashboard')
  return { data }
}

export async function deletePayment(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/rent')
  return { success: true }
}

/** Auto-detect and mark overdue payments */
export async function syncOverduePayments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const today = new Date().toISOString().split('T')[0]

  const { data: overduePayments } = await supabase
    .from('payments')
    .select('id, tenant_name, unit, amount, month')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .lt('due_date', today)

  if (!overduePayments?.length) return

  for (const p of overduePayments) {
    await supabase
      .from('payments')
      .update({ status: 'overdue' })
      .eq('id', p.id)

    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'overdue',
      title: 'Rent Overdue',
      message: `${p.tenant_name} (${p.unit}) rent of ₹${p.amount.toLocaleString('en-IN')} for ${p.month} is overdue`,
      read: false,
    })
  }

  revalidatePath('/dashboard/rent')
  revalidatePath('/dashboard/notifications')
}
