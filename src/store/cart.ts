import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  couponCode?: string
  couponDiscount?: number
  shippingFee?: number
  shippingZoneId?: string

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (id: string, variantId?: string) => void
  updateQuantity: (id: string, variantId: string | undefined, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  setShipping: (zoneId: string, fee: number) => void
}

const getItemKey = (productId: string, variantId?: string) =>
  variantId ? `${productId}-${variantId}` : productId

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: undefined,
      couponDiscount: undefined,
      shippingFee: undefined,
      shippingZoneId: undefined,

      addItem: (newItem) => {
        const { items } = get()
        const key = getItemKey(newItem.productId, newItem.variantId)
        const existingIndex = items.findIndex(
          (i) => getItemKey(i.productId, i.variantId) === key
        )

        if (existingIndex >= 0) {
          const existing = items[existingIndex]
          const newQuantity = Math.min(
            existing.quantity + newItem.quantity,
            newItem.maxStock
          )
          const updated = [...items]
          updated[existingIndex] = { ...existing, quantity: newQuantity }
          set({ items: updated, isOpen: true })
        } else {
          set({ items: [...items, newItem], isOpen: true })
        }
      },

      removeItem: (productId, variantId) => {
        const key = getItemKey(productId, variantId)
        set((state) => ({
          items: state.items.filter(
            (i) => getItemKey(i.productId, i.variantId) !== key
          ),
        }))
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, variantId)
          return
        }
        const key = getItemKey(productId, variantId)
        set((state) => ({
          items: state.items.map((item) =>
            getItemKey(item.productId, item.variantId) === key
              ? { ...item, quantity: Math.min(quantity, item.maxStock) }
              : item
          ),
        }))
      },

      clearCart: () =>
        set({
          items: [],
          couponCode: undefined,
          couponDiscount: undefined,
          shippingFee: undefined,
          shippingZoneId: undefined,
        }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCoupon: (code, discount) =>
        set({ couponCode: code, couponDiscount: discount }),

      removeCoupon: () =>
        set({ couponCode: undefined, couponDiscount: undefined }),

      setShipping: (zoneId, fee) =>
        set({ shippingZoneId: zoneId, shippingFee: fee }),
    }),
    {
      name: 'shopbd-cart',
      storage: createJSONStorage(() => localStorage),
      // Don't persist UI state
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
        shippingFee: state.shippingFee,
        shippingZoneId: state.shippingZoneId,
      }),
    }
  )
)

// Selectors
export const useCartItems = () => useCartStore((s) => s.items)
export const useCartIsOpen = () => useCartStore((s) => s.isOpen)
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
export const useCartSubtotal = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0))
