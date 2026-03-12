<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const submitted = ref(false)
const submitting = ref(false)
const errors = reactive({ name: '', email: '', subject: '', message: '' })

function validate(): boolean {
  let valid = true
  errors.name = form.name.trim() ? '' : 'Please enter your name.'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Please enter a valid email address.'
  errors.subject = form.subject ? '' : 'Please select a subject.'
  errors.message = form.message.trim().length >= 10 ? '' : 'Please enter a message (min. 10 characters).'
  valid = !errors.name && !errors.email && !errors.subject && !errors.message
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  // Simulate a short send delay
  await new Promise(resolve => setTimeout(resolve, 900))
  submitting.value = false
  submitted.value = true
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  submitted.value = false
}
</script>

<template>
  <div class="contact-panel">
    <div class="panel-header">
      <h2 class="panel-title">Contact Us</h2>
      <p class="panel-subtitle">We'd love to hear from you. Send us a message and we'll reply within 24 hours.</p>
    </div>

    <div class="contact-layout">
      <!-- Contact form -->
      <div class="form-card">
        <Transition name="fade" mode="out-in">
          <!-- Success state -->
          <div v-if="submitted" class="success-state" key="success">
            <div class="success-icon">✉️</div>
            <h3 class="success-title">Message Sent!</h3>
            <p class="success-text">Thank you for reaching out. We'll reply to <strong>{{ form.email || 'you' }}</strong> within 24 hours.</p>
            <button class="send-btn" @click="resetForm">Send Another Message</button>
          </div>

          <!-- Form -->
          <form v-else key="form" @submit.prevent="handleSubmit" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.name }"
                  placeholder="Maria Santos"
                  autocomplete="name"
                />
                <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  :class="{ error: errors.email }"
                  placeholder="maria@exemplo.pt"
                  autocomplete="email"
                />
                <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Subject *</label>
              <select
                v-model="form.subject"
                class="form-input form-select"
                :class="{ error: errors.subject }"
              >
                <option value="" disabled>Select a subject…</option>
                <option value="General Enquiry">General Enquiry</option>
                <option value="Order Enquiry">Order Enquiry</option>
                <option value="Custom Piece">Custom Piece Request</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Press & Media">Press & Media</option>
              </select>
              <span v-if="errors.subject" class="field-error">{{ errors.subject }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Message *</label>
              <textarea
                v-model="form.message"
                class="form-input form-textarea"
                :class="{ error: errors.message }"
                placeholder="Tell us how we can help…"
                rows="5"
              ></textarea>
              <span v-if="errors.message" class="field-error">{{ errors.message }}</span>
            </div>

            <button type="submit" class="send-btn" :disabled="submitting">
              <span v-if="submitting">Sending…</span>
              <span v-else>Send Message →</span>
            </button>
          </form>
        </Transition>
      </div>

      <!-- Contact info sidebar -->
      <aside class="contact-sidebar">
        <div class="info-block">
          <div class="info-icon">📍</div>
          <div>
            <div class="info-label">Address</div>
            <div class="info-value">Rua das Flores, 12<br>2780-001 Oeiras<br>Lisboa — Portugal</div>
          </div>
        </div>

        <div class="info-block">
          <div class="info-icon">📞</div>
          <div>
            <div class="info-label">Phone</div>
            <a href="tel:+351210000000" class="info-value info-link">+351 21 000 00 00</a>
          </div>
        </div>

        <div class="info-block">
          <div class="info-icon">💬</div>
          <div>
            <div class="info-label">WhatsApp</div>
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
            <div class="info-label">Opening Hours</div>
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
  color: $color-dark-brown;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 0.4rem;
}

.panel-subtitle {
  font-family: $font-body;
  font-size: 0.95rem;
  color: $color-text-secondary;
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
  background: $color-white;
  border: 1px solid $color-border;
  border-radius: 12px;
  padding: 2rem;
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
  color: $color-text-secondary;
}

.form-input {
  font-family: $font-body;
  font-size: 0.9rem;
  color: $color-text-primary;
  background: $color-off-white;
  border: 1px solid $color-input-border;
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;

  &::placeholder {
    color: $color-tan;
  }

  &:focus {
    border-color: $color-teal;
    box-shadow: 0 0 0 3px rgba(23, 89, 118, 0.1);
    background: $color-white;
  }

  &.error {
    border-color: $color-error;
    box-shadow: 0 0 0 3px $color-error-bg;
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
  color: $color-error;
}

.send-btn {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: $color-white;
  background-color: $color-teal;
  border: none;
  border-radius: 8px;
  padding: 0.85rem 2rem;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background-color: $color-teal-dark;
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
  color: $color-dark-brown;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.success-text {
  font-family: $font-body;
  font-size: 0.95rem;
  color: $color-text-secondary;
  max-width: 340px;
  line-height: 1.55;
  margin: 0;
}

// Sidebar
.contact-sidebar {
  background: $color-white;
  border: 1px solid $color-border;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  color: $color-gold;
  margin-bottom: 0.2rem;
}

.info-value {
  font-family: $font-body;
  font-size: 0.875rem;
  color: $color-text-secondary;
  line-height: 1.55;
}

.info-link {
  text-decoration: none;
  color: $color-teal;
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
}
</style>
