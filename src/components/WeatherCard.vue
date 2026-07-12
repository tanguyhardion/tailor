<template>
  <div class="glass-panel weather-card animate-fade-in delay-1">
    <div class="weather-layout">
      <!-- Icon and Core Temp -->
      <div class="main-stats">
        <div class="icon-glow-wrapper" :class="[weatherType]">
          <component :is="weatherIcon" class="large-weather-icon animate-float" />
        </div>
        <div class="temp-wrapper">
          <span class="temp-value">{{ weatherData.temperature }}°C</span>
          <span class="weather-label">{{ description.label }}</span>
        </div>
      </div>

      <!-- Divider line -->
      <div class="card-divider"></div>

      <!-- Secondary Info Grid -->
      <div class="details-grid">
        <div class="detail-item">
          <Droplets class="icon-detail text-blue" />
          <div class="detail-text">
            <span class="detail-label">Precipitation</span>
            <span class="detail-value">{{ weatherData.rainProbability }}%</span>
          </div>
        </div>

        <div class="detail-item">
          <Wind class="icon-detail text-teal" />
          <div class="detail-text">
            <span class="detail-label">Wind Speed</span>
            <span class="detail-value">{{ weatherData.windSpeed }} km/h</span>
          </div>
        </div>

        <div class="detail-item">
          <MapPin class="icon-detail text-gold" />
          <div class="detail-text">
            <span class="detail-label">Location / Interval</span>
            <span class="detail-value truncate">{{ locationName }} ({{ timeLabel }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { Sun, Cloud, CloudRain, Droplets, Wind, MapPin } from 'lucide-vue-next';
import { getWeatherDescription } from '../services/weather';

const props = defineProps({
  weatherData: {
    type: Object,
    required: true // { temperature, rainProbability, windSpeed, weatherCode }
  },
  locationName: {
    type: String,
    required: true
  },
  timeLabel: {
    type: String,
    required: true
  }
});

// Resolve weather classification
const description = computed(() => {
  return getWeatherDescription(props.weatherData.weatherCode);
});

// Resolve main category ('sunny', 'rainy', 'cloudy', 'night')
const weatherType = computed(() => {
  return description.value.type;
});

// Pick matching lucide icon
const weatherIcon = computed(() => {
  switch (weatherType.value) {
    case 'sunny': return Sun;
    case 'rainy': return CloudRain;
    case 'cloudy': return Cloud;
    default: return Sun;
  }
});
</script>

<style scoped>
.weather-card {
  padding: 32px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.weather-layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

/* Main Temperature Section */
.main-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.icon-glow-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-muted);
  box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.02);
  position: relative;
}

.large-weather-icon {
  width: 42px;
  height: 42px;
}

/* Glow effects based on weather type */
.icon-glow-wrapper.sunny {
  border-color: rgba(229, 193, 88, 0.2);
  box-shadow: 0 0 30px rgba(229, 193, 88, 0.15);
}
.icon-glow-wrapper.sunny .large-weather-icon {
  color: var(--accent-gold);
}

.icon-glow-wrapper.rainy {
  border-color: rgba(96, 165, 250, 0.2);
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.15);
}
.icon-glow-wrapper.rainy .large-weather-icon {
  color: #60a5fa;
}

.icon-glow-wrapper.cloudy {
  border-color: rgba(45, 212, 191, 0.2);
  box-shadow: 0 0 30px rgba(45, 212, 191, 0.15);
}
.icon-glow-wrapper.cloudy .large-weather-icon {
  color: #2dd4bf;
}

.temp-wrapper {
  display: flex;
  flex-direction: column;
}

.temp-value {
  font-family: var(--font-sans);
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--text-primary);
}

.weather-label {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--accent-gold);
  margin-top: 4px;
}

/* Divider line */
.card-divider {
  width: 1px;
  height: 60px;
  background: var(--border-muted);
}

/* Details Grid */
.details-grid {
  display: flex;
  gap: 40px;
  flex-grow: 1;
  justify-content: flex-end;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-detail {
  width: 20px;
  height: 20px;
}

.text-blue { color: #60a5fa; }
.text-teal { color: #2dd4bf; }
.text-gold { color: var(--accent-gold); }

.detail-text {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  font-weight: 500;
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 2px;
}

.truncate {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive */
@media (max-width: 768px) {
  .weather-layout {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  .card-divider {
    display: none;
  }
  .details-grid {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    width: 100%;
  }
  .truncate {
    max-width: 100%;
  }
}
</style>
