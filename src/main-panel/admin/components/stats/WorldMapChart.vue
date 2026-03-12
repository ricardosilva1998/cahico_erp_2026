<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'

const props = defineProps<{
  countries: { country: string; count: number }[]
}>()

const { t } = useI18n()

const COUNTRY_NAMES: Record<string, string> = {
  PT: 'Portugal', ES: 'Spain', FR: 'France', DE: 'Germany',
  US: 'United States', GB: 'United Kingdom', BR: 'Brazil', IT: 'Italy',
  NL: 'Netherlands', BE: 'Belgium', CH: 'Switzerland', AT: 'Austria',
  JP: 'Japan', AU: 'Australia', CA: 'Canada',
}

const ALPHA2_TO_NUMERIC: Record<string, string> = {
  PT: '620', ES: '724', FR: '250', DE: '276',
  US: '840', GB: '826', BR: '076', IT: '380',
  NL: '528', BE: '056', CH: '756', AT: '040',
  JP: '392', AU: '036', CA: '124',
}

interface GeoFeature {
  type: string
  id: string
  properties: Record<string, unknown>
  geometry: {
    type: string
    coordinates: unknown
  }
}

const worldFeatures = ref<GeoFeature[]>([])
const hoveredCountryId = ref<string | null>(null)
const hoveredCountry = ref<{ name: string; count: number; x: number; y: number } | null>(null)
const mapLoaded = ref(false)
const mapContainer = ref<HTMLElement | null>(null)

// Zoom & pan state
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })
const panOffset = ref({ x: 0, y: 0 })

const viewTransform = computed(() => {
  return `translate(${translateX.value}, ${translateY.value}) scale(${scale.value})`
})

function handleWheel(event: WheelEvent) {
  event.preventDefault()
  const container = mapContainer.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  // Convert mouse position to SVG coordinates
  const svgWidth = 960
  const svgHeight = 480
  const containerWidth = rect.width
  const containerHeight = rect.height
  const scaleToSvg = svgWidth / containerWidth

  const svgMouseX = mouseX * scaleToSvg
  const svgMouseY = mouseY * scaleToSvg

  const zoomFactor = event.deltaY < 0 ? 1.15 : 1 / 1.15
  const newScale = Math.max(1, Math.min(8, scale.value * zoomFactor))

  if (newScale === scale.value) return

  // Adjust translation to zoom toward mouse position
  const ratio = newScale / scale.value
  translateX.value = svgMouseX - ratio * (svgMouseX - translateX.value)
  translateY.value = svgMouseY - ratio * (svgMouseY - translateY.value)
  scale.value = newScale

  clampTranslation()
}

function clampTranslation() {
  const maxTx = (scale.value - 1) * 960
  const maxTy = (scale.value - 1) * 480
  translateX.value = Math.max(-maxTx, Math.min(0, translateX.value))
  translateY.value = Math.max(-maxTy, Math.min(0, translateY.value))
}

function handlePanStart(event: MouseEvent) {
  if (scale.value <= 1) return
  isPanning.value = true
  panStart.value = { x: event.clientX, y: event.clientY }
  panOffset.value = { x: translateX.value, y: translateY.value }
}

function handlePanMove(event: MouseEvent) {
  if (!isPanning.value) return
  const container = mapContainer.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const scaleToSvg = 960 / rect.width

  translateX.value = panOffset.value.x + (event.clientX - panStart.value.x) * scaleToSvg
  translateY.value = panOffset.value.y + (event.clientY - panStart.value.y) * scaleToSvg
  clampTranslation()
}

function handlePanEnd() {
  isPanning.value = false
}

function resetZoom() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

const countryMap = computed(() => {
  const map: Record<string, number> = {}
  for (const c of props.countries) {
    const numericId = ALPHA2_TO_NUMERIC[c.country]
    if (numericId) map[numericId] = c.count
  }
  return map
})

const maxCount = computed(() => {
  return Math.max(...props.countries.map(c => c.count), 1)
})

function getCountryColor(numericId: string): string {
  const count = countryMap.value[numericId]
  if (!count) return 'var(--color-bg-alt)'
  const intensity = 0.2 + (count / maxCount.value) * 0.8
  return `rgba(23, 89, 118, ${intensity})`
}

function getCountryHoverColor(numericId: string): string {
  const count = countryMap.value[numericId]
  if (!count) return 'var(--color-bg-alt)'
  return '#1a9fd4'
}

function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] || code
}

function numericToAlpha2(numericId: string): string | undefined {
  for (const [alpha2, numeric] of Object.entries(ALPHA2_TO_NUMERIC)) {
    if (numeric === numericId) return alpha2
  }
  return undefined
}

function handleMouseEnter(event: MouseEvent, feat: GeoFeature) {
  const alpha2 = numericToAlpha2(feat.id)
  const count = countryMap.value[feat.id]
  if (!count || !alpha2) return

  hoveredCountryId.value = feat.id
  const rect = (event.currentTarget as SVGElement).closest('.map-container')!.getBoundingClientRect()
  hoveredCountry.value = {
    name: getCountryName(alpha2),
    count,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function handleMouseMove(event: MouseEvent, feat: GeoFeature) {
  if (!hoveredCountry.value) return
  const alpha2 = numericToAlpha2(feat.id)
  if (!alpha2 || !countryMap.value[feat.id]) return

  const rect = (event.currentTarget as SVGElement).closest('.map-container')!.getBoundingClientRect()
  hoveredCountry.value = {
    ...hoveredCountry.value,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function handleMouseLeave() {
  hoveredCountryId.value = null
  hoveredCountry.value = null
}

function projectPoint(lon: number, lat: number): [number, number] {
  const x = (lon + 180) * (960 / 360)
  const y = (90 - lat) * (480 / 180)
  return [x, y]
}

function coordsToPath(coords: number[][]): string {
  return coords.map((point, i) => {
    const [x, y] = projectPoint(point[0]!, point[1]!)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join('')
}

function featureToPath(feat: GeoFeature): string {
  const geom = feat.geometry as { type: string; coordinates: number[][][] | number[][][][] }
  if (geom.type === 'Polygon') {
    return (geom.coordinates as number[][][]).map(ring => coordsToPath(ring) + 'Z').join('')
  }
  if (geom.type === 'MultiPolygon') {
    return (geom.coordinates as number[][][][]).map(polygon =>
      polygon.map(ring => coordsToPath(ring) + 'Z').join('')
    ).join('')
  }
  return ''
}

onMounted(async () => {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    const topology = (await res.json()) as Topology<{ countries: GeometryCollection }>
    const geojson = feature(topology, topology.objects.countries!)
    worldFeatures.value = (geojson as unknown as { features: GeoFeature[] }).features
    mapLoaded.value = true
  } catch {
    mapLoaded.value = false
  }

  document.addEventListener('mouseup', handlePanEnd)
  document.addEventListener('mousemove', handlePanMove)
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handlePanEnd)
  document.removeEventListener('mousemove', handlePanMove)
})
</script>

<template>
  <div class="chart-card">
    <div class="chart-header">
      <h4 class="chart-title">{{ t('admin.statsUsersByCountry') }}</h4>
      <button v-if="scale > 1" class="reset-zoom-btn" @click="resetZoom">Reset zoom</button>
    </div>

    <div
      v-if="mapLoaded"
      ref="mapContainer"
      class="map-container"
      :class="{ 'is-panning': isPanning, 'is-zoomed': scale > 1 }"
      @wheel="handleWheel"
      @mousedown="handlePanStart"
    >
      <svg viewBox="0 0 960 480" class="world-map">
        <g :transform="viewTransform">
          <path
            v-for="feat in worldFeatures"
            :key="feat.id"
            :d="featureToPath(feat)"
            :fill="hoveredCountryId === feat.id ? getCountryHoverColor(feat.id) : getCountryColor(feat.id)"
            :stroke="hoveredCountryId === feat.id ? '#fff' : (countryMap[feat.id] ? '#0e3d4f' : 'var(--color-border)')"
            :stroke-width="hoveredCountryId === feat.id ? 2 : (countryMap[feat.id] ? 0.8 : 0.3)"
            :class="{ 'has-data': !!countryMap[feat.id], 'is-hovered': hoveredCountryId === feat.id }"
            @mouseenter="handleMouseEnter($event, feat)"
            @mousemove="handleMouseMove($event, feat)"
            @mouseleave="handleMouseLeave"
          />
        </g>
      </svg>

      <div
        v-if="hoveredCountry"
        class="map-tooltip"
        :style="{ left: hoveredCountry.x + 'px', top: (hoveredCountry.y - 10) + 'px' }"
      >
        <strong>{{ hoveredCountry.name }}</strong>
        <span>{{ hoveredCountry.count }} {{ hoveredCountry.count === 1 ? 'user' : 'users' }}</span>
      </div>
    </div>

    <div v-else class="map-loading">
      Loading map...
    </div>

    <!-- Legend -->
    <div class="map-legend" v-if="mapLoaded">
      <div class="legend-bar">
        <span class="legend-min">0</span>
        <div class="legend-gradient" />
        <span class="legend-max">{{ maxCount }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.chart-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.chart-title {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.reset-zoom-btn {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--color-border);
  }
}

.map-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  user-select: none;

  &.is-zoomed {
    cursor: grab;
  }

  &.is-panning {
    cursor: grabbing;
  }
}

.world-map {
  width: 100%;
  height: auto;
  display: block;

  path {
    transition: fill 0.15s, stroke-width 0.15s, stroke 0.15s;

    &.has-data {
      cursor: pointer;

      &.is-hovered {
        filter: drop-shadow(0 0 4px rgba(26, 159, 212, 0.5));
      }
    }
  }
}

.map-tooltip {
  position: absolute;
  transform: translate(-50%, -100%);
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  font-size: 0.8rem;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  strong {
    font-size: 0.85rem;
  }

  span {
    font-size: 0.75rem;
    opacity: 0.85;
  }
}

.map-loading {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 3rem 0;
  font-size: 0.9rem;
}

.map-legend {
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
}

.legend-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.legend-gradient {
  width: 120px;
  height: 10px;
  border-radius: 3px;
  background: linear-gradient(to right, rgba(23, 89, 118, 0.2), rgba(23, 89, 118, 1));
}

.legend-min,
.legend-max {
  font-weight: 600;
}
</style>
