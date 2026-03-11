<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const validationError = ref<string | null>(null)
const registrationSuccess = ref(false)

async function handleRegister() {
  validationError.value = null
  authStore.clearError()

  if (password.value.length < 6) {
    validationError.value = 'Password must be at least 6 characters'
    return
  }

  if (password.value !== confirmPassword.value) {
    validationError.value = 'Passwords do not match'
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
      <h1 class="register-title">Create Account</h1>
      <p class="register-subtitle">Join CAHICO Jewelry</p>

      <div v-if="registrationSuccess" class="success-message">
        Check your email to confirm your account, then sign in.
        <RouterLink to="/login" class="success-link">Go to Sign In</RouterLink>
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
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="At least 6 characters"
              required
              autocomplete="new-password"
            />
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              required
              autocomplete="new-password"
            />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
            {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="login-link">
          Already have an account?
          <RouterLink to="/login">Sign in</RouterLink>
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
  background: white;
  border: 1px solid $color-border;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(61, 43, 31, 0.12);
}

.register-title {
  font-family: $font-brand;
  color: $color-marine;
  font-size: 1.75rem;
  text-align: center;
  margin: 0 0 0.25rem;
  letter-spacing: 2px;
}

.register-subtitle {
  color: $color-text-secondary;
  text-align: center;
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
}

.success-message {
  background: $color-success-bg;
  border: 1px solid $color-success;
  color: $color-success;
  padding: 1.25rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.5;
}

.success-link {
  display: inline-block;
  margin-top: 0.75rem;
  color: $color-marine;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.error-message {
  background: $color-error-bg;
  border: 1px solid $color-error;
  color: $color-error;
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
  color: $color-error;
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
    color: $color-text-primary;
    font-size: 0.875rem;
  }

  input {
    background: white;
    border: 1px solid $color-input-border;
    border-radius: 8px;
    color: $color-text-primary;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;

    &::placeholder {
      color: #b0a090;
    }

    &:focus {
      border-color: $color-marine;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: $color-marine;
  color: white;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: $color-navy;
  }
}

.login-link {
  text-align: center;
  color: $color-text-secondary;
  font-size: 0.875rem;
  margin-top: 1.25rem;

  a {
    color: $color-gold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
