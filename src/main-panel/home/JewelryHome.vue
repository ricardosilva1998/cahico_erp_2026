<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useTabManager } from '@/composables/useTabManager'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { setTab } = useTabManager()
const router = useRouter()

const collections = [
  {
    icon: '💍',
    name: 'Rings',
    description: 'From delicate bands to statement pieces — find your perfect ring.',
  },
  {
    icon: '📿',
    name: 'Necklaces',
    description: 'Elegant pendants and chains crafted in gold and silver.',
  },
  {
    icon: '✨',
    name: 'Bracelets',
    description: 'Refined bracelets for every occasion, day and night.',
  },
  {
    icon: '🌟',
    name: 'Earrings',
    description: 'From subtle studs to dramatic drops, always in style.',
  },
]

const featuredPieces = [
  { name: 'Lunar Ring', material: '18k Gold · Diamond', price: '€1,240', emoji: '💍' },
  { name: 'Marina Necklace', material: 'Sterling Silver · Pearl', price: '€680', emoji: '📿' },
  { name: 'Amber Bracelet', material: '18k Rose Gold', price: '€920', emoji: '✨' },
  { name: 'Soleil Earrings', material: '14k Gold · Topaz', price: '€540', emoji: '🌟' },
  { name: 'Dune Ring', material: 'Sterling Silver · Onyx', price: '€380', emoji: '💍' },
  { name: 'Cascade Necklace', material: '18k Gold · Emerald', price: '€1,580', emoji: '📿' },
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
        <p class="hero-tagline">✦ Handcrafted in Portugal ✦</p>
        <h1 class="hero-title">CAHICO</h1>
        <h2 class="hero-subtitle">Timeless Elegance,<br />Crafted with Love</h2>
        <p class="hero-description">
          Discover our exquisite collection of fine jewelry — each piece a story of craftsmanship,
          tradition, and enduring beauty.
        </p>
        <div class="hero-actions">
          <button class="btn-primary" @click="handleExplore">Explore Collection</button>
          <button
            v-if="!authStore.isAuthenticated"
            class="btn-outline"
            @click="handleLogin"
          >
            Sign In
          </button>
        </div>
      </div>
      <div class="hero-ornament">
        <div class="ornament-ring outer"></div>
        <div class="ornament-ring inner"></div>
        <span class="ornament-gem">◈</span>
      </div>
    </section>

    <!-- Collections Section -->
    <section class="collections">
      <div class="section-header">
        <h2 class="section-title">Our Collections</h2>
        <p class="section-subtitle">Discover pieces crafted for every moment</p>
      </div>
      <div class="collections-grid">
        <div
          v-for="collection in collections"
          :key="collection.name"
          class="collection-card"
        >
          <span class="collection-icon">{{ collection.icon }}</span>
          <h3 class="collection-name">{{ collection.name }}</h3>
          <p class="collection-desc">{{ collection.description }}</p>
          <button class="collection-btn" @click="handleExplore">Explore</button>
        </div>
      </div>
    </section>

    <!-- Featured Pieces -->
    <section class="featured">
      <div class="section-header">
        <h2 class="section-title">Featured Pieces</h2>
        <p class="section-subtitle">Curated selections from our artisans</p>
      </div>
      <div class="featured-grid">
        <div v-for="piece in featuredPieces" :key="piece.name" class="piece-card">
          <div class="piece-image">
            <span class="piece-emoji">{{ piece.emoji }}</span>
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
          <p class="story-label">Our Story</p>
          <h2 class="story-title">Where Heritage Meets Modern Beauty</h2>
          <p class="story-body">
            CAHICO was born from a deep passion for Portuguese goldsmithing traditions. For
            generations, our master artisans have shaped precious metals and gemstones into works
            of art that carry meaning — for weddings, anniversaries, milestones, and quiet
            everyday moments.
          </p>
          <p class="story-body">
            Every piece is handcrafted with intention, using ethically sourced materials and
            time-honoured techniques passed down through the centuries.
          </p>
          <button class="btn-outline story-btn" @click="handleExplore">Discover More</button>
        </div>
        <div class="story-visual">
          <div class="story-badge">
            <span class="badge-year">Est.</span>
            <span class="badge-number">1987</span>
            <span class="badge-text">Years of Craft</span>
          </div>
          <div class="story-stats">
            <div class="stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">Unique Pieces</span>
            </div>
            <div class="stat">
              <span class="stat-number">12k+</span>
              <span class="stat-label">Happy Clients</span>
            </div>
            <div class="stat">
              <span class="stat-number">38</span>
              <span class="stat-label">Years of Excellence</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Banner -->
    <section class="footer-banner">
      <p class="footer-tagline">✦ Handcrafted with love · Portugal · Since 1987 ✦</p>
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
  background: linear-gradient(135deg, $color-cream 0%, $color-beige 60%, $color-sand 100%);
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
    background: rgba(198, 166, 100, 0.08);
    pointer-events: none;
  }
}

.hero-content {
  max-width: 560px;
  position: relative;
  z-index: 1;
}

.hero-tagline {
  font-size: 0.78rem;
  letter-spacing: 2px;
  color: $color-gold;
  text-transform: uppercase;
  margin: 0 0 0.75rem;
  font-weight: 600;
}

.hero-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: $color-marine;
  letter-spacing: 8px;
  margin: 0 0 0.5rem;
  line-height: 1;
}

.hero-subtitle {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: $color-brown;
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
  background-color: $color-marine;
  color: $color-text-on-dark;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;

  &:hover {
    background-color: $color-navy;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(27, 58, 92, 0.25);
  }
}

.btn-outline {
  background: transparent;
  color: $color-marine;
  border: 1.5px solid $color-marine;
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;

  &:hover {
    background-color: $color-marine;
    color: $color-text-on-dark;
    transform: translateY(-1px);
  }
}

.hero-ornament {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 2rem;
}

.ornament-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid $color-gold;
  opacity: 0.5;

  &.outer {
    width: 160px;
    height: 160px;
    animation: rotate-slow 20s linear infinite;
  }

  &.inner {
    width: 110px;
    height: 110px;
    border-style: dashed;
    animation: rotate-slow 14s linear infinite reverse;
  }
}

.ornament-gem {
  font-size: 3rem;
  color: $color-gold;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 8px rgba(198, 166, 100, 0.4);
}

@keyframes rotate-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// ── Section Common ──────────────────────────────────────────────────────────
.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.6rem;
  color: $color-text-primary;
  margin: 0 0 0.4rem;
  letter-spacing: 1px;
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
  background-color: white;
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
  background-color: $color-cream;
  border: 1px solid $color-border;
  border-radius: 10px;
  padding: 1.75rem 1.25rem;
  text-align: center;
  transition: all 0.25s;
  cursor: default;

  &:hover {
    border-color: $color-gold;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(198, 166, 100, 0.15);
  }
}

.collection-icon {
  font-size: 2.25rem;
  display: block;
  margin-bottom: 0.75rem;
}

.collection-name {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.05rem;
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
  border: 1px solid $color-brown;
  color: $color-brown;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;

  &:hover {
    background-color: $color-brown;
    color: $color-text-on-dark;
  }
}

// ── Featured Pieces ───────────────────────────────────────────────────────────
.featured {
  margin-bottom: 1.5rem;
  padding: 2.5rem 2rem;
  background-color: $color-beige;
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
  background: white;
  border: 1px solid $color-border;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.25s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(61, 43, 31, 0.1);
    border-color: $color-gold;
  }
}

.piece-image {
  background: linear-gradient(135deg, $color-sand, $color-beige);
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.piece-emoji {
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}

.piece-info {
  padding: 1rem;
}

.piece-name {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1rem;
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
  color: $color-marine;
  font-size: 1rem;
  margin: 0;
}

// ── Brand Story ──────────────────────────────────────────────────────────────
.brand-story {
  margin-bottom: 1.5rem;
  padding: 3rem 2.5rem;
  background-color: white;
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
  font-size: 0.78rem;
  letter-spacing: 2px;
  color: $color-gold;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.story-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.6rem;
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
  background: linear-gradient(135deg, $color-marine, $color-navy);
  color: white;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  text-align: center;
  width: 100%;
  max-width: 240px;

  .badge-year {
    display: block;
    font-size: 0.78rem;
    letter-spacing: 2px;
    opacity: 0.7;
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }

  .badge-number {
    display: block;
    font-family: Georgia, 'Times New Roman', serif;
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
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: $color-marine;
}

.stat-label {
  font-size: 0.78rem;
  color: $color-text-secondary;
}

// ── Footer Banner ────────────────────────────────────────────────────────────
.footer-banner {
  text-align: center;
  padding: 1.25rem;
  background-color: $color-sand;
  border: 1px solid $color-border;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.footer-tagline {
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: $color-text-secondary;
  margin: 0;
  text-transform: uppercase;
}
</style>
