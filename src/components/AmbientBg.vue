<template>
  <div class="ambient-container" :class="[`theme-${weatherType}`]">
    <!-- Background glowing orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- Rain threads layer (active for rainy and thunder) -->
    <div v-if="weatherType === 'rainy' || weatherType === 'thunder'" class="rain-overlay">
      <div 
        v-for="n in rainCount" 
        :key="n" 
        class="weather-rain-thread" 
        :style="getRandomRainStyle()"
      ></div>
    </div>

    <!-- Lightning flash layer (only for thunder) -->
    <div v-if="weatherType === 'thunder'" class="lightning-layer">
      <div 
        v-for="n in 3" 
        :key="`bolt-${n}`" 
        class="lightning-flash" 
        :style="getLightningStyle(n)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  weatherType: {
    type: String,
    default: 'sunny', // 'sunny', 'rainy', 'cloudy', 'night', 'thunder'
    validator: (val) => ['sunny', 'rainy', 'cloudy', 'night', 'thunder'].includes(val)
  }
});

// Thunder gets heavier rain
const rainCount = computed(() => props.weatherType === 'thunder' ? 50 : 30);

// Helper to randomize the positioning and speed of falling rain threads
const getRandomRainStyle = () => {
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const duration = 0.8 + Math.random() * 0.8;
  const opacity = 0.1 + Math.random() * 0.5;
  
  return {
    left: `${left}%`,
    top: `-50px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: opacity
  };
};

// Stagger lightning flashes with different delays and durations
const getLightningStyle = (index) => {
  const delay = 1 + index * 3.5 + Math.random() * 2;
  const duration = 6 + Math.random() * 4;
  return {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};
</script>

<style scoped>
.ambient-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: #060608;
  transition: background 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  -webkit-filter: blur(140px);
  opacity: 0.25;
  transition: all 2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, background, width, height;
}

/* Animations for orbs */
@keyframes drift1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(10vw, 15vh) scale(1.2); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes drift2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-8vw, -10vh) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes drift3 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(12vw, -12vh) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
}

.orb-1 {
  top: -10%;
  left: 10%;
  width: 50vw;
  height: 50vw;
  animation: drift1 25s infinite ease-in-out;
}

.orb-2 {
  bottom: -10%;
  right: 10%;
  width: 60vw;
  height: 60vw;
  animation: drift2 30s infinite ease-in-out;
}

.orb-3 {
  top: 30%;
  left: 40%;
  width: 40vw;
  height: 40vw;
  animation: drift3 22s infinite ease-in-out;
}

/* Theme 1: Sunny (Warm Amber & Gold) */
.theme-sunny {
  background: radial-gradient(circle at top left, #0e0a05, #060608);
}
.theme-sunny .orb-1 {
  background: #d4af37;
}
.theme-sunny .orb-2 {
  background: #aa7722;
}
.theme-sunny .orb-3 {
  background: #3a2205;
}

/* Theme 2: Rainy (Cool Slate Blue & Indigo) */
.theme-rainy {
  background: radial-gradient(circle at top left, #050a12, #040406);
}
.theme-rainy .orb-1 {
  background: #1e3a5f;
}
.theme-rainy .orb-2 {
  background: #0f1c2e;
}
.theme-rainy .orb-3 {
  background: #13273a;
}

/* Theme 3: Cloudy (Muted Grey Green & Slate) */
.theme-cloudy {
  background: radial-gradient(circle at top left, #080d0d, #060608);
}
.theme-cloudy .orb-1 {
  background: #2a3c3c;
}
.theme-cloudy .orb-2 {
  background: #141f21;
}
.theme-cloudy .orb-3 {
  background: #202b28;
}

/* Theme 4: Night (Deep Midnight & Obsidian) */
.theme-night {
  background: radial-gradient(circle at top, #020205, #000000);
}
.theme-night .orb-1 {
  background: #0f1123;
  opacity: 0.15;
}
.theme-night .orb-2 {
  background: #080812;
  opacity: 0.15;
}
.theme-night .orb-3 {
  background: #0a0e1a;
  opacity: 0.1;
}

/* Theme 5: Thunder (Dark Violet & Electric Indigo) */
.theme-thunder {
  background: radial-gradient(circle at top left, #08051a, #030308);
}
.theme-thunder .orb-1 {
  background: #2d1b69;
  opacity: 0.3;
}
.theme-thunder .orb-2 {
  background: #1a0e3e;
  opacity: 0.25;
}
.theme-thunder .orb-3 {
  background: #0d1a40;
  opacity: 0.2;
}

/* Rain elements */
.rain-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Lightning layer */
.lightning-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

@keyframes lightningFlash {
  0%   { opacity: 0; }
  1%   { opacity: 0; }
  1.5% { opacity: 0.7; }
  2%   { opacity: 0; }
  2.5% { opacity: 0.5; }
  3%   { opacity: 0; }
  3.3% { opacity: 0.3; }
  3.6% { opacity: 0; }
  100% { opacity: 0; }
}

.lightning-flash {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(180, 160, 255, 0.35) 0%,
    rgba(120, 100, 220, 0.12) 30%,
    transparent 70%
  );
  animation: lightningFlash 8s infinite;
  will-change: opacity;
}
</style>
