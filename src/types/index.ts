// Cart types for local storage
export interface CartItem {
  id: string // productId or variantId
  productId: string
  variantId?: string
  name: string
  variantName?: string
  price: number
  image?: string
  quantity: number
  maxStock: number
  slug: string
}

export interface CartState {
  items: CartItem[]
  couponCode?: string
  couponDiscount?: number
  shippingFee?: number
  shippingZoneId?: string
}

// Product types
export interface ProductWithDetails {
  id: string
  name: string
  slug: string
  sku?: string | null
  description?: string | null
  price: number
  compareAtPrice?: number | null
  stockQuantity: number
  status: string
  isFeatured: boolean
  allowBackorder: boolean
  categoryId?: string | null
  category?: { id: string; name: string; slug: string } | null
  images: ProductImageType[]
  variants: ProductVariantType[]
  tags?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ProductImageType {
  id: string
  url: string
  altText?: string | null
  sortOrder: number
  isPrimary: boolean
}

export interface ProductVariantType {
  id: string
  name: string
  sku?: string | null
  priceOverride?: number | null
  stockQuantity: number
  isActive: boolean
  sortOrder: number
}

// Order types
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED'
export type PaymentMethod = 'CASH_ON_DELIVERY'

export interface CheckoutFormData {
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryAddress: string
  district: string
  area?: string
  deliveryInstructions?: string
  shippingZoneId: string
  paymentMethod: PaymentMethod
  couponCode?: string
  idempotencyKey: string
  cartItems: CartItem[]
}
