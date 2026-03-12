<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useTabManager } from '@/composables/useTabManager'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const authStore = useAuthStore()
const { setTab } = useTabManager()
const router = useRouter()
const { t } = useI18n()

const collections = computed(() => [
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/299/399?1771499425',
    name: t('home.rings'),
    description: t('home.ringsDesc'),
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/299/399?1771500213',
    name: t('home.necklaces'),
    description: t('home.necklacesDesc'),
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/299/399?1771514251',
    name: t('home.bracelets'),
    description: t('home.braceletsDesc'),
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/299/399?1771427526',
    name: t('home.earrings'),
    description: t('home.earringsDesc'),
  },
])

const featuredPieces = [
  { name: 'Alfama Ring', material: '18k Gold · Diamond', price: '€1,240', img: 'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/299/399?1771499425' },
  { name: 'Alfama Necklace', material: 'Sterling Silver · Pearl', price: '€680', img: 'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/299/399?1771500213' },
  { name: 'Alfama Bracelet', material: '18k Rose Gold', price: '€920', img: 'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/299/399?1771514251' },
  { name: 'Alfama Earrings', material: '14k Gold · Topaz', price: '€540', img: 'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/299/399?1771427526' },
  { name: 'Chiado Ring', material: 'Sterling Silver · Onyx', price: '€380', img: 'https://cdnx.jumpseller.com/cahico/image/74201642/thumb/299/399?1772729926' },
  { name: 'Chiado Necklace', material: '18k Gold · Emerald', price: '€1,580', img: 'https://cdnx.jumpseller.com/cahico/image/74201707/thumb/299/399?1772730169' },
]

function handleExplore() {
  setTab('Stock')
}

function handleLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="jewelry-home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-tagline">{{ t('home.tagline') }}</p>
        <h1 class="hero-title">{{ t('home.title') }}</h1>
        <h2 class="hero-subtitle" v-html="t('home.subtitle').replace('\\n', '<br />')"></h2>
        <p class="hero-description">{{ t('home.description') }}</p>
        <div class="hero-actions">
          <button class="btn-primary" @click="handleExplore">{{ t('home.exploreCollection') }}</button>
          <button
            v-if="!authStore.isAuthenticated"
            class="btn-outline"
            @click="handleLogin"
          >
            {{ t('home.signIn') }}
          </button>
        </div>
      </div>
      <div class="hero-image-wrap">
        <img
          src="https://assets.jumpseller.com/store/cahico/themes/951526/settings/e1cc539c24b52a7db590/984c28e3-9209-4d77-85b1-6019bdd75bc7.jpg?1773135834"
          alt="CAHICO jewellery collection"
          class="hero-photo"
        />
      </div>
    </section>

    <!-- Collections Section -->
    <section class="collections">
      <div class="section-header">
        <h2 class="section-title">{{ t('home.ourCollections') }}</h2>
        <p class="section-subtitle">{{ t('home.collectionsSubtitle') }}</p>
      </div>
      <div class="collections-grid">
        <div
          v-for="collection in collections"
          :key="collection.name"
          class="collection-card"
        >
          <img :src="collection.img" :alt="collection.name" class="collection-img" />
          <h3 class="collection-name">{{ collection.name }}</h3>
          <p class="collection-desc">{{ collection.description }}</p>
          <button class="collection-btn" @click="handleExplore">{{ t('home.explore') }}</button>
        </div>
      </div>
    </section>

    <!-- Featured Pieces -->
    <section class="featured">
      <div class="section-header">
        <h2 class="section-title">{{ t('home.featuredPieces') }}</h2>
        <p class="section-subtitle">{{ t('home.featuredSubtitle') }}</p>
      </div>
      <div class="featured-grid">
        <div v-for="piece in featuredPieces" :key="piece.name" class="piece-card">
          <div class="piece-image">
            <img :src="piece.img" :alt="piece.name" class="piece-photo" />
          </div>
          <div class="piece-info">
            <h3 class="piece-name">{{ piece.name }}</h3>
            <p class="piece-material">{{ piece.material }}</p>
            <p class="piece-price">{{ piece.price }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Story -->
    <section class="brand-story">
      <div class="story-grid">
        <div class="story-text-block">
          <p class="story-label">{{ t('home.ourStory') }}</p>
          <h2 class="story-title">{{ t('home.storyTitle') }}</h2>
          <p class="story-body">{{ t('home.storyBody1') }}</p>
          <p class="story-body">{{ t('home.storyBody2') }}</p>
          <button class="btn-outline story-btn" @click="handleExplore">{{ t('home.discoverMore') }}</button>
        </div>
        <div class="story-visual">
          <div class="story-badge">
            <span class="badge-year">{{ t('home.estLabel') }}</span>
            <span class="badge-number">1987</span>
            <span class="badge-text">{{ t('home.yearsOfCraft') }}</span>
          </div>
          <div class="story-stats">
            <div class="stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">{{ t('home.uniquePieces') }}</span>
            </div>
            <div class="stat">
              <span class="stat-number">12k+</span>
              <span class="stat-label">{{ t('home.happyClients') }}</span>
            </div>
            <div class="stat">
              <span class="stat-number">38</span>
              <span class="stat-label">{{ t('home.yearsOfExcellence') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.jewelry-home {
  width: 100%;
  overflow: hidden;
}

// ── Hero ──────────────────────────────────────────────────────────────────────
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 3rem 3.5rem;
  background: linear-gradient(135deg, $color-white 0%, $color-off-white 60%, $color-light-gray 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  min-height: 340px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(186, 160, 48, 0.06);
    pointer-events: none;
  }
}

.hero-content {
  max-width: 560px;
  position: relative;
  z-index: 1;
}

.hero-tagline {
  font-family: $font-headline;
  font-size: 0.85rem;
  letter-spacing: 2px;
  color: $color-gold;
  text-transform: uppercase;
  margin: 0 0 0.75rem;
  font-weight: 600;
}

.hero-title {
  font-family: $font-brand;
  font-size: 3.5rem;
  font-weight: 700;
  color: $color-teal;
  letter-spacing: 8px;
  margin: 0 0 0.5rem;
  line-height: 1;
}

.hero-subtitle {
  font-family: $font-headline;
  font-size: 1.5rem;
  font-weight: 400;
  color: $color-dark-brown;
  margin: 0 0 1rem;
  line-height: 1.4;
}

.hero-description {
  color: $color-text-secondary;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0 0 2rem;
  max-width: 460px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: $color-teal;
  color: $color-text-on-dark;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 6px;
  font-family: $font-headline;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: $color-primary-dark;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(23, 89, 118, 0.25);
  }
}

.btn-outline {
  background: transparent;
  color: $color-teal;
  border: 1.5px solid $color-teal;
  padding: 0.75rem 1.75rem;
  border-radius: 6px;
  font-family: $font-headline;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: $color-teal;
    color: $color-text-on-dark;
    transform: translateY(-1px);
  }
}

.hero-image-wrap {
  flex-shrink: 0;
  width: 260px;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid $color-gold;
  box-shadow: 0 8px 32px rgba(38, 28, 21, 0.18);
  margin-left: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
}

.hero-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// ── Section Common ──────────────────────────────────────────────────────────
.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-family: $font-headline;
  font-size: 1.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: $color-text-primary;
  margin: 0 0 0.4rem;
}

.section-subtitle {
  color: $color-text-secondary;
  font-size: 0.9rem;
  margin: 0;
}

// ── Collections ──────────────────────────────────────────────────────────────
.collections {
  margin-bottom: 1.5rem;
  padding: 2.5rem 2rem;
  background-color: $color-white;
  border: 1px solid $color-border;
  border-radius: 12px;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.collection-card {
  background-color: $color-off-white;
  border: 1px solid $color-border;
  border-radius: 10px;
  padding: 1.75rem 1.25rem;
  text-align: center;
  transition: all 0.25s;
  cursor: default;

  &:hover {
    border-color: $color-gold;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(186, 160, 48, 0.12);
  }
}

.collection-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  display: block;
}

.collection-name {
  font-family: $font-headline;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: $color-text-primary;
  margin: 0 0 0.5rem;
}

.collection-desc {
  color: $color-text-secondary;
  font-size: 0.82rem;
  line-height: 1.5;
  margin: 0 0 1.25rem;
}

.collection-btn {
  background: none;
  border: 1px solid $color-teal;
  color: $color-teal;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-family: $font-headline;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: $color-teal;
    color: $color-text-on-dark;
  }
}

// ── Featured Pieces ───────────────────────────────────────────────────────────
.featured {
  margin-bottom: 1.5rem;
  padding: 2.5rem 2rem;
  background-color: $color-light-gray;
  border: 1px solid $color-border;
  border-radius: 12px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.piece-card {
  background: $color-white;
  border: 1px solid $color-border;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.25s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(38, 28, 21, 0.08);
    border-color: $color-gold;
  }
}

.piece-image {
  height: 180px;
  overflow: hidden;
}

.piece-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  .piece-card:hover & {
    transform: scale(1.04);
  }
}

.piece-info {
  padding: 1rem;
}

.piece-name {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 600;
  color: $color-text-primary;
  margin: 0 0 0.25rem;
}

.piece-material {
  color: $color-text-secondary;
  font-size: 0.78rem;
  margin: 0 0 0.5rem;
}

.piece-price {
  font-weight: 700;
  color: $color-teal;
  font-size: 1rem;
  margin: 0;
}

// ── Brand Story ──────────────────────────────────────────────────────────────
.brand-story {
  margin-bottom: 1.5rem;
  padding: 3rem 2.5rem;
  background-color: $color-white;
  border: 1px solid $color-border;
  border-radius: 12px;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.story-label {
  font-family: $font-headline;
  font-size: 0.85rem;
  letter-spacing: 2px;
  color: $color-gold;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.story-title {
  font-family: $font-headline;
  font-size: 1.6rem;
  font-weight: 700;
  color: $color-text-primary;
  margin: 0 0 1.25rem;
  line-height: 1.3;
}

.story-body {
  color: $color-text-secondary;
  font-size: 0.9rem;
  line-height: 1.8;
  margin: 0 0 1rem;
}

.story-btn {
  margin-top: 0.5rem;
  display: inline-block;
}

.story-visual {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.story-badge {
  background: linear-gradient(135deg, $color-teal, $color-primary-dark);
  color: white;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  text-align: center;
  width: 100%;
  max-width: 240px;

  .badge-year {
    display: block;
    font-family: $font-headline;
    font-size: 0.78rem;
    letter-spacing: 2px;
    opacity: 0.7;
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }

  .badge-number {
    display: block;
    font-family: $font-headline;
    font-size: 3rem;
    font-weight: 700;
    color: $color-gold-light;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .badge-text {
    font-size: 0.8rem;
    opacity: 0.8;
  }
}

.story-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-family: $font-headline;
  font-size: 1.6rem;
  font-weight: 700;
  color: $color-teal;
}

.stat-label {
  font-size: 0.78rem;
  color: $color-text-secondary;
}
</style>
