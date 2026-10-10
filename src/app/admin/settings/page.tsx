import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Settings, Truck, ShieldCheck, Check } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function updateSettingsAction(formData: FormData) {
  'use server'
  const storeName = formData.get('store_name') as string
  const storePhone = formData.get('store_phone') as string
  const storeEmail = formData.get('store_email') as string
  const insideDhakaFee = parseInt(formData.get('inside_dhaka_fee') as string, 10)
  const outsideDhakaFee = parseInt(formData.get('outside_dhaka_fee') as string, 10)

  if (storeName) {
    await prisma.storeSetting.upsert({
      where: { key: 'store_name' },
      update: { value: storeName },
      create: { key: 'store_name', value: storeName },
    })
  }

  if (storePhone) {
    await prisma.storeSetting.upsert({
      where: { key: 'store_phone' },
      update: { value: storePhone },
      create: { key: 'store_phone', value: storePhone },
    })
  }

  if (storeEmail) {
    await prisma.storeSetting.upsert({
      where: { key: 'store_email' },
      update: { value: storeEmail },
      create: { key: 'store_email', value: storeEmail },
    })
  }

  if (!isNaN(insideDhakaFee)) {
    await prisma.shippingZone.update({
      where: { id: 'zone-dhaka-inside' },
      data: { fee: insideDhakaFee },
    })
  }

  if (!isNaN(outsideDhakaFee)) {
    await prisma.shippingZone.update({
      where: { id: 'zone-dhaka-outside' },
      data: { fee: outsideDhakaFee },
    })
  }

  revalidatePath('/admin/settings')
}

export default async function AdminSettingsPage() {
  const [settings, shippingZones] = await Promise.all([
    prisma.storeSetting.findMany(),
    prisma.shippingZone.findMany({ orderBy: { fee: 'asc' } }),
  ])

  const settingsMap = new Map(settings.map((s) => [s.key, s.value]))
  const insideZone = shippingZones.find((z) => z.id === 'zone-dhaka-inside')
  const outsideZone = shippingZones.find((z) => z.id === 'zone-dhaka-outside')

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Store Configuration
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure business details, shipping rates, and store operational parameters.
        </p>
      </div>

      <form action={updateSettingsAction} className="space-y-6">
        {/* Business Profile */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-600" />
            General Business Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Store Name</label>
              <input
                type="text"
                name="store_name"
                defaultValue={settingsMap.get('store_name') || 'ShopBD'}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Currency</label>
              <input
                type="text"
                disabled
                value="BDT (৳) — Bangladesh Taka"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="store_phone"
                defaultValue={settingsMap.get('store_phone') || '+880 1712-345678'}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Support Email</label>
              <input
                type="email"
                name="store_email"
                defaultValue={settingsMap.get('store_email') || 'support@shopbd.com'}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Shipping Zones & Rates */}
        <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-600" />
            Delivery Rates (BDT)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Inside Dhaka City</span>
              <p className="text-stone-500 text-[11px] mb-3">1-2 business days • Free over ৳2,000</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-700">৳</span>
                <input
                  type="number"
                  name="inside_dhaka_fee"
                  defaultValue={insideZone?.fee || 60}
                  className="w-24 px-3 py-1.5 rounded-xl border border-stone-300 font-bold bg-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Outside Dhaka (All Districts)</span>
              <p className="text-stone-500 text-[11px] mb-3">2-4 business days • Free over ৳3,000</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-700">৳</span>
                <input
                  type="number"
                  name="outside_dhaka_fee"
                  defaultValue={outsideZone?.fee || 120}
                  className="w-24 px-3 py-1.5 rounded-xl border border-stone-300 font-bold bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-all"
        >
          <Check className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </form>
    </div>
  )
}
