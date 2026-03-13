<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNewsletter } from '@/composables/useNewsletter'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()
const { subscribe } = useNewsletter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const newsletterOptIn = ref(false)
const validationError = ref<string | null>(null)
const emailError = ref<string | null>(null)

// Verification step
const showVerification = ref(false)
const verificationCode = ref('')
const verificationSuccess = ref(false)
const codeSentMessage = ref(false)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validateEmail(): boolean {
  if (!EMAIL_REGEX.test(email.value)) {
    emailError.value = t('contact.errors.email')
    return false
  }
  emailError.value = null
  return true
}

function onEmailBlur() {
  if (email.value) validateEmail()
}

async function handleRegister() {
  validationError.value = null
  emailError.value = null
  authStore.clearError()

  if (!validateEmail()) return

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
    if (newsletterOptIn.value) {
      subscribe(email.value)
    }
    showVerification.value = true
  }
}

async function handleVerify() {
  authStore.clearError()
  const success = await authStore.verifyEmail(email.value, verificationCode.value)
  if (success) {
    verificationSuccess.value = true
    setTimeout(() => {
      router.push({ path: '/login', query: { verified: '1' } })
    }, 1500)
  }
}

function handleResend() {
  authStore.resendVerificationCode(email.value)
  codeSentMessage.value = true
  setTimeout(() => {
    codeSentMessage.value = false
  }, 3000)
}
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="register-title">{{ t('auth.createAccount') }}</h1>
      <p class="register-subtitle">{{ t('auth.joinCahico') }}</p>

      <!-- Verification Success -->
      <div v-if="verificationSuccess" class="success-message">
        {{ t('verify.verified') }}
        <RouterLink to="/login" class="success-link">{{ t('auth.goToSignIn') }}</RouterLink>
      </div>

      <!-- Verification Step -->
      <template v-else-if="showVerification">
        <div class="verify-section">
          <h2 class="verify-title">{{ t('verify.title') }}</h2>
          <p class="verify-subtitle">{{ t('verify.subtitle', { email: email }) }}</p>

          <div v-if="authStore.error" class="error-message">
            {{ authStore.error }}
            <button class="error-dismiss" @click="authStore.clearError()">x</button>
          </div>

          <div v-if="codeSentMessage" class="info-message">
            {{ t('verify.codeSent') }}
          </div>

          <div class="form-group">
            <input
              v-model="verificationCode"
              type="text"
              :placeholder="t('verify.codePlaceholder')"
              maxlength="6"
              class="verify-input"
              autocomplete="one-time-code"
            />
          </div>

          <button class="btn btn-primary" @click="handleVerify" :disabled="verificationCode.length < 6">
            {{ t('verify.verify') }}
          </button>

          <button class="btn-resend" @click="handleResend">
            {{ t('verify.resendCode') }}
          </button>
        </div>
      </template>

      <!-- Registration Form -->
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
              @blur="onEmailBlur"
            />
            <span v-if="emailError" class="field-error">{{ emailError }}</span>
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

          <div class="newsletter-opt-in">
            <label class="checkbox-label">
              <input v-model="newsletterOptIn" type="checkbox" />
              <span>{{ t('auth.newsletterOptIn') }}</span>
            </label>
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

.info-message {
  background: var(--color-success-bg);
  border: 1px solid var(--color-success);
  color: var(--color-success);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  text-align: center;
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

.field-error {
  color: var(--color-error);
  font-size: 0.8rem;
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

/* Verification */
.verify-section {
  text-align: center;
}

.verify-title {
  font-family: $font-headline;
  color: var(--color-teal);
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
}

.verify-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.verify-input {
  text-align: center;
  font-size: 1.5rem !important;
  letter-spacing: 0.5rem;
  font-weight: 700;
}

.btn-resend {
  background: none;
  border: none;
  color: var(--color-teal);
  cursor: pointer;
  font-size: 0.85rem;
  margin-top: 1rem;
  text-decoration: underline;

  &:hover {
    color: var(--color-teal-dark);
  }
}

.newsletter-opt-in {
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.4;

  input[type='checkbox'] {
    margin-top: 0.15rem;
    accent-color: var(--color-teal);
    width: 16px;
    height: 16px;
    flex-shrink: 0;
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
