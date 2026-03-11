import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  phone: string | null
  address: string | null
}

export interface Order {
  id: string
  status: string
  total_amount: number
  items: Array<{ name: string; quantity: number; price: number }>
  shipping_address: string | null
  notes: string | null
  created_at: string
}

export interface PaymentMethod {
  id: string
  type: string
  last_four: string
  expiry_month: number
  expiry_year: number
  cardholder_name: string
  is_default: boolean
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null)
  const orders = ref<Order[]>([])
  const paymentMethods = ref<PaymentMethod[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProfile() {
    if (!supabase) return
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .single()
    if (err) {
      error.value = err.message
    } else {
      profile.value = data
    }
    loading.value = false
  }

  async function updateProfile(updates: Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'phone' | 'address'>>) {
    if (!supabase) return
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.value?.id)
      .select()
      .single()
    if (err) {
      error.value = err.message
    } else {
      profile.value = data
    }
    loading.value = false
  }

  async function fetchOrders() {
    if (!supabase) return
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) {
      error.value = err.message
    } else {
      orders.value = data ?? []
    }
    loading.value = false
  }

  async function fetchPaymentMethods() {
    if (!supabase) return
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('payment_methods')
      .select('*')
      .order('is_default', { ascending: false })
    if (err) {
      error.value = err.message
    } else {
      paymentMethods.value = data ?? []
    }
    loading.value = false
  }

  async function addPaymentMethod(method: Omit<PaymentMethod, 'id' | 'is_default'>) {
    if (!supabase) return
    error.value = null
    const { error: err } = await supabase
      .from('payment_methods')
      .insert(method)
    if (err) {
      error.value = err.message
    } else {
      await fetchPaymentMethods()
    }
  }

  async function deletePaymentMethod(id: string) {
    if (!supabase) return
    error.value = null
    const { error: err } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id)
    if (err) {
      error.value = err.message
    } else {
      paymentMethods.value = paymentMethods.value.filter((m) => m.id !== id)
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    profile,
    orders,
    paymentMethods,
    loading,
    error,
    fetchProfile,
    updateProfile,
    fetchOrders,
    fetchPaymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    clearError,
  }
})
