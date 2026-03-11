import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email)
  const userDisplayName = computed(() => {
    const meta = user.value?.user_metadata
    return meta?.full_name ?? meta?.name ?? user.value?.email ?? ''
  })
  const userAvatarUrl = computed(() => user.value?.user_metadata?.avatar_url ?? '')

  async function initialize() {
    if (isInitialized.value) return

    if (!supabase) {
      isInitialized.value = true
      loading.value = false
      return
    }

    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user ?? null

      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null
      })
    } catch {
      // Session restore failed — user will need to log in
    }

    isInitialized.value = true
    loading.value = false
  }

  async function loginWithGoogle() {
    if (!supabase) return
    error.value = null
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (authError) {
      error.value = authError.message
    }
  }

  async function loginWithEmail(email: string, password: string) {
    if (!supabase) return
    error.value = null
    loading.value = true
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (authError) {
      error.value = authError.message
    }
    loading.value = false
  }

  async function registerWithEmail(email: string, password: string) {
    if (!supabase) return
    error.value = null
    loading.value = true
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (authError) {
      error.value = authError.message
    }
    loading.value = false
  }

  async function logout() {
    if (!supabase) return
    const { error: authError } = await supabase.auth.signOut()
    if (authError) {
      error.value = authError.message
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    session,
    loading,
    error,
    isInitialized,
    isAuthenticated,
    userEmail,
    userDisplayName,
    userAvatarUrl,
    initialize,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    clearError,
  }
})
