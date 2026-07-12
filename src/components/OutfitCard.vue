<template>
  <div class="glass-panel outfit-card animate-fade-in" :style="{ animationDelay: `${delay}s` }">
    <!-- Card Header -->
    <div class="card-header">
      <span class="luxury-tag">Recommendation {{ index + 1 }}</span>
      <h3 class="luxury-header outfit-title">{{ getOutfitStyleName() }}</h3>
    </div>

    <!-- Wardrobe Items List -->
    <div class="items-list">
      <!-- Top -->
      <div class="item-row">
        <div class="icon-box">
          <Shirt class="item-icon" />
        </div>
        <div class="item-details">
          <span class="item-category">Top</span>
          <span class="item-name">{{ outfit.top.name }}</span>
          <div class="tags-wrapper">
            <span class="tag-color">
              <span class="color-swatch" :style="{ backgroundColor: outfit.top.color.hex }"></span>
              {{ outfit.top.color.name }}
            </span>
            <span class="tag-spec">{{ outfit.top.material.name }}</span>
            <span class="tag-spec">{{ outfit.top.fit.name }} fit</span>
          </div>
        </div>
      </div>

      <!-- Optional Layer -->
      <div v-if="outfit.layer" class="item-row">
        <div class="icon-box">
          <Layers class="item-icon" />
        </div>
        <div class="item-details">
          <span class="item-category">Layer</span>
          <span class="item-name">{{ outfit.layer.name }}</span>
          <div class="tags-wrapper">
            <span class="tag-color">
              <span class="color-swatch" :style="{ backgroundColor: outfit.layer.color.hex }"></span>
              {{ outfit.layer.color.name }}
            </span>
            <span class="tag-spec">{{ outfit.layer.material.name }}</span>
            <span class="tag-spec">{{ outfit.layer.fit.name }} fit</span>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="item-row">
        <div class="icon-box">
          <Scissors class="item-icon rotate-90" />
        </div>
        <div class="item-details">
          <span class="item-category">Bottom</span>
          <span class="item-name">{{ outfit.bottom.name }}</span>
          <div class="tags-wrapper">
            <span class="tag-color">
              <span class="color-swatch" :style="{ backgroundColor: outfit.bottom.color.hex }"></span>
              {{ outfit.bottom.color.name }}
            </span>
            <span class="tag-spec">{{ outfit.bottom.material.name }}</span>
            <span class="tag-spec">{{ outfit.bottom.fit.name }} fit</span>
          </div>
        </div>
      </div>

      <!-- Shoes -->
      <div class="item-row">
        <div class="icon-box">
          <Footprints class="item-icon" />
        </div>
        <div class="item-details">
          <span class="item-category">Footwear</span>
          <span class="item-name">{{ outfit.shoes.name }}</span>
          <div class="tags-wrapper">
            <span class="tag-color">
              <span class="color-swatch" :style="{ backgroundColor: outfit.shoes.color.hex }"></span>
              {{ outfit.shoes.color.name }}
            </span>
            <span class="tag-spec">{{ outfit.shoes.material.name }}</span>
          </div>
        </div>
      </div>

      <!-- Watch Recommendation -->
      <div class="item-row watch-row">
        <div class="icon-box watch-box">
          <Watch class="item-icon text-gold" />
        </div>
        <div class="item-details">
          <span class="item-category text-gold">Timepiece</span>
          <span class="item-name watch-name">{{ outfit.watch.type }}</span>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { Shirt, Layers, Scissors, Footprints, Watch } from '@lucide/vue';

const props = defineProps({
  outfit: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  delay: {
    type: Number,
    default: 0
  },
  occasion: {
    type: String,
    required: true
  }
});

// Create descriptive style names based on occasion & layering
const getOutfitStyleName = () => {
  const isLayered = !!props.outfit.layer;
  const occ = props.occasion.toLowerCase();
  
  if (occ === 'work') {
    return isLayered ? 'Tailored Business Casual' : 'Smart Office Minimalist';
  }
  if (occ === 'dinner') {
    return 'Refined Evening Attire';
  }
  if (occ === 'date') {
    return isLayered ? 'Contemporary Smart-Casual' : 'Polished Date Impression';
  }
  if (occ === 'party') {
    return 'Expressive Modern Edge';
  }
  return isLayered ? 'Layered Everyday Leisure' : 'Relaxed Weekend Minimalist';
};
</script>

<style scoped>
.outfit-card {
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.outfit-card:hover {
  transform: translateY(-4px) scale(1.01);
  border-color: rgba(229, 193, 88, 0.25);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.9), var(--shadow-glow);
}

.card-header {
  margin-bottom: 24px;
}

.outfit-title {
  font-size: 1.45rem;
  margin-top: 4px;
  letter-spacing: -0.01em;
}

/* Items List Styling */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-grow: 1;
}

.item-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-muted);
  flex-shrink: 0;
  margin-top: 2px;
}

.item-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

.rotate-90 {
  transform: rotate(90deg);
}

.text-gold {
  color: var(--accent-gold) !important;
}

.item-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.item-category {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  color: var(--text-muted);
}

.item-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-top: 2px;
}

/* Styling Tags */
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.tag-color, .tag-spec {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: capitalize;
}

.color-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: inline-block;
}

/* Watch Block */
.watch-row {
  background: rgba(229, 193, 88, 0.02);
  border: 1px solid rgba(229, 193, 88, 0.05);
  border-radius: 12px;
  padding: 14px;
}

.watch-box {
  background: rgba(229, 193, 88, 0.05);
  border-color: rgba(229, 193, 88, 0.15);
}

.watch-name {
  color: var(--text-primary);
  font-weight: 600;
}

</style>
