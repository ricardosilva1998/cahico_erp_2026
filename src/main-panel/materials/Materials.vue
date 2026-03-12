<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAdminStore } from '@/stores/admin'

const { t } = useI18n()
const adminStore = useAdminStore()

function toMaterialId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

const allMaterials = [
  {
    name: 'Gold 18k',
    swatch: '#C9A84C',
    grade: '750‰',
    category: 'Metal',
    properties: ['Warm yellow lustre', 'Tarnish-resistant', 'Hypoallergenic', 'High malleability'],
    usage: 'Our most used metal for rings, pendants and chains. The 18k alloy gives a rich colour and lasting durability for everyday fine jewellery.',
  },
  {
    name: 'Gold 9k',
    swatch: '#D4A843',
    grade: '375‰',
    category: 'Metal',
    properties: ['Durable', 'Budget-friendly', 'Good scratch resistance', 'Slightly paler tone'],
    usage: 'Used for everyday earrings, bracelets and entry-level pieces. Ideal when long-term wear and affordability are the priority.',
  },
  {
    name: 'Rose Gold 18k',
    swatch: '#C07050',
    grade: '750‰ Cu alloy',
    category: 'Metal',
    properties: ['Warm pink hue', 'Copper-alloy blend', 'Romantic aesthetic', 'Durable'],
    usage: 'Favoured for rings, earrings and modern-style bracelets. The copper content gives the distinctive pink tone beloved in contemporary designs.',
  },
  {
    name: 'Sterling Silver',
    swatch: '#A8A9AD',
    grade: '925‰',
    category: 'Metal',
    properties: ['Bright white shine', 'Highly malleable', 'Affordable', 'Polishes easily'],
    usage: 'Applied to cuffs, layered necklaces and bold statement pieces. Sterling silver allows for intricate hand-engraving and textured finishes.',
  },
  {
    name: 'Platinum',
    swatch: '#D0D0D8',
    grade: '950‰',
    category: 'Metal',
    properties: ['Dense & heavy', 'Naturally white', 'Hypoallergenic', 'Never fades'],
    usage: 'Reserved for engagement rings and premium settings. Platinum holds gemstones securely and its natural whiteness never needs re-plating.',
  },
  {
    name: 'Diamond',
    swatch: '#E8F0F8',
    grade: 'VVS1 – VS2',
    category: 'Gemstone',
    properties: ['Mohs 10 — hardest gem', 'Brilliance & fire', 'GIA certified', '4C graded'],
    usage: 'Centre stones in solitaire rings and halo settings. CAHICO sources GIA-certified stones graded for cut, colour, clarity and carat.',
  },
  {
    name: 'Emerald',
    swatch: '#2E7D52',
    grade: 'AAA Grade',
    category: 'Gemstone',
    properties: ['Deep vivid green', 'Mohs 7.5', 'Natural inclusions', 'Colombian origin'],
    usage: 'Featured in statement rings and pendants. Each emerald is hand-selected for depth of colour and natural character, following traditional bezel settings.',
  },
  {
    name: 'Sapphire',
    swatch: '#1A4E8A',
    grade: 'Ceylon Blue',
    category: 'Gemstone',
    properties: ['Mohs 9', 'Vivid cornflower blue', 'Excellent hardness', 'Sri Lanka origin'],
    usage: 'Used in engagement rings and earring drops. Ceylon sapphires are prized for their bright, pure blue tone and outstanding durability.',
  },
  {
    name: 'Pearl',
    swatch: '#F0EDE5',
    grade: 'Akoya / Freshwater',
    category: 'Organic',
    properties: ['Natural lustre', '7–8 mm average', 'Nacre layered', 'AAA surface grade'],
    usage: 'Strung in necklaces and set in earrings. CAHICO uses both Akoya (high lustre, round) and freshwater (varied shapes, softer glow) pearls.',
  },
  {
    name: 'Enamel',
    swatch: '#3A8FBF',
    grade: 'Vitreous',
    category: 'Finishing',
    properties: ['Fired at 800 °C', 'Vivid colours', 'Scratch-resistant', 'Durable gloss'],
    usage: 'Applied to brooches and accent pieces. The enamel is hand-applied in layers and kiln-fired to produce a smooth, glass-like surface with lasting colour.',
  },
]

const materials = computed(() =>
  allMaterials.filter(m => adminStore.isMaterialVisible(toMaterialId(m.name)))
)
</script>

<template>
  <div class="materials-panel">
    <div class="panel-header">
      <h2 class="panel-title">{{ t('materials.title') }}</h2>
      <p class="panel-subtitle">{{ t('materials.subtitle') }}</p>
    </div>

    <div class="materials-grid">
      <div v-for="mat in materials" :key="mat.name" class="material-card">
        <div class="card-header">
          <div class="swatch" :style="{ backgroundColor: mat.swatch }"></div>
          <div class="card-titles">
            <h3 class="material-name">{{ mat.name }}</h3>
            <div class="card-badges">
              <span class="grade-badge">{{ mat.grade }}</span>
              <span class="category-badge" :class="mat.category.toLowerCase()">{{ t(`materials.categories.${mat.category.toLowerCase()}`) }}</span>
            </div>
          </div>
        </div>

        <div class="properties-list">
          <span v-for="prop in mat.properties" :key="prop" class="property-chip">{{ prop }}</span>
        </div>

        <div class="usage-section">
          <span class="usage-label">{{ t('materials.howWeUseIt') }}</span>
          <p class="usage-text">{{ mat.usage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.materials-panel {
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

.materials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.material-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: box-shadow 0.2s, background-color 0.3s, border-color 0.3s;

  &:hover {
    box-shadow: var(--shadow-card-hover);
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.swatch {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  flex-shrink: 0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15);
}

.card-titles {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.material-name {
  font-family: $font-headline;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.card-badges {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.grade-badge {
  font-family: $font-body;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--color-bg-section);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.15rem 0.5rem;
}

.category-badge {
  font-family: $font-body;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-radius: 4px;
  padding: 0.15rem 0.5rem;

  &.metal {
    background-color: color-mix(in srgb, var(--color-gold) 12%, transparent);
    color: #9A851A;
  }

  &.gemstone {
    background-color: color-mix(in srgb, var(--color-teal) 10%, transparent);
    color: var(--color-teal);
  }

  &.organic {
    background-color: var(--color-success-bg);
    color: var(--color-success);
  }

  &.finishing {
    background-color: color-mix(in srgb, var(--color-text-primary) 7%, transparent);
    color: var(--color-text-primary);
  }
}

.properties-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.property-chip {
  font-family: $font-body;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  background-color: var(--color-off-white);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 0.2rem 0.6rem;
}

.usage-section {
  border-top: 1px solid var(--color-border);
  padding-top: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.usage-label {
  font-family: $font-headline;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-gold);
}

.usage-text {
  font-family: $font-body;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.55;
  margin: 0;
}

@media (max-width: 600px) {
  .materials-panel {
    padding: 1.25rem;
  }
}
</style>
