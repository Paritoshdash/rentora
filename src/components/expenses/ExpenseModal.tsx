'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { expenseSchema, type ExpenseFormData } from '@/lib/validations'
import { createExpense, updateExpense } from '@/lib/actions/expenses'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Expense, Property } from '@/types'

interface Props {
  expense?: Expense | null
  properties: Property[]
  onClose: () => void
  onSaved: (expense: Expense, isEdit: boolean) => void
}

export default function ExpenseModal({ expense, properties, onClose, onSaved }: Props) {
  const isEdit = !!expense

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      property_id: expense?.property_id ?? '',
      category: expense?.category ?? undefined,
      description: expense?.description ?? '',
      amount: expense?.amount ?? 0,
      date: expense?.date ?? new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: ExpenseFormData) => {
    const result = isEdit ? await updateExpense(expense!.id, data) : await createExpense(data)
    if (result.error) { toast.error(result.error); return }
    toast.success(isEdit ? 'Expense updated' : 'Expense added')
    onSaved(result.data as Expense, isEdit)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{isEdit ? 'Edit Expense' : 'Add Expense'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Property *</Label>
            <Select defaultValue={expense?.property_id ?? ''} onValueChange={v => setValue('property_id', v)}>
              <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
              <SelectContent>{properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
            {errors.property_id && <p className="text-xs text-red-500">{errors.property_id.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select defaultValue={expense?.category ?? ''} onValueChange={v => setValue('category', v as any)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {['electricity', 'water', 'repairs', 'maintenance', 'other'].map(c => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Description *</Label>
            <Textarea placeholder="Describe the expense..." rows={2} {...register('description')} />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Amount (₹) *</Label>
              <Input type="number" min={0} placeholder="e.g. 5000" {...register('amount')} />
              {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Date *</Label>
              <Input type="date" {...register('date')} />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : isEdit ? 'Save Changes' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
