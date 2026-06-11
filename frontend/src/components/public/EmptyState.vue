<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
      <component :is="icon" :size="28" class="text-zinc-600" />
    </div>

    <template v-if="variant === 'filtered'">
      <h3 class="text-zinc-300 font-semibold text-lg mb-2">No matching apps</h3>
      <p class="text-zinc-500 text-sm max-w-xs mb-4">
        No apps in this tab match the selected tags.
      </p>
      <button type="button" class="btn-secondary" @click="$emit('clear-filter')">
        Clear filter
      </button>
    </template>

    <template v-else-if="variant === 'tab'">
      <h3 class="text-zinc-300 font-semibold text-lg mb-2">Nothing in this tab</h3>
      <p class="text-zinc-500 text-sm max-w-xs">
        Apps in other tabs are still there — or add one via
        <RouterLink to="/admin" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">/admin</RouterLink>.
      </p>
    </template>

    <template v-else>
      <h3 class="text-zinc-300 font-semibold text-lg mb-2">No apps yet</h3>
      <p class="text-zinc-500 text-sm max-w-xs">
        Go to
        <RouterLink to="/admin" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">/admin</RouterLink>
        to add your first app.
      </p>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { LayoutGrid, SearchX } from 'lucide-vue-next';

const props = defineProps({
  // 'empty' = no apps at all, 'tab' = this tab is empty, 'filtered' = tag filter matches nothing
  variant: { type: String, default: 'empty' },
});
defineEmits(['clear-filter']);

const icon = computed(() => (props.variant === 'filtered' ? SearchX : LayoutGrid));
</script>
