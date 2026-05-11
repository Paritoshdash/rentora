'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Search, Zap, Droplets, Wrench, Settings, MoreHorizontal, Receipt, TrendingDown, Edit, Trash2 } from 'lucide-react'
import ExpenseModal from './ExpenseModal'
import { deleteExpense } from '@/lib/actions/expenses'
import { toast } from 'sonner'
import type { Expense, Property } from '@/types'
import ConfirmDialog from '@/components/ui/confirm-dialog'

const categoryConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  electricity: { label: 'Electricity', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  water: { label: 'Water', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
  repairs: { label: 'Repairs', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50' },
  maintenance: { label: 'Maintenance', icon: Settings, color: 'text-purple-600', bg: 'bg-purple-50' },
  other: { label: 'Other', icon: MoreHorizontal, color: 'text-gray-600', bg: 'bg-gray-50' },
}

interface Props { initialExpenses: Expense[]; properties: Property[] }

export default function ExpensesClient({ initialExpenses, properties }: Props) {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = expenses.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.property_name.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  )

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const byCategory = Object.entries(
    expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc }, {} as Record<string, number>)
  )

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteExpense(deleteId)
      if (result.error) { toast.error(result.error); return }
      setExpenses(prev => prev.filter(e => e.id !== deleteId))
      toast.success('Expense deleted')
      setDeleteId(null)
    })
  }

  const handleSaved = (expense: Expense, isEdit: boolean) => {
    if (isEdit) setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e))
    else setExpenses(prev => [expense, ...prev])
    setShowModal(false)
    setEditExpense(null)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Expense Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">{expenses.length} records</p>
        </div>
        <Button onClick={() => { setEditExpense(null); setShowModal(true) }} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Expense
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm col-span-2">
          <p className="text-sm font-semibold text-gray-700 mb-3">By Category</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {byCategory.map(([cat, amount]) => {
              const config = categoryConfig[cat] || categoryConfig.other
              const Icon = config.icon
              return (
                <div key={cat} className={`flex items-center gap-2 p-2 rounded-lg ${config.bg}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <div>
                    <p className="text-xs text-gray-500">{config.label}</p>
                    <p className="text-xs font-bold text-gray-800">{formatCurrency(amount)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Category', 'Description', 'Property', 'Date', 'Amount', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((expense) => {
                const config = categoryConfig[expense.category] || categoryConfig.other
                const Icon = config.icon
                return (
                  <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 capitalize">{config.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4"><p className="text-sm text-gray-800">{expense.description}</p></td>
                    <td className="px-5 py-4 hidden md:table-cell"><p className="text-sm text-gray-600">{expense.property_name}</p></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><p className="text-sm text-gray-600">{formatDate(expense.date)}</p></td>
                    <td className="px-5 py-4 text-right"><p className="text-sm font-bold text-gray-900">{formatCurrency(expense.amount)}</p></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => { setEditExpense(expense); setShowModal(true) }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => setDeleteId(expense.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">{search ? 'No expenses found' : 'No expenses recorded yet'}</p>
            {!search && <Button className="mt-4 gap-2" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Expense</Button>}
          </div>
        )}
      </div>

      {showModal && (
        <ExpenseModal expense={editExpense} properties={properties} onClose={() => { setShowModal(false); setEditExpense(null) }} onSaved={handleSaved} />
      )}

      <ConfirmDialog open={!!deleteId} title="Delete Expense" description="This will permanently delete this expense record." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={isPending} />
    </>
  )
}
