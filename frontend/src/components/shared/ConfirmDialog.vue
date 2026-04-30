<template>
  <Teleport to="body">
    <Transition name="palette">
      <div v-if="show" class="dialog-overlay" @click.self="$emit('cancel')">
        <div class="dialog">
          <h3 class="dialog-title">{{ title }}</h3>
          <p class="dialog-body">{{ message }}</p>
          <div class="dialog-actions">
            <button class="btn-secondary" @click="$emit('cancel')">Cancel</button>
            <button class="btn-danger" @click="$emit('confirm')">{{ confirmLabel }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: 'This action cannot be undone.' },
  confirmLabel: { type: String, default: 'Delete' },
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.dialog {
  background: #18181B;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
}

.dialog-title {
  font-size: 1rem;
  font-weight: 600;
  color: #F4F4F5;
  margin: 0 0 0.5rem;
}

.dialog-body {
  font-size: 0.875rem;
  color: #A1A1AA;
  margin: 0 0 1.25rem;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
}
</style>
