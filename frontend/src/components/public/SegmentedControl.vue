<template>
  <div class="segmented">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="seg-btn"
      :class="{ active: modelValue === item.value }"
      :aria-pressed="modelValue === item.value"
      @click="$emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  modelValue: { type: String, required: true },
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.segmented {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}

.seg-btn {
  padding: 0.3rem 1rem;
  border-radius: 7px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgb(113 113 122);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
}

.seg-btn:hover {
  color: rgb(212 212 216);
}

.seg-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: rgb(244 244 245);
}
</style>
