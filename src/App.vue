<template>
  <div class="app-wrapper">
    <!-- Reactive Background Blobs -->
    <AmbientBg :weatherType="currentWeatherType" />

    <!-- Brand Header -->
    <header class="app-header animate-fade-in">
      <div class="brand-container">
        <Sparkles class="brand-icon" />
        <h1 class="brand-title">T A I L O R</h1>
      </div>
      <p class="brand-tagline">Curated menswear coordinates for the discerning gentleman</p>
    </header>

    <main class="main-content">
      <!-- Form Mode -->
      <Transition name="fade-scale" mode="out-in">
        <div v-if="!submitted && !loading" class="form-wrapper">
          <PreferenceForm :loading="loading" @generate="handleGenerate" />
        </div>

        <!-- Loading State with Skeletons -->
        <div v-else-if="loading" class="loading-grid-wrapper">
          <div class="skeleton-weather glass-panel pulse"></div>
          <div class="cards-layout">
            <div v-for="i in 3" :key="i" class="skeleton-card glass-panel pulse">
              <div class="skeleton-line title"></div>
              <div class="skeleton-line category"></div>
              <div class="skeleton-line content"></div>
              <div class="skeleton-line content short"></div>
              <div class="skeleton-line watch"></div>
            </div>
          </div>
        </div>

        <!-- Results Mode -->
        <div v-else class="results-wrapper">
          <!-- Back button -->
          <div class="results-actions animate-fade-in">
            <button class="btn-text" @click="resetForm">
              <ArrowLeft class="icon-back" />
              Adjust Preferences
            </button>
          </div>

          <!-- Weather Card -->
          <WeatherCard 
            :weatherData="weather" 
            :locationName="cityInfo.name" 
            :timeLabel="formattedTimeLabel"
          />

          <!-- Recommendations Title -->
          <div class="section-title-wrapper animate-fade-in delay-2">
            <span class="luxury-tag">Curated Options</span>
            <h2 class="luxury-header results-section-title">Outfit Suggestions</h2>
          </div>

          <!-- Recommendations Grid -->
          <div class="cards-layout">
            <div 
              v-for="(outfit, idx) in recommendations" 
              :key="idx" 
              class="card-col"
            >
              <OutfitCard 
                :outfit="outfit" 
                :index="idx" 
                :delay="3 + idx * 1.5"
                :occasion="preferenceDetails.occasion"
              />
            </div>
          </div>
        </div>
      </Transition>
    </main>

    <!-- Footer -->
    <footer class="app-footer animate-fade-in delay-5">
      <p>© {{ new Date().getFullYear() }} Tailor Wardrobe. Relational styling engine.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Sparkles, ArrowLeft } from '@lucide/vue';
import AmbientBg from './components/AmbientBg.vue';
import PreferenceForm from './components/PreferenceForm.vue';
import WeatherCard from './components/WeatherCard.vue';
import OutfitCard from './components/OutfitCard.vue';
import { fetchWeather, getWeatherDescription } from './services/weather';
import { getOutfitRecommendations } from './services/recommender';

// App States
const submitted = ref(false);
const loading = ref(false);
const weather = ref(null);
const recommendations = ref([]);

const cityInfo = ref(null);
const preferenceDetails = ref(null);

// Ambient background selector
const currentWeatherType = ref('sunny');

// Formatted time description for weather display
const formattedTimeLabel = computed(() => {
  if (!preferenceDetails.value) return '';
  const dateObj = new Date(preferenceDetails.value.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  });
  const startStr = `${preferenceDetails.value.startHour.toString().padStart(2, '0')}:00`;
  const endStr = `${preferenceDetails.value.endHour.toString().padStart(2, '0')}:00`;
  return `${formattedDate}, ${startStr} - ${endStr}`;
});

// Trigger outfit generation
const handleGenerate = async (details) => {
  loading.value = true;
  preferenceDetails.value = details;
  cityInfo.value = details.city;

  try {
    // 1. Fetch weather forecast from Open-Meteo
    const weatherData = await fetchWeather(
      details.city.latitude,
      details.city.longitude,
      details.date,
      details.startHour,
      details.endHour
    );
    weather.value = weatherData;

    // 2. Set background theme based on weather type and time of day
    const desc = getWeatherDescription(weatherData.weatherCode);
    const avgHour = (details.startHour + details.endHour) / 2;
    
    // If it's late night or early morning, set night mode
    if (avgHour >= 22 || avgHour < 6) {
      currentWeatherType.value = 'night';
    } else {
      currentWeatherType.value = desc.type;
    }

    // 3. Compute clothing recommendations
    const items = getOutfitRecommendations(
      weatherData,
      details.occasion,
      details.startHour,
      details.endHour
    );
    recommendations.value = items;

    // 4. Add luxury delay for premium UX transition
    setTimeout(() => {
      loading.value = false;
      submitted.value = true;
    }, 1500);

  } catch (error) {
    console.error("Failed to generate outfit:", error);
    loading.value = false;
  }
};

const resetForm = () => {
  submitted.value = false;
  currentWeatherType.value = 'sunny';
};
</script>

<style>
/* Global Layout overrides */
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  padding: 40px 20px 20px;
  text-align: center;
}

.brand-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.brand-icon {
  width: 24px;
  height: 24px;
  color: var(--accent-gold);
}

.brand-title {
  font-family: var(--font-sans);
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.4em;
  color: var(--text-primary);
  margin-right: -0.4em; /* Compensate for letter spacing */
}

.brand-tagline {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-top: 6px;
  opacity: 0.85;
}

.main-content {
  flex-grow: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px 60px;
}

.results-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.results-actions {
  display: flex;
  justify-content: flex-start;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.btn-text {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-muted);
  transition: var(--transition-smooth);
}

.btn-text:hover {
  color: var(--accent-gold);
  border-color: rgba(229, 193, 88, 0.2);
  background: rgba(229, 193, 88, 0.05);
}

.icon-back {
  width: 16px;
  height: 16px;
}

.section-title-wrapper {
  max-width: 1000px;
  margin: 10px auto -10px;
  width: 100%;
}

.results-section-title {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-top: 2px;
}

/* Recommendations & Skeletons Grid Layout */
.cards-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

/* Skeletons */
.loading-grid-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.skeleton-weather {
  height: 140px;
  border-radius: 16px;
  width: 100%;
}

.skeleton-card {
  height: 480px;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-line {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
}

.skeleton-line.title {
  width: 60%;
  height: 24px;
  margin-bottom: 12px;
}

.skeleton-line.category {
  width: 30%;
  height: 12px;
  margin-bottom: 24px;
}

.skeleton-line.content {
  width: 100%;
  height: 50px;
  border-radius: 8px;
}

.skeleton-line.content.short {
  width: 80%;
  height: 40px;
}

.skeleton-line.watch {
  margin-top: auto;
  width: 100%;
  height: 80px;
  border-radius: 8px;
}

@keyframes pulse-anim {
  0% { opacity: 0.6; }
  50% { opacity: 0.3; }
  100% { opacity: 0.6; }
}

.pulse {
  animation: pulse-anim 1.5s infinite ease-in-out;
}

.app-footer {
  text-align: center;
  padding: 40px 20px;
  border-top: 1px solid var(--border-muted);
  font-size: 0.8rem;
  color: var(--text-muted);
  background: rgba(8, 8, 10, 0.5);
  margin-top: 40px;
}

/* Transitions */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.97) translateY(10px);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(-10px);
}
</style>
