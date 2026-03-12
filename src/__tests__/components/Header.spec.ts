import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import Header from '@/header/Header.vue'

// Mock supabase
vi.mock('@/lib/supabase', () => ({ supabase: null }))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      nav: {
        home: 'Home',
        collections: 'Collections',
        orders: 'Orders',
        materials: 'Materials',
        contact: 'Contact',
        admin: 'Admin',
      },
      cart: { title: 'Cart' },
    },
  },
})

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  function mountHeader() {
    return mount(Header, {
      global: {
        plugins: [createPinia(), i18n, router],
      },
    })
  }

  it('renders .site-header', () => {
    const wrapper = mountHeader()
    expect(wrapper.find('.site-header').exists()).toBe(true)
  })

  it('has nav items (Home, Collections, etc.)', () => {
    const wrapper = mountHeader()
    const links = wrapper.findAll('.nav-link')
    expect(links.length).toBeGreaterThanOrEqual(4)
    const texts = links.map((l) => l.text())
    expect(texts).toContain('Home')
    expect(texts).toContain('Collections')
  })

  it('cart badge hidden when empty', () => {
    const wrapper = mountHeader()
    expect(wrapper.find('.cart-badge').exists()).toBe(false)
  })

  it('mobile toggle button exists in DOM', () => {
    const wrapper = mountHeader()
    expect(wrapper.find('.mobile-toggle').exists()).toBe(true)
  })
})
