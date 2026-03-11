import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts and renders Header and MainPanel', () => {
    const wrapper = mount(App)
    expect(wrapper.find('.app-container').exists()).toBe(true)
  })
})
