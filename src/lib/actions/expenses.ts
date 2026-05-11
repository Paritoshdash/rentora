'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { expenseSchema } from '@/lib/validations'
import type { Expense } from '@/types'

export async function getExpenses(propertyId?: string): Promise<Expense[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (propertyId) query = query.eq('property_id', propertyId)

  const { data, error } = await query
  if (error) {
    console.error('getExpenses error:', error)
    return []
  }
  return data ?? []
}

export async function createExpense(formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = expenseSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  // Get property name
  const { data: prop } = await supabase
    .from('properties')
    .select('name')
    .eq('id', parsed.data.property_id)
    .single()

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      ...parsed.data,
      user_id: user.id,
      property_name: prop?.name ?? '',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Expense recorded',
    detail: `${parsed.data.description} — ₹${parsed.data.amount.toLocaleString('en-IN')} for ${prop?.name}`,
    type: 'expense',
  })

  revalidatePath('/dashboard/expenses')
  revalidatePath('/dashboard')
  return { data }
}

export async function updateExpense(id: string, formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = expenseSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data: prop } = await supabase
    .from('properties')
    .select('name')
    .eq('id', parsed.data.property_id)
    .single()

  const { data, error } = await supabase
    .from('expenses')
    .update({ ...parsed.data, property_name: prop?.name ?? '' })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard/expenses')
  revalidatePath('/dashboard')
  return { data }
}

export async function deleteExpense(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/expenses')
  revalidatePath('/dashboard')
  return { success: true }
}

