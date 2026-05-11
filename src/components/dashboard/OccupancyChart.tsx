'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface Props { occupied: number; vacant: number }

export default function OccupancyChart({ occupied, vacant }: Props) {
  const total = occupied + vacant
  const rate = total > 0 ? Math.round((occupied / total) * 100) : 0
  const data = [
    { name: 'Occupied', value: occupied, color: '#3b82f6' },
    { name: 'Vacant', value: vacant, color: '#e2e8f0' },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Occupancy Rate</h3>
        <p className="text-sm text-gray-500 mt-0.5">Across all properties</p>
      </div>

      {total === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm text-center">
          Add properties to see occupancy
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {data.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} units`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl font-bold text-gray-900">{rate}%</p>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value} units</span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Units</span>
                <span className="text-sm font-bold text-gray-900">{total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
