'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search, Building2, MapPin, Users, IndianRupee, Edit, Trash2, MoreVertical, Home } from 'lucide-react'
import PropertyModal from './PropertyModal'
import { deleteProperty } from '@/lib/actions/properties'
import { toast } from 'sonner'
import type { Property } from '@/types'
import ConfirmDialog from '@/components/ui/confirm-dialog'

interface Props { initialProperties: Property[] }

export default function PropertiesClient({ initialProperties }: Props) {
  const [properties, setProperties] = useState(initialProperties)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editProperty, setEditProperty] = useState<Property | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = properties.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteProperty(deleteId)
      if (result.error) { toast.error(result.error); return }
      setProperties(prev => prev.filter(p => p.id !== deleteId))
      toast.success('Property deleted')
      setDeleteId(null)
    })
  }

  const handleSaved = (property: Property, isEdit: boolean) => {
    if (isEdit) {
      setProperties(prev => prev.map(p => p.id === property.id ? property : p))
    } else {
      setProperties(prev => [property, ...prev])
    }
    setShowModal(false)
    setEditProperty(null)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Properties</h2>
          <p className="text-sm text-gray-500 mt-0.5">{properties.length} properties · {properties.reduce((s, p) => s + p.units, 0)} total units</p>
        </div>
        <Button onClick={() => { setEditProperty(null); setShowModal(true) }} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Property
        </Button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search properties..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Properties', value: properties.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Units', value: properties.reduce((s, p) => s + p.units, 0), icon: Home, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Occupied', value: properties.reduce((s, p) => s + p.occupied_units, 0), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Monthly Income', value: formatCurrency(properties.reduce((s, p) => s + p.monthly_rent * p.occupied_units, 0)), icon: IndianRupee, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((property) => {
          const occupancyRate = property.units > 0 ? Math.round((property.occupied_units / property.units) * 100) : 0
          return (
            <div key={property.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group">
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {property.image_url ? (
                  <img src={property.image_url} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <Building2 className="w-12 h-12 text-blue-300" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant={property.status === 'active' ? 'success' : 'secondary'} className="capitalize">{property.status}</Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="capitalize bg-white/90 text-gray-700">{property.type}</Badge>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-base">{property.name}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditProperty(property); setShowModal(true) }} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(property.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{property.address}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Units</p>
                    <p className="text-sm font-bold text-gray-900">{property.units}</p>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 rounded-lg">
                    <p className="text-xs text-emerald-600">Occupied</p>
                    <p className="text-sm font-bold text-emerald-700">{property.occupied_units}</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-600">Vacant</p>
                    <p className="text-sm font-bold text-orange-700">{property.units - property.occupied_units}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Occupancy</span>
                    <span className="font-medium text-gray-700">{occupancyRate}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${occupancyRate}%` }} />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Monthly Rent</p>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(property.monthly_rent)}/unit</p>
                </div>
              </div>
            </div>
          )
        })}

        {/* Add card */}
        <button
          onClick={() => { setEditProperty(null); setShowModal(true) }}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 group-hover:text-blue-700">Add New Property</p>
            <p className="text-xs text-gray-400 mt-0.5">Click to add a property</p>
          </div>
        </button>
      </div>

      {filtered.length === 0 && search && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 mt-4">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No properties found</p>
          <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {showModal && (
        <PropertyModal
          property={editProperty}
          onClose={() => { setShowModal(false); setEditProperty(null) }}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Property"
        description="This will permanently delete the property and all associated data. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isPending}
      />
    </>
  )
}
