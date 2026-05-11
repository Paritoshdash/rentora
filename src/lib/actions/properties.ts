'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { propertySchema } from '@/lib/validations'
import type { Property } from '@/types'

export async function getProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getProperties error:', error)
    return []
  }
  return data ?? []
}

export async function getProperty(id: string): Promise<Property | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return data
}

export async function createProperty(formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = propertySchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data, error } = await supabase
    .from('properties')
    .insert({ ...parsed.data, user_id: user.id, occupied_units: 0 })
    .select()
    .single()

  if (error) return { error: error.message }

  await logActivity(supabase, user.id, 'Property added', `${parsed.data.name} was added`, 'property')
  revalidatePath('/dashboard/properties')
  revalidatePath('/dashboard')
  return { data }
}

export async function updateProperty(id: string, formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = propertySchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data, error } = await supabase
    .from('properties')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  await logActivity(supabase, user.id, 'Property updated', `${parsed.data.name} was updated`, 'property')
  revalidatePath('/dashboard/properties')
  revalidatePath('/dashboard')
  return { data }
}

export async function deleteProperty(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Get property name before deleting
  const { data: prop } = await supabase.from('properties').select('name').eq('id', id).single()

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  if (prop) await logActivity(supabase, user.id, 'Property deleted', `${prop.name} was removed`, 'property')
  revalidatePath('/dashboard/properties')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updatePropertyImage(id: string, imageUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('properties')
    .update({ image_url: imageUrl })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/properties')
  return { success: true }
}

// Internal helper — not exported as action
async function logActivity(supabase: any, userId: string, action: string, detail: string, type: string) {
  await supabase.from('activity_logs').insert({ user_id: userId, action, detail, type })
}

