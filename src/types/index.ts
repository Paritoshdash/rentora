export type PropertyType = 'apartment' | 'villa' | 'flat' | 'house' | 'commercial'
export type PropertyStatus = 'active' | 'inactive'
export type TenantStatus = 'active' | 'inactive'
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial'
export type ExpenseCategory = 'electricity' | 'water' | 'repairs' | 'maintenance' | 'other'
export type NotificationType = 'overdue' | 'due_soon' | 'agreement_expiry' | 'payment' | 'general'
export type ActivityType = 'payment' | 'tenant' | 'property' | 'expense'

export interface Property {
  id: string
  user_id: string
  name: string
  address: string
  type: PropertyType
  units: number
  occupied_units: number
  monthly_rent: number
  image_url?: string | null
  status: PropertyStatus
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  user_id: string
  property_id: string | null
  name: string
  email: string
  phone: string
  unit: string
  rent_amount: number
  deposit: number
  move_in_date: string
  agreement_end: string
  due_date: number
  status: TenantStatus
  notes?: string | null
  id_proof_url?: string | null
  created_at: string
  updated_at: string
  // joined
  property_name?: string
  properties?: { name: string } | null
}

export interface Payment {
  id: string
  user_id: string
  tenant_id: string
  tenant_name: string
  property_name: string
  unit: string
  amount: number
  due_date: string
  paid_date: string | null
  status: PaymentStatus
  payment_method: string | null
  late_fee: number
  month: string
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  user_id: string
  property_id: string | null
  property_name: string
  category: ExpenseCategory
  description: string
  amount: number
  date: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  detail: string
  type: ActivityType
  created_at: string
}

export interface DashboardStats {
  totalProperties: number
  totalUnits: number
  occupiedUnits: number
  totalTenants: number
  monthlyExpectedIncome: number
  collectedRent: number
  pendingRent: number
  overdueRent: number
  occupancyRate: number
  totalExpenses: number
  netProfit: number
}

export interface MonthlyChartData {
  month: string
  income: number
  expenses: number
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  phone?: string
  address?: string
  avatar_url?: string
  currency: string
  created_at: string
}
