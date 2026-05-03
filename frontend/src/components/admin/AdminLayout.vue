<template>
  <div class="min-h-screen">
    <header class="admin-header">
      <div class="admin-header-inner">
        <div class="flex items-center gap-2">
          <div class="logo-mark">V</div>
          <span class="text-zinc-100 font-semibold text-lg tracking-tight">Hermes Admin</span>
        </div>
        <RouterLink to="/" class="back-link">
          <ArrowLeft :size="16" />
          Dashboard
        </RouterLink>
      </div>
    </header>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next';
</script>

<style scoped>
.admin-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(10, 10, 15, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.admin-header-inner {
  max-width: 900px;
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

.back-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #71717A;
  text-decoration: none;
  transition: color 150ms ease-out;
  padding: 0.375rem 0.625rem;
  border-radius: 8px;
}

.back-link:hover {
  color: #A1A1AA;
  background: rgba(255, 255, 255, 0.05);
}

.admin-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
</style>
