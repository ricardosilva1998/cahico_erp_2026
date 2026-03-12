import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import App from '../App.vue'

vi.mock('@/lib/supabase', () => ({ supabase: null }))

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div class="home" />' } }],
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
})

describe('App', () => {
  it('mounts and renders .app-container', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router, i18n],
      },
    })
    expect(wrapper.find('.app-container').exists()).toBe(true)
  })
})
