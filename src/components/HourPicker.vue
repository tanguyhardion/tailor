<template>
  <div class="hour-picker-container">
    <!-- Trigger Button -->
    <button 
      type="button" 
      class="picker-trigger" 
      @click="openModal"
      :aria-label="`Select hour: currently ${formattedValue}`"
    >
      <Clock class="icon-input" />
      <span class="selected-value">{{ formattedValue }}</span>
    </button>

    <!-- Semi-Modal Menu -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" class="modal-backdrop" @click="closeModal"></div>
      </Transition>
      
      <Transition name="slide-up">
        <div v-if="isOpen" class="semi-modal glass-panel" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-titles">
              <span class="luxury-tag">{{ label || 'Select Time' }}</span>
              <h3 class="modal-title">Choose Hour</h3>
            </div>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close menu">
              <X class="icon-close" />
            </button>
          </div>

          <!-- Hours Grid -->
          <div class="hours-grid">
            <button
              v-for="option in options"
              :key="option.value"
              type="button"
              class="hour-item"
              :class="{ 
                active: option.value === modelValue, 
                disabled: option.disabled 
              }"
              :disabled="option.disabled"
              @click="selectHour(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { Clock, X } from '@lucide/vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const formattedValue = computed(() => {
  const currentOption = props.options.find(opt => opt.value === props.modelValue);
  return currentOption ? currentOption.label : `${props.modelValue.toString().padStart(2, '0')}:00`;
});

const openModal = () => {
  isOpen.value = true;
  // Prevent background scrolling
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
};

const selectHour = (val) => {
  emit('update:modelValue', val);
  closeModal();
};

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.hour-picker-container {
  width: 100%;
}

.picker-trigger {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-muted);
  color: var(--text-primary);
  padding: 14px 18px 14px 48px;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  transition: var(--transition-smooth);
  outline: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  position: relative;
  text-align: left;
}

.picker-trigger:focus, .picker-trigger:hover {
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: var(--shadow-glow);
}

.icon-input {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}

.selected-value {
  font-weight: 500;
}

/* Semi-Modal Bottom Sheet */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 4, 6, 0.7);
  backdrop-filter: blur(4px);
  z-index: 100;
}

.semi-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 80vh;
  background: rgba(12, 12, 16, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-left: none;
  border-right: none;
  border-bottom: none;
  border-radius: 24px 24px 0 0;
  padding: 24px 24px 40px;
  z-index: 101;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
}

/* On wider screens, display as an elegant centered dialog instead of full width bottom sheet */
@media (min-width: 600px) {
  .semi-modal {
    bottom: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 440px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
    padding: 30px;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-top: 4px;
}

.btn-close {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-muted);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  color: var(--text-secondary);
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.15);
}

.icon-close {
  width: 16px;
  height: 16px;
}

/* Hours Grid styling */
.hours-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.hour-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-muted);
  color: var(--text-secondary);
  padding: 12px 6px;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
  text-align: center;
}

.hour-item:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.hour-item.active {
  background: var(--accent-gold-muted);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  font-weight: 600;
  box-shadow: 0 0 12px rgba(229, 193, 88, 0.15);
}

.hour-item.disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (min-width: 600px) {
  /* Scale transitions for dialog mode on desktop */
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .slide-up-enter-from,
  .slide-up-leave-to {
    opacity: 0;
    transform: translate(-50%, -45%) scale(0.96) !important;
  }
}

@media (max-width: 599px) {
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(100%);
  }
}
</style>
