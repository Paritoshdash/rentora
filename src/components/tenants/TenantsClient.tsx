'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Search, Users, Phone, Mail, Building2, Edit, Trash2, Eye, Filter } from 'lucide-react'
import TenantModal from './TenantModal'
import { deleteTenant } from '@/lib/actions/tenants'
import { toast } from 'sonner'
import type { Tenant, Property } from '@/types'
import ConfirmDialog from '@/components/ui/confirm-dialog'

interface Props { initialTenants: Tenant[]; properties: Property[] }

export default function TenantsClient({ initialTenants, properties }: Props) {
  const [tenants, setTenants] = useState(initialTenants)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTenant, setEditTenant] = useState<Tenant | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    (t.property_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    t.unit.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteTenant(deleteId)
      if (result.error) { toast.error(result.error); return }
      setTenants(prev => prev.filter(t => t.id !== deleteId))
      toast.success('Tenant removed')
      setDeleteId(null)
    })
  }

  const handleSaved = (tenant: Tenant, isEdit: boolean) => {
    if (isEdit) setTenants(prev => prev.map(t => t.id === tenant.id ? tenant : t))
    else setTenants(prev => [tenant, ...prev])
    setShowModal(false)
    setEditTenant(null)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tenants</h2>
          <p className="text-sm text-gray-500 mt-0.5">{tenants.filter(t => t.status === 'active').length} active tenants</p>
        </div>
        <Button onClick={() => { setEditTenant(null); setShowModal(true) }} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Tenant
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Tenant', 'Property', 'Contact', 'Rent', 'Agreement', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5 hidden-mobile"
                    style={{ display: ['Contact', 'Agreement'].includes(h) ? undefined : undefined }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tenant.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{tenant.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700">{tenant.property_name}</p>
                        <p className="text-xs text-gray-400">{tenant.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><Phone className="w-3 h-3" />{tenant.phone}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><Mail className="w-3 h-3" />{tenant.email}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(tenant.rent_amount)}</p>
                    <p className="text-xs text-gray-400">Due: {tenant.due_date}th</p>
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <p className="text-xs text-gray-600">{formatDate(tenant.move_in_date)}</p>
                    <p className="text-xs text-gray-400">to {formatDate(tenant.agreement_end)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={tenant.status === 'active' ? 'success' : 'secondary'} className="capitalize">{tenant.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => { setEditTenant(tenant); setShowModal(true) }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => setDeleteId(tenant.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">{search ? 'No tenants found' : 'No tenants yet'}</p>
            <p className="text-gray-400 text-sm mt-1">{search ? 'Try a different search' : 'Add your first tenant to get started'}</p>
            {!search && (
              <Button className="mt-4 gap-2" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4" /> Add Tenant
              </Button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <TenantModal tenant={editTenant} properties={properties} onClose={() => { setShowModal(false); setEditTenant(null) }} onSaved={handleSaved} />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Remove Tenant"
        description="This will permanently remove the tenant and all their payment records. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isPending}
        confirmLabel="Remove"
      />
    </>
  )
}
