<script setup lang="ts">
import { useTabManager } from '@/composables/useTabManager'
import { useI18n } from 'vue-i18n'

const { setTab } = useTabManager()
const { t } = useI18n()

function navigateToCollection() {
  setTab('Stock')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer id="contact" class="site-footer">
    <div class="footer-inner">
      <div class="footer-columns">
        <!-- Column 1: Brand + Social -->
        <div class="footer-col">
          <span class="footer-logo">CAHICO</span>
          <p class="footer-tagline">{{ t('footer.tagline') }}</p>
          <div class="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Categories -->
        <div class="footer-col">
          <h4 class="footer-heading">{{ t('footer.categories') }}</h4>
          <ul class="footer-links">
            <li><a @click="navigateToCollection">{{ t('footer.rings') }}</a></li>
            <li><a @click="navigateToCollection">{{ t('footer.necklaces') }}</a></li>
            <li><a @click="navigateToCollection">{{ t('footer.bracelets') }}</a></li>
            <li><a @click="navigateToCollection">{{ t('footer.earrings') }}</a></li>
          </ul>
        </div>

        <!-- Column 3: Information -->
        <div class="footer-col">
          <h4 class="footer-heading">{{ t('footer.information') }}</h4>
          <ul class="footer-links">
            <li><a href="#">{{ t('footer.terms') }}</a></li>
            <li><a href="#">{{ t('footer.privacy') }}</a></li>
            <li><a href="#">{{ t('footer.refund') }}</a></li>
            <li><a href="#">{{ t('footer.shipping') }}</a></li>
          </ul>
        </div>

        <!-- Column 4: Contact -->
        <div class="footer-col">
          <h4 class="footer-heading">{{ t('footer.contact') }}</h4>
          <div class="footer-contact">
            <p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="contact-icon">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              +351 966 232 435
            </p>
            <p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="contact-icon">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.559 4.146 1.54 5.89L0 24l6.293-1.511A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.003 0-3.878-.572-5.47-1.562l-.393-.233-3.729.896.938-3.623-.256-.408A9.704 9.704 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
              </svg>
              WhatsApp
            </p>
            <p class="footer-address">
              Rua Neves de Sousa, n14, 3dto,<br />
              2780-272 Oeiras, Lisboa - Portugal
            </p>
          </div>
        </div>
      </div>

      <!-- Payment methods -->
      <div class="footer-payment">
        <span class="payment-label">{{ t('footer.securePayments') }}</span>
        <div class="payment-icons">
          <span class="payment-badge">Visa</span>
          <span class="payment-badge">Mastercard</span>
          <span class="payment-badge">PayPal</span>
          <span class="payment-badge">MB Way</span>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-copyright">
        <p>{{ t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

// Footer keeps dark background in both themes
.site-footer {
  background-color: $color-dark-brown;
  color: $color-white;
  margin-top: auto;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem 1.5rem;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.footer-logo {
  font-family: $font-brand;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 4px;
  display: block;
  margin-bottom: 0.25rem;
}

.footer-tagline {
  color: $color-tan;
  font-size: 0.85rem;
  margin: 0 0 1.25rem;
}

.footer-social {
  display: flex;
  gap: 0.75rem;

  a {
    color: $color-tan;
    transition: color 0.2s;
    display: flex;

    &:hover {
      color: $color-white;
    }
  }
}

.footer-heading {
  font-family: $font-headline;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: $color-gold;
  margin: 0 0 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  li a {
    color: $color-tan;
    text-decoration: none;
    font-size: 0.88rem;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: $color-white;
    }
  }
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  p {
    color: $color-tan;
    font-size: 0.88rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.contact-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.footer-address {
  line-height: 1.5;
  margin-top: 0.25rem;
}

.footer-payment {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.payment-label {
  color: $color-tan;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.payment-icons {
  display: flex;
  gap: 0.5rem;
}

.payment-badge {
  background-color: rgba(255, 255, 255, 0.1);
  color: $color-tan;
  padding: 0.3rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.footer-copyright {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1.25rem;

  p {
    color: $color-tan;
    font-size: 0.78rem;
    margin: 0;
    opacity: 0.7;
  }
}

@media (max-width: 480px) {
  .footer-inner {
    padding: 2rem 1rem 1rem;
  }
}
</style>
