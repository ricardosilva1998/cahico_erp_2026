<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const validationError = ref<string | null>(null)
const registrationSuccess = ref(false)

async function handleRegister() {
  validationError.value = null
  authStore.clearError()

  if (password.value.length < 6) {
    validationError.value = t('auth.passwordShort')
    return
  }

  if (password.value !== confirmPassword.value) {
    validationError.value = t('auth.passwordMismatch')
    return
  }

  await authStore.registerWithEmail(email.value, password.value)

  if (!authStore.error) {
    registrationSuccess.value = true
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="register-title">{{ t('auth.createAccount') }}</h1>
      <p class="register-subtitle">{{ t('auth.joinCahico') }}</p>

      <div v-if="registrationSuccess" class="success-message">
        {{ t('auth.checkEmail') }}
        <RouterLink to="/login" class="success-link">{{ t('auth.goToSignIn') }}</RouterLink>
      </div>

      <template v-else>
        <div v-if="authStore.error || validationError" class="error-message">
          {{ validationError || authStore.error }}
          <button
            class="error-dismiss"
            @click="validationError = null; authStore.clearError()"
          >
            x
          </button>
        </div>

        <form class="register-form" @submit.prevent="handleRegister">
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
              :placeholder="t('auth.passwordMinLength')"
              required
              autocomplete="new-password"
            />
          </div>

          <div class="form-group">
            <label for="confirm-password">{{ t('auth.confirmPassword') }}</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              :placeholder="t('auth.confirmPasswordPlaceholder')"
              required
              autocomplete="new-password"
            />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
            {{ authStore.loading ? t('auth.creatingAccount') : t('auth.createAccount') }}
          </button>
        </form>

        <p class="login-link">
          {{ t('auth.haveAccount') }}
          <RouterLink to="/login">{{ t('auth.signInLink') }}</RouterLink>
        </p>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

.register-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-card-hover);
  transition: background-color 0.3s, border-color 0.3s;
}

.register-title {
  font-family: $font-brand;
  color: var(--color-teal);
  font-size: 1.75rem;
  text-align: center;
  margin: 0 0 0.25rem;
  letter-spacing: 2px;
}

.register-subtitle {
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
}

.success-message {
  background: var(--color-success-bg);
  border: 1px solid var(--color-success);
  color: var(--color-success);
  padding: 1.25rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.5;
}

.success-link {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--color-teal);
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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

.register-form {
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
    background: var(--color-white);
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

.login-link {
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
  .register-card {
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
