import { z } from 'zod'

// Bangladesh phone number validation
const bdPhoneRegex = /^(\+8801|8801|01)[3-9]\d{8}$/

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerPhone: z
    .string()
    .regex(bdPhoneRegex, 'Please enter a valid Bangladesh phone number (e.g. 01712345678)'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  deliveryAddress: z.string().min(5, 'Please enter a complete address').max(500),
  district: z.string().min(1, 'Please select your district'),
  area: z.string().optional(),
  deliveryInstructions: z.string().max(500).optional(),
  shippingZoneId: z.string().min(1, 'Please select a delivery zone'),
  paymentMethod: z.enum(['CASH_ON_DELIVERY']),
  couponCode: z.string().optional(),
  idempotencyKey: z.string().min(1),
  marketingConsent: z.boolean().optional(),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export const orderTrackingSchema = z.object({
  publicReference: z.string().min(1, 'Order reference is required'),
  customerPhone: z
    .string()
    .regex(bdPhoneRegex, 'Please enter a valid Bangladesh phone number'),
})

export const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(50).toUpperCase(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(bdPhoneRegex, 'Please enter a valid Bangladesh phone number').optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

// Admin schemas
export const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  sku: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().int().min(1, 'Price must be at least ৳1'),
  compareAtPrice: z.number().int().min(1).optional().nullable(),
  stockQuantity: z.number().int().min(0),
  categoryId: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
  isFeatured: z.boolean(),
  allowBackorder: z.boolean(),
  weight: z.string().max(50).optional(),
  tags: z.string().optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().max(1000).optional(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean(),
})

export const couponAdminSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase(),
  description: z.string().max(200).optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().int().min(1),
  minimumOrderAmount: z.number().int().min(0),
  maximumDiscount: z.number().int().min(1).optional().nullable(),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  isActive: z.boolean(),
})

export const shippingZoneSchema = z.object({
  name: z.string().min(2).max(100),
  districts: z.string().min(1, 'At least one district required'),
  fee: z.number().int().min(0),
  freeShippingThreshold: z.number().int().min(1).optional().nullable(),
  estimatedDays: z.string().max(50).optional(),
  isActive: z.boolean(),
})
