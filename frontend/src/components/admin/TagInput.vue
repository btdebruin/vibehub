<template>
  <div class="tag-input" :class="{ focused }" @click="inputRef?.focus()">
    <span v-for="tag in modelValue" :key="tag" class="chip">
      {{ tag }}
      <button type="button" class="chip-remove" @click.stop="remove(tag)">×</button>
    </span>
    <div class="input-wrap">
      <input
        ref="inputRef"
        v-model="draft"
        class="text-input"
        :placeholder="modelValue.length ? '' : 'Add tags…'"
        @focus="focused = true; showDrop = true"
        @blur="onBlur"
        @keydown="onKey"
        @input="showDrop = true"
      />
      <ul v-if="showDrop && filtered.length" class="dropdown">
        <li v-for="s in filtered" :key="s" @mousedown.prevent="pick(s)">{{ s }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  suggestions: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);
const draft = ref('');
const focused = ref(false);
const showDrop = ref(false);

const filtered = computed(() => {
  const q = draft.value.trim().toLowerCase();
  return props.suggestions.filter(
    (s) => !props.modelValue.includes(s) && (!q || s.toLowerCase().includes(q))
  );
});

function normalise(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, '-');
}

function add(raw) {
  const tag = normalise(raw);
  if (tag && !props.modelValue.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag]);
  }
  draft.value = '';
}

function remove(tag) {
  emit('update:modelValue', props.modelValue.filter((t) => t !== tag));
}

function pick(s) {
  add(s);
  inputRef.value?.focus();
}

function onKey(e) {
  if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
    if (draft.value.trim()) {
      e.preventDefault();
      add(draft.value);
    }
  } else if (e.key === 'Backspace' && !draft.value && props.modelValue.length) {
    emit('update:modelValue', props.modelValue.slice(0, -1));
  } else if (e.key === 'Escape') {
    showDrop.value = false;
  }
}

// Suggestion clicks use mousedown.prevent, which keeps focus on the input,
// so blur only fires when leaving the field entirely — safe to hide directly.
function onBlur() {
  focused.value = false;
  showDrop.value = false;
  if (draft.value.trim()) add(draft.value);
}
</script>

<style scoped>
.tag-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  min-height: 2.5rem;
  padding: 0.375rem 0.625rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: text;
  transition: border-color 0.15s;
}

.tag-input.focused {
  border-color: rgba(99, 102, 241, 0.6);
  outline: none;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.35);
  border-radius: 6px;
  font-size: 0.75rem;
  color: rgb(165 170 255);
  white-space: nowrap;
}

.chip-remove {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  font-size: 0.875rem;
}

.chip-remove:hover {
  opacity: 1;
}

.input-wrap {
  position: relative;
  flex: 1;
  min-width: 100px;
}

.text-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: rgb(244 244 245);
  padding: 0;
}

.text-input::placeholder {
  color: rgb(82 82 91);
}

.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 50;
  min-width: 140px;
  max-width: calc(100vw - 2rem);
  max-height: 200px;
  overflow-y: auto;
  background: rgb(24 24 27);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.25rem;
  list-style: none;
  margin: 0;
}

.dropdown li {
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  color: rgb(161 161 170);
  border-radius: 5px;
  cursor: pointer;
}

.dropdown li:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgb(244 244 245);
}
</style>
