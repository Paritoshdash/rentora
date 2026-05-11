'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tenantSchema, type TenantFormData } from '@/lib/validations'
import { createTenant, updateTenant } from '@/lib/actions/tenants'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Tenant, Property } from '@/types'

interface Props {
  tenant?: Tenant | null
  properties: Property[]
  onClose: () => void
  onSaved: (tenant: Tenant, isEdit: boolean) => void
}

export default function TenantModal({ tenant, properties, onClose, onSaved }: Props) {
  const isEdit = !!tenant

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: tenant?.name ?? '',
      email: tenant?.email ?? '',
      phone: tenant?.phone ?? '',
      property_id: tenant?.property_id ?? '',
      unit: tenant?.unit ?? '',
      rent_amount: tenant?.rent_amount ?? 0,
      deposit: tenant?.deposit ?? 0,
      move_in_date: tenant?.move_in_date ?? '',
      agreement_end: tenant?.agreement_end ?? '',
      due_date: tenant?.due_date ?? 1,
      notes: tenant?.notes ?? '',
    },
  })

  const onSubmit = async (data: TenantFormData) => {
    const result = isEdit
      ? await updateTenant(tenant!.id, data)
      : await createTenant(data)

    if (result.error) { toast.error(result.error); return }
    toast.success(isEdit ? 'Tenant updated' : 'Tenant added')
    onSaved(result.data as Tenant, isEdit)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="rental">Rental Details</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input placeholder="e.g. Rajesh Kumar" {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Email Address *</Label>
                  <Input type="email" placeholder="email@example.com" {...register('email')} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number *</Label>
                  <Input placeholder="+91 98765 43210" {...register('phone')} />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea placeholder="Any notes about this tenant..." rows={3} {...register('notes')} />
              </div>
            </TabsContent>

            <TabsContent value="rental" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Property *</Label>
                  <Select defaultValue={tenant?.property_id ?? ''} onValueChange={v => setValue('property_id', v)}>
                    <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                    <SelectContent>
                      {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.property_id && <p className="text-xs text-red-500">{errors.property_id.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Unit/Room Number *</Label>
                  <Input placeholder="e.g. A-101" {...register('unit')} />
                  {errors.unit && <p className="text-xs text-red-500">{errors.unit.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Monthly Rent (₹) *</Label>
                  <Input type="number" min={0} placeholder="e.g. 18000" {...register('rent_amount', { valueAsNumber: true })} />
                  {errors.rent_amount && <p className="text-xs text-red-500">{errors.rent_amount.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Security Deposit (₹) *</Label>
                  <Input type="number" min={0} placeholder="e.g. 36000" {...register('deposit', { valueAsNumber: true })} />
                  {errors.deposit && <p className="text-xs text-red-500">{errors.deposit.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Move-in Date *</Label>
                  <Input type="date" {...register('move_in_date')} />
                  {errors.move_in_date && <p className="text-xs text-red-500">{errors.move_in_date.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Agreement End Date *</Label>
                  <Input type="date" {...register('agreement_end')} />
                  {errors.agreement_end && <p className="text-xs text-red-500">{errors.agreement_end.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Rent Due Day (of month) *</Label>
                <Select defaultValue={String(tenant?.due_date ?? 1)} onValueChange={v => setValue('due_date', Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 5, 10, 15, 20, 25].map(d => (
                      <SelectItem key={d} value={String(d)}>{d}th of every month</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 pt-4 mt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : isEdit ? 'Save Changes' : 'Add Tenant'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
