<script setup lang="ts">
const collections = [
  {
    icon: '💍',
    name: 'Rings',
    count: 24,
    description: 'Engagement, wedding bands & statement rings crafted in gold and silver.',
    tags: ['Engagement', 'Wedding', 'Statement'],
  },
  {
    icon: '📿',
    name: 'Necklaces',
    count: 18,
    description: 'Delicate chains, layered pendants and chokers for every occasion.',
    tags: ['Chains', 'Pendants', 'Chokers'],
  },
  {
    icon: '✨',
    name: 'Earrings',
    count: 31,
    description: 'From minimalist studs to dramatic hoops and drop earrings.',
    tags: ['Studs', 'Hoops', 'Drops'],
  },
  {
    icon: '⌚',
    name: 'Bracelets',
    count: 15,
    description: 'Charm bracelets, tennis bracelets and elegant bangles.',
    tags: ['Bangles', 'Charm', 'Tennis'],
  },
  {
    icon: '🌊',
    name: 'Anklets',
    count: 8,
    description: 'Delicate ankle chains and beaded styles for a relaxed look.',
    tags: ['Chains', 'Beaded', 'Boho'],
  },
  {
    icon: '🌸',
    name: 'Brooches',
    count: 12,
    description: 'Floral, geometric and vintage-inspired brooches to pin on anything.',
    tags: ['Floral', 'Geometric', 'Vintage'],
  },
  {
    icon: '🔮',
    name: 'Pendants',
    count: 20,
    description: 'Gemstone, locket and symbolic pendants to be worn close to the heart.',
    tags: ['Gemstone', 'Locket', 'Symbolic'],
  },
  {
    icon: '🎩',
    name: 'Cufflinks',
    count: 9,
    description: 'Classic and engraved cufflinks that elevate every formal look.',
    tags: ['Classic', 'Engraved', 'Novelty'],
  },
]
</script>

<template>
  <div class="collections-panel">
    <div class="panel-header">
      <h2 class="panel-title">Collections</h2>
      <p class="panel-subtitle">Browse our handcrafted jewellery by category</p>
    </div>

    <div class="collections-grid">
      <div v-for="col in collections" :key="col.name" class="collection-card">
        <div class="card-icon">{{ col.icon }}</div>
        <div class="card-body">
          <div class="card-top">
            <h3 class="card-name">{{ col.name }}</h3>
            <span class="card-count">{{ col.count }} items</span>
          </div>
          <p class="card-description">{{ col.description }}</p>
          <div class="card-tags">
            <span v-for="tag in col.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <a class="card-cta">View Collection →</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.collections-panel {
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

.collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.collection-card {
  background: $color-white;
  border: 1px solid $color-border;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 20px rgba(23, 89, 118, 0.12);
    transform: translateY(-2px);
  }
}

.card-icon {
  font-size: 2rem;
  line-height: 1;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.card-name {
  font-family: $font-headline;
  font-size: 1.2rem;
  font-weight: 700;
  color: $color-dark-brown;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.card-count {
  font-family: $font-body;
  font-size: 0.75rem;
  font-weight: 600;
  color: $color-white;
  background-color: $color-teal;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  white-space: nowrap;
}

.card-description {
  font-family: $font-body;
  font-size: 0.875rem;
  color: $color-text-secondary;
  line-height: 1.5;
  margin: 0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

.tag {
  font-family: $font-body;
  font-size: 0.7rem;
  color: $color-teal;
  background-color: rgba(23, 89, 118, 0.08);
  border: 1px solid rgba(23, 89, 118, 0.2);
  border-radius: 4px;
  padding: 0.1rem 0.45rem;
}

.card-cta {
  font-family: $font-headline;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: $color-teal;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: $color-teal-dark;
  }
}
</style>
