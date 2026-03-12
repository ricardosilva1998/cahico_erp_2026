<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const saved = ref(false)

const form = ref({
  display_name: '',
  avatar_url: '',
  phone: '',
  address: '',
})

onMounted(async () => {
  await profileStore.fetchProfile()
  if (profileStore.profile) {
    form.value = {
      display_name: profileStore.profile.display_name ?? '',
      avatar_url: profileStore.profile.avatar_url ?? '',
      phone: profileStore.profile.phone ?? '',
      address: profileStore.profile.address ?? '',
    }
  }
})

async function handleSave() {
  saved.value = false
  await profileStore.updateProfile(form.value)
  if (!profileStore.error) {
    saved.value = true
  }
}
</script>

<template>
  <div class="edit-profile">
    <h2 class="section-title">Edit Profile</h2>

    <div v-if="profileStore.error" class="error-msg">{{ profileStore.error }}</div>
    <div v-if="saved" class="success-msg">Profile updated successfully.</div>

    <form class="edit-form" @submit.prevent="handleSave">
      <div class="form-group">
        <label for="display_name">Display Name</label>
        <input id="display_name" v-model="form.display_name" placeholder="Your name" />
      </div>

      <div class="form-group">
        <label for="avatar_url">Avatar URL</label>
        <input id="avatar_url" v-model="form.avatar_url" placeholder="https://..." />
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input id="phone" v-model="form.phone" type="tel" placeholder="Your phone number" />
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <textarea id="address" v-model="form.address" rows="3" placeholder="Your address"></textarea>
      </div>

      <button type="submit" class="save-btn" :disabled="profileStore.loading">
        {{ profileStore.loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.section-title {
  font-family: $font-headline;
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin: 0 0 1rem;
}

.error-msg {
  background-color: var(--color-error-bg);
  border: 1px solid var(--color-error);
  color: var(--color-error);
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.success-msg {
  background-color: var(--color-success-bg);
  border: 1px solid var(--color-success);
  color: var(--color-success);
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
  }

  input,
  textarea {
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--color-input-border);
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--color-text-primary);
    background: var(--color-white);
    font-family: inherit;
    transition: border-color 0.2s;

    &::placeholder {
      color: var(--color-text-muted);
    }

    &:focus {
      outline: none;
      border-color: var(--color-teal);
    }
  }

  textarea {
    resize: vertical;
  }
}

.save-btn {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  padding: 0.65rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  min-height: 44px;

  &:hover:not(:disabled) {
    background-color: var(--color-teal-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
