<template>
  <div class="palette-input-wrap">
    <Search :size="18" class="text-zinc-500 flex-shrink-0" />
    <input
      ref="inputRef"
      :value="modelValue"
      type="text"
      placeholder="Search apps..."
      class="palette-input"
      autocomplete="off"
      spellcheck="false"
      role="combobox"
      aria-expanded="true"
      aria-controls="palette-listbox"
      aria-label="Search apps"
      :aria-activedescendant="activeDescendant || undefined"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Search } from 'lucide-vue-next';

defineProps({
  modelValue: { type: String, default: '' },
  activeDescendant: { type: String, default: null },
});
defineEmits(['update:modelValue']);

const inputRef = ref(null);

onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 50);
});
</script>

<style scoped>
.palette-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.palette-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #F4F4F5;
  font-size: 0.9375rem;
  font-family: inherit;
}

.palette-input::placeholder {
  color: #52525B;
}
</style>
