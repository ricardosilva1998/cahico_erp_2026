import { computed, ref } from 'vue'

let currentTab = ref<string>('')

export function useTabManager(initialTab?: string) {
  if (initialTab && currentTab.value === '') {
    currentTab.value = initialTab
  }

  const setTab = (tabName: string) => {
    currentTab.value = tabName
  }

  const getCurrentTab = () => currentTab.value

  const isActiveTab = (tabName: string) => computed(() => currentTab.value === tabName)

  return {
    currentTab,
    setTab,
    getCurrentTab,
    isActiveTab,
  }
}
