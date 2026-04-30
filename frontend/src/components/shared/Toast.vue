<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast-${toast.type}`"
          @click="toastStore.dismiss(toast.id)"
        >
          <CheckCircle v-if="toast.type === 'success'" :size="16" class="flex-shrink-0" />
          <AlertCircle v-else :size="16" class="flex-shrink-0" />
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { CheckCircle, AlertCircle } from 'lucide-vue-next';
import { useToastStore } from '../../stores/toast.js';

const toastStore = useToastStore();
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 200px;
  max-width: 360px;
  pointer-events: all;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.toast-success {
  background: #166534;
  border: 1px solid #16a34a;
  color: #dcfce7;
}

.toast-error {
  background: #7f1d1d;
  border: 1px solid #dc2626;
  color: #fee2e2;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 250ms ease-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
