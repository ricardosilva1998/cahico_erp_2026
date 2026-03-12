<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReviewsStore } from '@/stores/reviews'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  productId: string
}>()

const reviewsStore = useReviewsStore()
const authStore = useAuthStore()
const { t } = useI18n()

const newRating = ref(0)
const hoverRating = ref(0)
const newText = ref('')

const productReviews = computed(() => reviewsStore.getReviewsForProduct(props.productId))
const averageRating = computed(() => reviewsStore.getAverageRating(props.productId))
const reviewCount = computed(() => reviewsStore.getReviewCount(props.productId))
const canReview = computed(() => reviewsStore.canReview(props.productId))
const hasReviewed = computed(() => reviewsStore.hasReviewed(props.productId))

function submitReview() {
  if (newRating.value === 0 || !newText.value.trim()) return
  reviewsStore.addReview(props.productId, newRating.value, newText.value.trim())
  newRating.value = 0
  newText.value = ''
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function renderStars(rating: number): string {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
}
</script>

<template>
  <div class="product-reviews">
    <div class="reviews-header">
      <h3 class="reviews-title">{{ t('reviews.title') }}</h3>
      <div v-if="reviewCount > 0" class="reviews-summary">
        <span class="stars-display">{{ renderStars(averageRating) }}</span>
        <span class="avg-rating">{{ averageRating }}</span>
        <span class="review-count">({{ t('reviews.count', { count: reviewCount }) }})</span>
      </div>
      <p v-else class="no-reviews">{{ t('reviews.noReviews') }}</p>
    </div>

    <!-- Review Form -->
    <div class="review-form-section">
      <div v-if="!authStore.isAuthenticated" class="review-notice">
        {{ t('reviews.signInToReview') }}
      </div>
      <div v-else-if="hasReviewed" class="review-notice">
        {{ t('reviews.alreadyReviewed') }}
      </div>
      <div v-else-if="!reviewsStore.hasPurchased(productId)" class="review-notice">
        {{ t('reviews.onlyBuyers') }}
      </div>
      <div v-else-if="canReview" class="review-form">
        <h4 class="form-label">{{ t('reviews.writeReview') }}</h4>
        <div class="star-selector">
          <button
            v-for="star in 5"
            :key="star"
            :class="['star-btn', { filled: star <= (hoverRating || newRating) }]"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
            @click="newRating = star"
          >
            ★
          </button>
        </div>
        <textarea
          v-model="newText"
          class="review-textarea"
          :placeholder="t('reviews.placeholder')"
          rows="3"
        />
        <button
          class="btn-submit"
          :disabled="newRating === 0 || !newText.trim()"
          @click="submitReview"
        >
          {{ t('reviews.submit') }}
        </button>
      </div>
    </div>

    <!-- Review List -->
    <div v-if="productReviews.length > 0" class="reviews-list">
      <div v-for="review in productReviews" :key="review.id" class="review-card">
        <div class="review-card-header">
          <span class="review-stars">{{ renderStars(review.rating) }}</span>
          <span class="review-author">{{ review.userDisplayName }}</span>
          <span class="review-date">{{ formatDate(review.createdAt) }}</span>
        </div>
        <p class="review-text">{{ review.text }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.product-reviews {
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
}

.reviews-header {
  margin-bottom: 1.5rem;
}

.reviews-title {
  font-family: $font-headline;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.5rem;
}

.reviews-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars-display {
  color: #d4a017;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.avg-rating {
  font-weight: 700;
  color: var(--color-text-primary);
  font-size: 1rem;
}

.review-count {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.no-reviews {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.review-form-section {
  margin-bottom: 1.5rem;
}

.review-notice {
  background: var(--color-bg-alt);
  border: 1px dashed var(--color-border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-align: center;
}

.review-form {
  background: var(--color-off-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
}

.form-label {
  font-family: $font-headline;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.75rem;
}

.star-selector {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-border);
  transition: color 0.15s;
  padding: 0;
  line-height: 1;

  &.filled {
    color: #d4a017;
  }
}

.review-textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-input-border);
  border-radius: 8px;
  font-family: $font-body;
  font-size: 0.9rem;
  resize: vertical;
  background: var(--color-white);
  color: var(--color-text-primary);
  box-sizing: border-box;
  margin-bottom: 0.75rem;

  &:focus {
    outline: none;
    border-color: var(--color-teal);
  }
}

.btn-submit {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  border-radius: 8px;
  padding: 0.55rem 1.25rem;
  font-family: $font-body;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
}

.review-card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.review-stars {
  color: #d4a017;
  font-size: 0.95rem;
  letter-spacing: 1px;
}

.review-author {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.85rem;
}

.review-date {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
}

.review-text {
  color: var(--color-text-primary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 600px) {
  .product-reviews {
    padding: 1.5rem 0;
  }
}
</style>
