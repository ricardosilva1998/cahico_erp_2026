import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

const MOCK_USER_KEY = 'cahico_mock_user'

function createMockUser(email: string, fullName: string, avatarUrl = ''): User {
  return {
    id: 'mock-' + Math.random().toString(36).slice(2),
    email,
    user_metadata: { full_name: fullName, name: fullName, avatar_url: avatarUrl },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as unknown as User
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => {
    if (!user.value) return false
    return (
      user.value.app_metadata?.role === 'admin' ||
      user.value.email === 'admin@cahico.com'
    )
  })
  const userEmail = computed(() => user.value?.email)
  const userDisplayName = computed(() => {
    const meta = user.value?.user_metadata
    return meta?.full_name ?? meta?.name ?? user.value?.email ?? ''
  })
  const userAvatarUrl = computed(() => user.value?.user_metadata?.avatar_url ?? '')

  async function initialize() {
    if (isInitialized.value) return

    if (!supabase) {
      // Mock auth: restore session from localStorage
      try {
        const stored = localStorage.getItem(MOCK_USER_KEY)
        if (stored) {
          user.value = JSON.parse(stored) as User
        }
      } catch {
        // ignore corrupt storage
      }
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
    error.value = null

    if (!supabase) {
      // Mock: sign in as a demo Google user
      const mockUser = createMockUser(
        'demo@google.com',
        'Google User',
        'https://lh3.googleusercontent.com/a/default-user'
      )
      user.value = mockUser
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
      return
    }

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (authError) {
      error.value = authError.message
    }
  }

  async function loginWithEmail(email: string, password: string) {
    error.value = null
    loading.value = true

    if (!supabase) {
      // Mock: accept any credentials
      if (!email || !password) {
        error.value = 'Please enter your email and password.'
        loading.value = false
        return
      }
      // Admin super user
      if (email === 'admin@cahico.com' && password === 'admin') {
        const adminUser = createMockUser('admin@cahico.com', 'Admin')
        adminUser.app_metadata = { role: 'admin' }
        user.value = adminUser
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(adminUser))
        loading.value = false
        return
      }
      const name = (email.split('@')[0] ?? email).replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      const mockUser = createMockUser(email, name)
      user.value = mockUser
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
      loading.value = false
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      error.value = authError.message
    }
    loading.value = false
  }

  async function registerWithEmail(email: string, password: string) {
    error.value = null
    loading.value = true

    if (!supabase) {
      // Mock: register as a new user
      if (!email || !password) {
        error.value = 'Please fill in all fields.'
        loading.value = false
        return
      }
      const name = (email.split('@')[0] ?? email).replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      const mockUser = createMockUser(email, name)
      user.value = mockUser
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
      loading.value = false
      return
    }

    const { error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) {
      error.value = authError.message
    }
    loading.value = false
  }

  async function logout() {
    if (!supabase) {
      // Mock: clear localStorage
      user.value = null
      session.value = null
      localStorage.removeItem(MOCK_USER_KEY)
      return
    }
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
    isAdmin,
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
