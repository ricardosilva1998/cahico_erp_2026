<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  orderRef: '',
  message: '',
})

const submitted = ref(false)
const submitting = ref(false)
const errors = reactive({ name: '', email: '', subject: '', message: '' })

const showOrderRef = computed(() =>
  form.subject === 'Order Enquiry' || form.subject === 'Order Status'
)

function validate(): boolean {
  let valid = true
  errors.name = form.name.trim() ? '' : t('contact.errors.name')
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : t('contact.errors.email')
  errors.subject = form.subject ? '' : t('contact.errors.subject')
  errors.message = form.message.trim().length >= 10 ? '' : t('contact.errors.message')
  valid = !errors.name && !errors.email && !errors.subject && !errors.message
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 900))
  submitting.value = false
  submitted.value = true
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.orderRef = ''
  form.message = ''
  submitted.value = false
}
</script>

<template>
  <div class="contact-panel">
    <div class="panel-header">
      <h2 class="panel-title">{{ t('contact.title') }}</h2>
      <p class="panel-subtitle">{{ t('contact.subtitle') }}</p>
    </div>

    <div class="contact-layout">
      <!-- Contact form -->
      <div class="form-card">
        <Transition name="fade" mode="out-in">
          <!-- Success state -->
          <div v-if="submitted" class="success-state" key="success">
            <div class="success-icon">✉️</div>
            <h3 class="success-title">{{ t('contact.successTitle') }}</h3>
            <p class="success-text">{{ t('contact.successText', { email: form.email || 'you' }) }}</p>
            <button class="send-btn" @click="resetForm">{{ t('contact.sendAnother') }}</button>
          </div>

          <!-- Form -->
          <form v-else key="form" @submit.prevent="handleSubmit" novalidate>
            <div class="form-group">
              <label class="form-label">{{ t('contact.fullName') }} *</label>
              <input
                v-model="form.name"
                type="text"
                class="form-input"
                :class="{ error: errors.name }"
                :placeholder="t('contact.fullNamePlaceholder')"
                autocomplete="name"
              />
              <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ t('contact.emailAddress') }} *</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  :class="{ error: errors.email }"
                  :placeholder="t('contact.emailPlaceholder')"
                  autocomplete="email"
                />
                <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">{{ t('contact.phoneLabel') }}</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  :placeholder="t('contact.phonePlaceholder')"
                  autocomplete="tel"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">{{ t('contact.subject') }} *</label>
              <select
                v-model="form.subject"
                class="form-input form-select"
                :class="{ error: errors.subject }"
              >
                <option value="" disabled>{{ t('contact.subjectPlaceholder') }}</option>
                <option value="General Enquiry">{{ t('contact.subjects.general') }}</option>
                <option value="Order Enquiry">{{ t('contact.subjects.order') }}</option>
                <option value="Order Status">{{ t('contact.subjects.orderStatus') }}</option>
                <option value="Custom Piece">{{ t('contact.subjects.custom') }}</option>
                <option value="Wholesale">{{ t('contact.subjects.wholesale') }}</option>
                <option value="Press & Media">{{ t('contact.subjects.press') }}</option>
              </select>
              <span v-if="errors.subject" class="field-error">{{ errors.subject }}</span>
            </div>

            <div v-if="showOrderRef" class="form-group">
              <label class="form-label">{{ t('contact.orderRefLabel') }}</label>
              <input
                v-model="form.orderRef"
                type="text"
                class="form-input"
                :placeholder="t('contact.orderRefPlaceholder')"
              />
            </div>

            <div class="form-group">
              <label class="form-label">{{ t('contact.message') }} *</label>
              <textarea
                v-model="form.message"
                class="form-input form-textarea"
                :class="{ error: errors.message }"
                :placeholder="t('contact.messagePlaceholder')"
                rows="5"
              ></textarea>
              <span v-if="errors.message" class="field-error">{{ errors.message }}</span>
            </div>

            <button type="submit" class="send-btn" :disabled="submitting">
              <span v-if="submitting">{{ t('contact.sending') }}</span>
              <span v-else>{{ t('contact.send') }}</span>
            </button>
          </form>
        </Transition>
      </div>

      <!-- Contact info sidebar -->
      <aside class="contact-sidebar">
        <div class="info-block">
          <div class="info-icon">📍</div>
          <div>
            <div class="info-label">{{ t('contact.address') }}</div>
            <div class="info-value">Rua das Flores, 12<br>2780-001 Oeiras<br>Lisboa — Portugal</div>
          </div>
        </div>

        <div class="info-block">
          <div class="info-icon">📞</div>
          <div>
            <div class="info-label">{{ t('contact.phone') }}</div>
            <a href="tel:+351210000000" class="info-value info-link">+351 21 000 00 00</a>
          </div>
        </div>

        <div class="info-block">
          <div class="info-icon">💬</div>
          <div>
            <div class="info-label">{{ t('contact.whatsapp') }}</div>
            <a
              href="https://wa.me/351910000000"
              target="_blank"
              rel="noopener"
              class="info-value info-link"
            >+351 91 000 00 00 ↗</a>
          </div>
        </div>

        <div class="info-block">
          <div class="info-icon">🕐</div>
          <div>
            <div class="info-label">{{ t('contact.openingHours') }}</div>
            <div class="info-value">
              Mon – Fri: 10:00 – 18:30<br>
              Sat: 10:00 – 14:00<br>
              Sun: Closed
            </div>
          </div>
        </div>

        <div class="info-block">
          <div class="info-icon">✉️</div>
          <div>
            <div class="info-label">Email</div>
            <a href="mailto:hello@cahico.pt" class="info-value info-link">hello@cahico.pt</a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.contact-panel {
  width: 100%;
  padding: 2rem;
}

.panel-header {
  margin-bottom: 2rem;
}

.panel-title {
  font-family: $font-headline;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 0.4rem;
}

.panel-subtitle {
  font-family: $font-body;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

// Form card
.form-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-card);
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-family: $font-headline;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.form-input {
  font-family: $font-body;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  background: var(--color-off-white);
  border: 1px solid var(--color-input-border);
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-teal);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-teal) 10%, transparent);
    background: var(--color-white);
  }

  &.error {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px var(--color-error-bg);
  }
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A4A3A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  padding-right: 2.5rem;
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.5;
}

.field-error {
  font-family: $font-body;
  font-size: 0.75rem;
  color: var(--color-error);
}

.send-btn {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--color-text-on-dark);
  background-color: var(--color-teal);
  border: none;
  border-radius: 8px;
  padding: 0.85rem 2rem;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  align-self: flex-start;
  min-height: 44px;

  &:hover:not(:disabled) {
    background-color: var(--color-teal-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Success state
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 1.5rem 0;
}

.success-icon {
  font-size: 3rem;
}

.success-title {
  font-family: $font-headline;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.success-text {
  font-family: $font-body;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  max-width: 340px;
  line-height: 1.55;
  margin: 0;
}

// Sidebar
.contact-sidebar {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: var(--shadow-card);
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.info-block {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
}

.info-icon {
  font-size: 1.15rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.info-label {
  font-family: $font-headline;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-gold);
  margin-bottom: 0.2rem;
}

.info-value {
  font-family: $font-body;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.55;
}

.info-link {
  text-decoration: none;
  color: var(--color-teal);
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

// Transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .contact-panel {
    padding: 1.25rem;
  }

  .form-card {
    padding: 1.25rem;
  }

  .send-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
