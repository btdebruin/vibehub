<template>
  <div v-if="tags.length" class="tag-filter">
    <button
      v-for="tag in tags"
      :key="tag"
      type="button"
      class="filter-chip"
      :class="{ active: modelValue.includes(tag) }"
      :aria-pressed="modelValue.includes(tag)"
      @click="toggle(tag)"
    >
      {{ tag }}
    </button>
    <button v-if="modelValue.length" type="button" class="clear-btn" @click="$emit('update:modelValue', [])">
      Clear
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  tags: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:modelValue']);

function toggle(tag) {
  const next = props.modelValue.includes(tag)
    ? props.modelValue.filter((t) => t !== tag)
    : [...props.modelValue, tag];
  emit('update:modelValue', next);
}
</script>

<style scoped>
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  padding-bottom: 0.25rem;
}

.filter-chip {
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: rgb(113 113 122);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.filter-chip:hover {
  color: rgb(212 212 216);
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-chip.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.5);
  color: rgb(165 170 255);
}

.clear-btn {
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  color: rgb(82 82 91);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
}

.clear-btn:hover {
  color: rgb(161 161 170);
}
</style>
