'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Payment, Tenant } from '@/types'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

interface CalendarEvent { type: string; label: string; color: string }

interface Props { payments: Payment[]; tenants: Tenant[] }

export default function CalendarClient({ payments, tenants }: Props) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) } else setCurrentMonth(m => m - 1) }
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) } else setCurrentMonth(m => m + 1) }

  // Build event map
  const eventMap: Record<number, CalendarEvent[]> = {}

  const addEvent = (dateStr: string, event: CalendarEvent) => {
    const d = new Date(dateStr)
    if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
      const day = d.getDate()
      if (!eventMap[day]) eventMap[day] = []
      eventMap[day].push(event)
    }
  }

  payments.forEach(p => {
    addEvent(p.due_date, {
      type: 'due',
      label: `${p.tenant_name} — Rent Due`,
      color: p.status === 'overdue' ? 'bg-red-500' : p.status === 'paid' ? 'bg-emerald-500' : 'bg-yellow-500',
    })
    if (p.paid_date) {
      addEvent(p.paid_date, { type: 'paid', label: `${p.tenant_name} — Paid`, color: 'bg-emerald-500' })
    }
  })

  tenants.forEach(t => {
    addEvent(t.agreement_end, { type: 'agreement', label: `${t.name} — Agreement Ends`, color: 'bg-purple-500' })
  })

  const selectedEvents = selectedDay ? (eventMap[selectedDay] ?? []) : []

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Calendar</h2>
          <p className="text-sm text-gray-500 mt-0.5">Rent due dates, payments & agreements</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {[{ color: 'bg-yellow-500', label: 'Due' }, { color: 'bg-emerald-500', label: 'Paid' }, { color: 'bg-red-500', label: 'Overdue' }, { color: 'bg-purple-500', label: 'Agreement' }].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
            <h3 className="text-base font-semibold text-gray-900">{MONTHS[currentMonth]} {currentYear}</h3>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
              const isSelected = day === selectedDay
              const events = eventMap[day] ?? []
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-lg text-sm transition-all',
                    isSelected ? 'bg-blue-600 text-white' : isToday ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700',
                  )}
                >
                  <span className="text-xs font-medium">{day}</span>
                  {events.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {events.slice(0, 3).map((e, idx) => (
                        <div key={idx} className={cn('w-1.5 h-1.5 rounded-full', e.color, isSelected && 'bg-white/80')} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Events Panel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {selectedDay ? `${MONTHS[currentMonth]} ${selectedDay}` : 'Select a date'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{selectedEvents.length > 0 ? `${selectedEvents.length} event(s)` : 'No events'}</p>

          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className={cn('w-2.5 h-2.5 rounded-full mt-1 shrink-0', event.color)} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{event.label}</p>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">{event.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No events on this day</p>
            </div>
          )}

          {/* Upcoming */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Upcoming This Month</h4>
            {Object.keys(eventMap).length === 0 ? (
              <p className="text-xs text-gray-400">No events this month</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(eventMap)
                  .filter(([day]) => parseInt(day) >= today.getDate())
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .slice(0, 5)
                  .map(([day, events]) => (
                    <div key={day} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 w-6">{day}</span>
                      <div className="flex gap-1">
                        {events.map((e, i) => <div key={i} className={cn('w-2 h-2 rounded-full', e.color)} />)}
                      </div>
                      <span className="text-xs text-gray-500 truncate">{events[0].label}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
