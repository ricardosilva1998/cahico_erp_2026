import { ref, computed } from 'vue'

export interface NewsletterSubscriber {
  email: string
  subscribedAt: string
  active: boolean
}

const STORAGE_KEY = 'cahico_newsletter_subscribers'

function load(): NewsletterSubscriber[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(subscribers: NewsletterSubscriber[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers))
}

const subscribers = ref<NewsletterSubscriber[]>(load())

export function useNewsletter() {
  function isSubscribed(email: string): boolean {
    return subscribers.value.some((s) => s.email === email && s.active)
  }

  function subscribe(email: string) {
    const existing = subscribers.value.find((s) => s.email === email)
    if (existing) {
      existing.active = true
      existing.subscribedAt = new Date().toISOString()
    } else {
      subscribers.value.push({
        email,
        subscribedAt: new Date().toISOString(),
        active: true,
      })
    }
    save(subscribers.value)
  }

  function unsubscribe(email: string) {
    const existing = subscribers.value.find((s) => s.email === email)
    if (existing) {
      existing.active = false
      save(subscribers.value)
    }
  }

  function getSubscribers(): NewsletterSubscriber[] {
    return subscribers.value
  }

  const activeCount = computed(() => subscribers.value.filter((s) => s.active).length)
  const totalCount = computed(() => subscribers.value.length)

  return {
    isSubscribed,
    subscribe,
    unsubscribe,
    getSubscribers,
    activeCount,
    totalCount,
  }
}
