'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/validations'
import { updateProfile, updatePassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch-ui'
import { User, Bell, Shield, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { z } from 'zod'

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

interface Props { profile: any }

export default function SettingsClient({ profile }: Props) {
  const [notifPrefs, setNotifPrefs] = useState({ rentDue: true, rentOverdue: true, agreementExpiry: true, paymentReceived: true, email: true })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: profile?.full_name ?? '', phone: profile?.phone ?? '', address: profile?.address ?? '' },
  })

  const pwForm = useForm({ resolver: zodResolver(passwordSchema) })

  const onProfileSubmit = async (data: ProfileFormData) => {
    const result = await updateProfile(data)
    if (result.error) { toast.error(result.error); return }
    toast.success('Profile updated')
  }

  const onPasswordSubmit = async (data: any) => {
    const result = await updatePassword(data.newPassword)
    if (result.error) { toast.error(result.error); return }
    toast.success('Password updated')
    pwForm.reset()
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="bg-white border border-gray-100 shadow-sm p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><User className="w-3.5 h-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Bell className="w-3.5 h-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"><Shield className="w-3.5 h-3.5" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Profile Information</h3>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{profile?.full_name ?? 'User'}</p>
                <p className="text-xs text-gray-500">{profile?.email ?? ''}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input {...register('full_name')} />
                  {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input {...register('phone')} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Address</Label>
                  <Input {...register('address')} />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Changes</>}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: 'rentDue', label: 'Rent Due Reminders', desc: 'Get notified 3 days before rent is due' },
                { key: 'rentOverdue', label: 'Overdue Rent Alerts', desc: 'Alert when rent is past due date' },
                { key: 'agreementExpiry', label: 'Agreement Expiry', desc: 'Notify 30 days before agreement ends' },
                { key: 'paymentReceived', label: 'Payment Received', desc: 'Confirm when payment is recorded' },
                { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifPrefs[item.key as keyof typeof notifPrefs]}
                    onCheckedChange={v => setNotifPrefs(p => ({ ...p, [item.key]: v }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button className="gap-2" onClick={() => toast.success('Preferences saved')}>
                <Save className="w-4 h-4" /> Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Change Password</h3>
            <form onSubmit={pwForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-sm">
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" placeholder="Min. 8 characters" {...pwForm.register('newPassword')} />
                {pwForm.formState.errors.newPassword && <p className="text-xs text-red-500">{pwForm.formState.errors.newPassword.message as string}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Repeat password" {...pwForm.register('confirmPassword')} />
                {pwForm.formState.errors.confirmPassword && <p className="text-xs text-red-500">{pwForm.formState.errors.confirmPassword.message as string}</p>}
              </div>
              <Button type="submit" className="gap-2" disabled={pwForm.formState.isSubmitting}>
                {pwForm.formState.isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</> : <><Shield className="w-4 h-4" />Update Password</>}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
