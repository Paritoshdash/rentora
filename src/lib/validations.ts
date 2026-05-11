import { z } from 'zod'

export const propertySchema = z.object({
  name: z.string().min(2, 'Property name must be at least 2 characters').max(100),
  address: z.string().min(5, 'Address must be at least 5 characters').max(300),
  type: z.enum(['apartment', 'villa', 'flat', 'house', 'commercial'], {
    required_error: 'Please select a property type',
  }),
  units: z.coerce.number().int().min(1, 'Must have at least 1 unit').max(1000),
  monthly_rent: z.coerce.number().min(0, 'Rent cannot be negative').max(10000000),
  status: z.enum(['active', 'inactive']).default('active'),
})

export const tenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15)
    .regex(/^[+\d\s\-()]+$/, 'Please enter a valid phone number'),
  property_id: z.string().uuid('Please select a property'),
  unit: z.string().min(1, 'Unit number is required').max(20),
  rent_amount: z.coerce.number().min(1, 'Rent amount must be greater than 0').max(10000000),
  deposit: z.coerce.number().min(0, 'Deposit cannot be negative').max(10000000),
  move_in_date: z.string().min(1, 'Move-in date is required'),
  agreement_end: z.string().min(1, 'Agreement end date is required'),
  due_date: z.coerce.number().int().min(1).max(28),
  notes: z.string().max(500).optional().nullable(),
})

export const paymentSchema = z.object({
  tenant_id: z.string().uuid('Please select a tenant'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  due_date: z.string().min(1, 'Due date is required'),
  month: z.string().min(1, 'Month is required'),
  status: z.enum(['paid', 'pending', 'overdue', 'partial']),
  paid_date: z.string().optional().nullable(),
  payment_method: z.string().optional().nullable(),
  late_fee: z.coerce.number().min(0).default(0),
  notes: z.string().max(500).optional().nullable(),
})

export const expenseSchema = z.object({
  property_id: z.string().uuid('Please select a property'),
  category: z.enum(['electricity', 'water', 'repairs', 'maintenance', 'other']),
  description: z.string().min(3, 'Description must be at least 3 characters').max(300),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0').max(10000000),
  date: z.string().min(1, 'Date is required'),
})

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[+\d\s\-()]+$/, 'Please enter a valid phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const profileSchema = z.object({
  full_name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
})

export type PropertyFormData = z.infer<typeof propertySchema>
export type TenantFormData = z.infer<typeof tenantSchema>
export type PaymentFormData = z.infer<typeof paymentSchema>
export type ExpenseFormData = z.infer<typeof expenseSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
