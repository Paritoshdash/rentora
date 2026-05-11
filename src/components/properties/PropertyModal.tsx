'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema, type PropertyFormData } from '@/lib/validations'
import { createProperty, updateProperty } from '@/lib/actions/properties'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Property } from '@/types'

interface Props {
  property?: Property | null
  onClose: () => void
  onSaved: (property: Property, isEdit: boolean) => void
}

export default function PropertyModal({ property, onClose, onSaved }: Props) {
  const isEdit = !!property

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: property?.name ?? '',
      address: property?.address ?? '',
      type: property?.type ?? undefined,
      units: property?.units ?? 1,
      monthly_rent: property?.monthly_rent ?? 0,
      status: property?.status ?? 'active',
    },
  })

  const onSubmit = async (data: PropertyFormData) => {
    const result = isEdit
      ? await updateProperty(property!.id, data)
      : await createProperty(data)

    if (result.error) { toast.error(result.error); return }
    toast.success(isEdit ? 'Property updated' : 'Property added')
    onSaved(result.data as Property, isEdit)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Property' : 'Add New Property'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Property Name *</Label>
            <Input placeholder="e.g. Sunrise Apartments" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Full Address *</Label>
            <Textarea placeholder="Street, City, State, PIN" rows={2} {...register('address')} />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Property Type *</Label>
              <Select defaultValue={property?.type} onValueChange={v => setValue('type', v as any)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {['apartment', 'villa', 'flat', 'house', 'commercial'].map(t => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Number of Units *</Label>
              <Input type="number" min={1} placeholder="e.g. 8" {...register('units')} />
              {errors.units && <p className="text-xs text-red-500">{errors.units.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Monthly Rent per Unit (₹) *</Label>
            <Input type="number" min={0} placeholder="e.g. 18000" {...register('monthly_rent')} />
            {errors.monthly_rent && <p className="text-xs text-red-500">{errors.monthly_rent.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select defaultValue={property?.status ?? 'active'} onValueChange={v => setValue('status', v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : isEdit ? 'Save Changes' : 'Add Property'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
