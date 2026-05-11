'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { tenantSchema } from '@/lib/validations'
import type { Tenant } from '@/types'

export async function getTenants(propertyId?: string): Promise<Tenant[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('tenants')
    .select('*, properties(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (propertyId) query = query.eq('property_id', propertyId)

  const { data, error } = await query
  if (error) {
    console.error('getTenants error:', error)
    return []
  }

  return (data ?? []).map((t: any) => ({
    ...t,
    property_name: t.properties?.name ?? '',
  }))
}

export async function getTenant(id: string): Promise<Tenant | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('tenants')
    .select('*, properties(name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return { ...data, property_name: data.properties?.name ?? '' }
}

export async function createTenant(formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = tenantSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const { data, error } = await supabase
    .from('tenants')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  // Update occupied_units on the property
  await supabase.rpc('increment_occupied_units', { property_id: parsed.data.property_id })

  // Create first month payment record
  const today = new Date()
  const month = today.toLocaleString('en-IN', { month: 'long', year: 'numeric' })
  const dueDate = new Date(today.getFullYear(), today.getMonth(), parsed.data.due_date)

  const { data: prop } = await supabase
    .from('properties')
    .select('name')
    .eq('id', parsed.data.property_id)
    .single()

  await supabase.from('payments').insert({
    user_id: user.id,
    tenant_id: data.id,
    tenant_name: parsed.data.name,
    property_name: prop?.name ?? '',
    unit: parsed.data.unit,
    amount: parsed.data.rent_amount,
    due_date: dueDate.toISOString().split('T')[0],
    status: 'pending',
    late_fee: 0,
    month,
  })

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Tenant added',
    detail: `${parsed.data.name} added to unit ${parsed.data.unit}`,
    type: 'tenant',
  })

  // Create welcome notification
  await supabase.from('notifications').insert({
    user_id: user.id,
    type: 'general',
    title: 'New Tenant Added',
    message: `${parsed.data.name} has been added to unit ${parsed.data.unit}`,
    read: false,
  })

  revalidatePath('/dashboard/tenants')
  revalidatePath('/dashboard')
  return { data }
}

export async function updateTenant(id: string, formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = tenantSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const { data, error } = await supabase
    .from('tenants')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Tenant updated',
    detail: `${parsed.data.name}'s details were updated`,
    type: 'tenant',
  })

  revalidatePath('/dashboard/tenants')
  revalidatePath('/dashboard')
  return { data }
}

export async function deleteTenant(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, property_id, unit')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  if (tenant?.property_id) {
    await supabase.rpc('decrement_occupied_units', { property_id: tenant.property_id })
  }

  if (tenant) {
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'Tenant removed',
      detail: `${tenant.name} was removed from unit ${tenant.unit}`,
      type: 'tenant',
    })
  }

  revalidatePath('/dashboard/tenants')
  revalidatePath('/dashboard')
  return { success: true }
}
