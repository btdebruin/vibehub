<template>
  <header class="header">
    <div class="header-inner">
      <div class="flex items-center gap-2">
        <div class="logo-mark">V</div>
        <span class="text-zinc-100 font-semibold text-lg tracking-tight">Hermes</span>
      </div>

      <SegmentedControl
        :items="[{ label: 'Internal', value: 'internal' }, { label: '9to5', value: '9to5' }, { label: 'External', value: 'external' }]"
        v-model="tabStore.activeTab"
      />

      <div class="flex items-center gap-3">
        <SearchTrigger />
        <RouterLink to="/admin" class="admin-toggle" title="Admin">
          <Settings :size="18" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Settings } from 'lucide-vue-next';
import SearchTrigger from './SearchTrigger.vue';
import SegmentedControl from './SegmentedControl.vue';
import { useTabStore } from '../../stores/tab.js';

const tabStore = useTabStore();
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(10, 10, 15, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(113 113 122);
  transition: color 0.15s;
  padding: 0.25rem;
  border-radius: 6px;
}

.admin-toggle:hover {
  color: rgb(212 212 216);
}

.logo-mark {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}
</style>
