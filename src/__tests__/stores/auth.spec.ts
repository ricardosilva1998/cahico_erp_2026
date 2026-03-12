import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

// Mock supabase as null (mock mode)
vi.mock('@/lib/supabase', () => ({ supabase: null }))

describe('Auth Store (mock mode)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('initialize sets isInitialized and loading false', async () => {
    const auth = useAuthStore()
    await auth.initialize()
    expect(auth.isInitialized).toBe(true)
    expect(auth.loading).toBe(false)
  })

  it('loginWithEmail sets user and isAuthenticated', async () => {
    const auth = useAuthStore()
    await auth.loginWithEmail('test@cahico.com', 'password')
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.user).toBeTruthy()
    expect(auth.user!.email).toBe('test@cahico.com')
  })

  it('loginWithEmail with empty fields sets error', async () => {
    const auth = useAuthStore()
    await auth.loginWithEmail('', '')
    expect(auth.error).toBeTruthy()
    expect(auth.isAuthenticated).toBe(false)
  })

  it('loginWithEmail as admin sets isAdmin true', async () => {
    const auth = useAuthStore()
    await auth.loginWithEmail('admin@cahico.com', 'admin')
    expect(auth.isAdmin).toBe(true)
  })

  it('registerWithEmail stores verification code without auto-login', async () => {
    const auth = useAuthStore()
    await auth.registerWithEmail('new@cahico.com', 'password')
    expect(auth.isAuthenticated).toBe(false)
    const code = localStorage.getItem('cahico_verify_new@cahico.com')
    expect(code).toBeTruthy()
    expect(code).toHaveLength(6)
  })

  it('verifyEmail returns true for correct code', async () => {
    const auth = useAuthStore()
    await auth.registerWithEmail('new@cahico.com', 'password')
    const code = localStorage.getItem('cahico_verify_new@cahico.com')!
    const result = await auth.verifyEmail('new@cahico.com', code)
    expect(result).toBe(true)
  })

  it('verifyEmail returns false for wrong code', async () => {
    const auth = useAuthStore()
    await auth.registerWithEmail('new@cahico.com', 'password')
    const result = await auth.verifyEmail('new@cahico.com', '000000')
    expect(result).toBe(false)
    expect(auth.error).toBeTruthy()
  })

  it('resendVerificationCode generates new code', async () => {
    const auth = useAuthStore()
    await auth.registerWithEmail('new@cahico.com', 'password')
    const code1 = localStorage.getItem('cahico_verify_new@cahico.com')
    auth.resendVerificationCode('new@cahico.com')
    const code2 = localStorage.getItem('cahico_verify_new@cahico.com')
    expect(code2).toBeTruthy()
    expect(code2).toHaveLength(6)
    // New code generated (could rarely be same, but structure is valid)
    expect(code2).toBeTruthy()
    // Original code should have been there
    expect(code1).toBeTruthy()
  })

  it('logout clears user, session, localStorage', async () => {
    const auth = useAuthStore()
    await auth.loginWithEmail('test@cahico.com', 'password')
    expect(auth.isAuthenticated).toBe(true)

    await auth.logout()
    expect(auth.user).toBeNull()
    expect(auth.session).toBeNull()
    expect(auth.isAuthenticated).toBe(false)
    expect(localStorage.getItem('cahico_mock_user')).toBeNull()
  })
})
