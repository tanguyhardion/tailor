<template>
  <div class="ambient-container" :class="[`theme-${weatherType}`]">
    <!-- Background glowing orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- Rain threads layer (only active when rainy) -->
    <div v-if="weatherType === 'rainy'" class="rain-overlay">
      <div 
        v-for="n in 30" 
        :key="n" 
        class="weather-rain-thread" 
        :style="getRandomRainStyle()"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  weatherType: {
    type: String,
    default: 'sunny', // 'sunny', 'rainy', 'cloudy', 'night'
    validator: (val) => ['sunny', 'rainy', 'cloudy', 'night'].includes(val)
  }
});

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

/* Rain elements */
.rain-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
