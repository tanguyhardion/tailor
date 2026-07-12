<template>
  <div class="glass-panel form-container animate-fade-in">
    <div class="form-header">
      <span class="luxury-tag">Select Preferences</span>
      <h2 class="luxury-header text-title">Tailor Your Outfit</h2>
    </div>

    <form @submit.prevent="handleSubmit" class="main-form">
      <!-- Location with autocomplete -->
      <div class="form-group relative">
        <label for="location" class="form-label">Location</label>
        <div class="input-icon-wrapper">
          <MapPin class="icon-input" />
          <input 
            type="text" 
            id="location" 
            v-model="locationQuery" 
            @input="handleLocationInput"
            @focus="showSuggestions = true"
            placeholder="Type a city (e.g. Paris, Tokyo, New York...)" 
            required 
            autocomplete="off"
          />
        </div>
        
        <!-- Suggestions Autocomplete Dropdown -->
        <Transition name="fade-slide">
          <ul v-if="showSuggestions && suggestions.length > 0" class="suggestions-list glass-panel">
            <li 
              v-for="city in suggestions" 
              :key="city.name" 
              @click="selectCity(city)"
              class="suggestion-item"
            >
              <MapPin class="icon-suggestion" />
              <span>{{ city.name }}</span>
            </li>
          </ul>
        </Transition>
      </div>

      <!-- Date Input -->
      <div class="form-group">
        <label for="date" class="form-label">Date</label>
        <div class="input-icon-wrapper">
          <Calendar class="icon-input" />
          <input 
            type="date" 
            id="date" 
            v-model="selectedDate" 
            :min="todayString"
            required 
          />
        </div>
      </div>

      <!-- Time Interval (Start / End Hours) -->
      <div class="time-range-group">
        <div class="form-group">
          <label for="start-hour" class="form-label">Start Time</label>
          <div class="input-icon-wrapper">
            <Clock class="icon-input" />
            <select id="start-hour" v-model="startHour">
              <option v-for="h in 24" :key="h-1" :value="h-1">
                {{ formatHour(h-1) }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="end-hour" class="form-label">End Time</label>
          <div class="input-icon-wrapper">
            <Clock class="icon-input" />
            <select id="end-hour" v-model="endHour">
              <option v-for="h in 24" :key="h-1" :value="h-1" :disabled="h-1 <= startHour">
                {{ formatHour(h-1) }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Occasion Chips Selector -->
      <div class="form-group">
        <label class="form-label">Occasion</label>
        <div class="chips-container">
          <button 
            type="button"
            v-for="occ in occasions" 
            :key="occ"
            class="chip-button"
            :class="{ active: selectedOccasion === occ }"
            @click="selectedOccasion = occ"
          >
            {{ capitalize(occ) }}
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn-gold w-100 mt-4" :disabled="loading">
        <span v-if="loading" class="spinner-container">
          <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
          Analyzing Wardrobe...
        </span>
        <span v-else>Generate Outfit Ideas</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { MapPin, Calendar, Clock } from '@lucide/vue';
import { searchLocations } from '../services/weather';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['generate']);

// Form states
const locationQuery = ref('Paris, France');
const selectedCity = ref({
  name: "Paris, France",
  latitude: 48.8566,
  longitude: 2.3522,
  timezone: "Europe/Paris"
});

// Default to today
const today = new Date();
const todayString = today.toISOString().split("T")[0];
const selectedDate = ref(todayString);

// Default hours
const startHour = ref(9);
const endHour = ref(17);

// Occasions list
const occasions = ['casual', 'work', 'date', 'party', 'dinner'];
const selectedOccasion = ref('casual');

// Autocomplete suggestions
const suggestions = ref([]);
const showSuggestions = ref(false);
let debounceTimeout = null;

// Search autocomplete
const handleLocationInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  
  if (locationQuery.value.trim().length < 2) {
    suggestions.value = [];
    return;
  }

  debounceTimeout = setTimeout(async () => {
    suggestions.value = await searchLocations(locationQuery.value);
  }, 350);
};

// Select a suggestion
const selectCity = (city) => {
  selectedCity.value = city;
  locationQuery.value = city.name;
  suggestions.value = [];
  showSuggestions.value = false;
};

// Formatting helpers
const formatHour = (h) => {
  return `${h.toString().padStart(2, '0')}:00`;
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Close suggestions on outside click
onMounted(() => {
  document.addEventListener('click', (e) => {
    const inputWrapper = document.querySelector('.relative');
    if (inputWrapper && !inputWrapper.contains(e.target)) {
      showSuggestions.value = false;
    }
  });
});

const handleSubmit = () => {
  if (!selectedCity.value) return;
  
  emit('generate', {
    city: selectedCity.value,
    date: selectedDate.value,
    startHour: startHour.value,
    endHour: endHour.value,
    occasion: selectedOccasion.value
  });
};
</script>

<style scoped>
.form-container {
  padding: 36px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 28px;
}

.text-title {
  font-size: 2.1rem;
  margin-top: 4px;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.main-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-input {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}

input, select {
  padding-left: 48px;
}

.relative {
  position: relative;
}

/* Autocomplete list */
.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 6px;
  z-index: 50;
  max-height: 220px;
  overflow-y: auto;
  padding: 8px 0;
  list-style: none;
  background: rgba(18, 18, 22, 0.95);
  border-color: rgba(255, 255, 255, 0.12);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: var(--transition-fast);
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--accent-gold);
}

.icon-suggestion {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

/* Time range side-by-side */
.time-range-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Chips Occasions */
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-button {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-muted);
  color: var(--text-secondary);
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.chip-button:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.chip-button.active {
  background: var(--accent-gold-muted);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  transform: scale(1.02);
}

/* Button sizing */
.w-100 {
  width: 100%;
}

.mt-4 {
  margin-top: 16px;
}

/* Transition Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Spinner */
.spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 18px;
  height: 18px;
}

.spinner .path {
  stroke: #08080a;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}
</style>
