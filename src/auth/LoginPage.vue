<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const email = ref('')
const password = ref('')

async function handleEmailLogin() {
  if (!email.value || !password.value) return
  await authStore.loginWithEmail(email.value, password.value)
}

async function handleGoogleLogin() {
  await authStore.loginWithGoogle()
}

watch(
  () => authStore.isAuthenticated,
  (authenticated) => {
    if (authenticated) {
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    }
  },
)
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">CAHICO</h1>
      <p class="login-subtitle">{{ t('auth.signInAccount') }}</p>

      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
        <button class="error-dismiss" @click="authStore.clearError()">x</button>
      </div>

      <form class="login-form" @submit.prevent="handleEmailLogin">
        <div class="form-group">
          <label for="email">{{ t('auth.email') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('auth.emailPlaceholder')"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ t('auth.password') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="t('auth.passwordPlaceholder')"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
          {{ authStore.loading ? t('auth.signingIn') : t('auth.signIn') }}
        </button>
      </form>

      <div class="divider">
        <span>{{ t('auth.or') }}</span>
      </div>

      <button class="btn btn-google" @click="handleGoogleLogin" :disabled="authStore.loading">
        <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {{ t('auth.continueWithGoogle') }}
      </button>

      <p class="register-link">
        {{ t('auth.noAccount') }}
        <RouterLink to="/register">{{ t('auth.createOne') }}</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--color-bg-body);
}

.login-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-card-hover);
  transition: background-color 0.3s, border-color 0.3s;
}

.login-title {
  font-family: $font-brand;
  color: var(--color-teal);
  font-size: 1.75rem;
  text-align: center;
  margin: 0 0 0.25rem;
  letter-spacing: 3px;
}

.login-subtitle {
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
}

.error-message {
  background: var(--color-error-bg);
  border: 1px solid var(--color-error);
  color: var(--color-error);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
}

.error-dismiss {
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.25rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  label {
    color: var(--color-text-primary);
    font-size: 0.875rem;
  }

  input {
    background: var(--color-bg-section);
    border: 1px solid var(--color-input-border);
    border-radius: 8px;
    color: var(--color-text-primary);
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;

    &::placeholder {
      color: var(--color-text-muted);
    }

    &:focus {
      border-color: var(--color-teal);
    }
  }
}

.btn {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  min-height: 44px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: var(--color-teal);
  color: var(--color-text-on-dark);
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: var(--color-teal-dark);
  }
}

.btn-google {
  width: 100%;
  background: var(--color-white);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: var(--color-bg-section);
  }
}

.google-icon {
  flex-shrink: 0;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.25rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }

  span {
    color: var(--color-text-secondary);
    padding: 0 0.75rem;
    font-size: 0.8rem;
  }
}

.register-link {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-top: 1.25rem;

  a {
    color: var(--color-gold);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
    max-width: 100%;
  }

  .form-group input {
    min-height: 44px;
  }
}
</style>
