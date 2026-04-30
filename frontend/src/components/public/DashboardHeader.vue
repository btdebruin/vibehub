<template>
  <header class="header">
    <div class="header-inner">
      <div class="flex items-center gap-2">
        <div class="logo-mark">V</div>
        <span class="text-zinc-100 font-semibold text-lg tracking-tight">Vibehub</span>
      </div>
      <SearchTrigger />
    </div>
  </header>
</template>

<script setup>
import SearchTrigger from './SearchTrigger.vue';
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
