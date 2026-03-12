<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import { useTabManager } from '@/composables/useTabManager'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const authStore = useAuthStore()
const adminStore = useAdminStore()
const { setTab } = useTabManager()
const { t } = useI18n()

const allCollections = computed(() => [
  {
    id: 'rings',
    img: 'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/299/399?1771499425',
    name: t('home.rings'),
    description: t('home.ringsDesc'),
  },
  {
    id: 'necklaces',
    img: 'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/299/399?1771500213',
    name: t('home.necklaces'),
    description: t('home.necklacesDesc'),
  },
  {
    id: 'bracelets',
    img: 'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/299/399?1771514251',
    name: t('home.bracelets'),
    description: t('home.braceletsDesc'),
  },
  {
    id: 'earrings',
    img: 'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/299/399?1771427526',
    name: t('home.earrings'),
    description: t('home.earringsDesc'),
  },
])

const collections = computed(() =>
  allCollections.value.filter(c => adminStore.isCollectionVisible(c.id))
)

const allFeaturedPieces = [
  { id: 'alfama-ring', name: 'Alfama Ring', material: '18k Gold · Diamond', price: '€1,240', img: 'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/299/399?1771499425' },
  { id: 'alfama-necklace', name: 'Alfama Necklace', material: 'Sterling Silver · Pearl', price: '€680', img: 'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/299/399?1771500213' },
  { id: 'alfama-bracelet', name: 'Alfama Bracelet', material: '18k Rose Gold', price: '€920', img: 'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/299/399?1771514251' },
  { id: 'alfama-earrings', name: 'Alfama Earrings', material: '14k Gold · Topaz', price: '€540', img: 'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/299/399?1771427526' },
  { id: 'chiado-ring', name: 'Chiado Ring', material: 'Sterling Silver · Onyx', price: '€380', img: 'https://cdnx.jumpseller.com/cahico/image/74201642/thumb/299/399?1772729926' },
  { id: 'chiado-necklace', name: 'Chiado Necklace', material: '18k Gold · Emerald', price: '€1,580', img: 'https://cdnx.jumpseller.com/cahico/image/74201707/thumb/299/399?1772730169' },
]

const featuredPieces = computed(() =>
  allFeaturedPieces.filter(p => adminStore.isFeaturedVisible(p.id))
)

function handleExplore() {
  setTab('Stock')
}

</script>

<template>
  <div class="jewelry-home">
    <!-- Hero Section -->
    <section v-if="adminStore.config.heroVisible" class="hero">
      <div class="hero-content">
        <p class="hero-tagline">{{ t('home.tagline') }}</p>
        <h1 class="hero-title">{{ t('home.title') }}</h1>
        <h2 class="hero-subtitle" v-html="t('home.subtitle').replace('\\n', '<br />')"></h2>
        <p class="hero-description">{{ t('home.description') }}</p>
        <div class="hero-actions">
          <button class="btn-primary" @click="handleExplore">{{ t('home.exploreCollection') }}</button>
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
        <router-link
          v-for="piece in featuredPieces"
          :key="piece.name"
          :to="'/product/' + piece.id"
          class="piece-card-link"
        >
          <div class="piece-card">
            <div class="piece-image">
              <img :src="piece.img" :alt="piece.name" class="piece-photo" />
            </div>
            <div class="piece-info">
              <h3 class="piece-name">{{ piece.name }}</h3>
              <p class="piece-material">{{ piece.material }}</p>
              <p class="piece-price">{{ piece.price }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Brand Story -->
    <section v-if="adminStore.config.storyVisible" class="brand-story">
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
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-off-white) 60%, var(--color-bg-section) 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  min-height: 340px;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;

  &::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(186, 160, 48, 0.06);
    background: color-mix(in srgb, var(--color-gold) 6%, transparent);
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
  color: var(--color-gold);
  text-transform: uppercase;
  margin: 0 0 0.75rem;
  font-weight: 600;
}

.hero-title {
  font-family: $font-brand;
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-teal);
  letter-spacing: 8px;
  margin: 0 0 0.5rem;
  line-height: 1;
}

.hero-subtitle {
  font-family: $font-headline;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-text-primary);
  margin: 0 0 1rem;
  line-height: 1.4;
}

.hero-description {
  color: var(--color-text-secondary);
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
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
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
    background-color: var(--color-teal-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(23, 89, 118, 0.25);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--color-teal) 25%, transparent);
  }
}

.btn-outline {
  background: transparent;
  color: var(--color-teal);
  border: 1.5px solid var(--color-teal);
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
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
    transform: translateY(-1px);
  }
}

.hero-image-wrap {
  flex-shrink: 0;
  width: 260px;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--color-gold);
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
  color: var(--color-text-primary);
  margin: 0 0 0.4rem;
}

.section-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

// ── Collections ──────────────────────────────────────────────────────────────
.collections {
  margin-bottom: 1.5rem;
  padding: 2.5rem 2rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: background-color 0.3s, border-color 0.3s;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.collection-card {
  background-color: var(--color-off-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.25s;
  cursor: default;

  &:hover {
    border-color: var(--color-gold);
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
  }
}

.collection-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 1.25rem;
  display: block;
}

.collection-name {
  font-family: $font-headline;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-primary);
  margin: 0 0 0.75rem;
}

.collection-desc {
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  line-height: 1.5;
  margin: 0 0 1.5rem;
}

.collection-btn {
  background: none;
  border: 1px solid var(--color-teal);
  color: var(--color-teal);
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
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
  }
}

// ── Featured Pieces ───────────────────────────────────────────────────────────
.featured {
  margin-bottom: 1.5rem;
  padding: 2.5rem 2rem;
  background-color: var(--color-bg-section);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: background-color 0.3s, border-color 0.3s;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.piece-card-link {
  text-decoration: none;
  color: inherit;
}

.piece-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.25s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-card-hover);
    border-color: var(--color-gold);
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
  padding: 1.25rem 1.25rem 1.5rem;
}

.piece-name {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
}

.piece-material {
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  margin: 0 0 0.5rem;
}

.piece-price {
  font-weight: 700;
  color: var(--color-teal);
  font-size: 1rem;
  margin: 0;
}

// ── Brand Story ──────────────────────────────────────────────────────────────
.brand-story {
  margin-bottom: 1.5rem;
  padding: 3rem 2.5rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: background-color 0.3s, border-color 0.3s;
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
  color: var(--color-gold);
  text-transform: uppercase;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.story-title {
  font-family: $font-headline;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 1.25rem;
  line-height: 1.3;
}

.story-body {
  color: var(--color-text-secondary);
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
  background: linear-gradient(135deg, var(--color-teal), var(--color-primary-dark));
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
    color: var(--color-gold-light);
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
  color: var(--color-teal);
}

.stat-label {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
}

// ── Mobile ──────────────────────────────────────────────────────────────────
@media (max-width: 768px) {
  .hero {
    padding: 2.5rem 1.5rem;
    text-align: center;
    justify-content: center;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-description {
    max-width: 100%;
  }

  .hero-actions {
    justify-content: center;
  }

  .collections,
  .featured,
  .brand-story {
    padding: 2rem 1.25rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
    letter-spacing: 4px;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-actions {
    flex-direction: column;

    .btn-primary,
    .btn-outline {
      width: 100%;
      text-align: center;
    }
  }

  .collections,
  .featured,
  .brand-story {
    padding: 1.5rem 1rem;
  }

  .story-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
