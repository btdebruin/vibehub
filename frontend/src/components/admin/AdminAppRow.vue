<template>
  <div class="app-row" :class="{ 'is-hidden': app.is_visible === false }">
    <div class="drag-handle" title="Drag to reorder">
      <GripVertical :size="18" />
    </div>

    <AppLogo :logo-path="app.logo_path" :name="app.name" :size="40" />

    <div class="app-row-info">
      <span class="app-row-name">
        {{ app.name }}
        <span v-if="app.is_visible === false" class="hidden-badge" title="Hidden from the dashboard">
          <EyeOff :size="11" />
          Hidden
        </span>
      </span>
      <span class="app-row-func">{{ app.functionality }}</span>
    </div>

    <div class="app-row-actions">
      <button
        class="btn-icon"
        :class="{ 'btn-icon-active': app.is_visible !== false }"
        :title="app.is_visible === false ? 'Hidden — click to show' : 'Visible — click to hide'"
        role="switch"
        :aria-checked="app.is_visible !== false"
        @click="$emit('toggle-visibility', app)"
      >
        <Eye v-if="app.is_visible !== false" :size="15" />
        <EyeOff v-else :size="15" />
      </button>
      <RouterLink :to="`/admin/apps/${app.id}`" class="btn-icon" title="Edit">
        <Pencil :size="15" />
      </RouterLink>
      <button class="btn-icon btn-icon-danger" title="Delete" @click="$emit('delete', app)">
        <Trash2 :size="15" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { GripVertical, Pencil, Trash2, Eye, EyeOff } from 'lucide-vue-next';
import AppLogo from '../public/AppLogo.vue';

defineProps({ app: { type: Object, required: true } });
defineEmits(['delete', 'toggle-visibility']);
</script>

<style scoped>
.app-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  transition: background 150ms ease-out;
}

.app-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* hidden apps read as muted in the overview */
.app-row.is-hidden .app-row-info,
.app-row.is-hidden :deep(.logo-container) {
  opacity: 0.5;
}

.drag-handle {
  color: #3F3F46;
  cursor: grab;
  flex-shrink: 0;
  transition: color 150ms ease-out;
  display: flex;
  align-items: center;
}

.app-row:hover .drag-handle {
  color: #71717A;
}

.drag-handle:active {
  cursor: grabbing;
}

.app-row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.app-row-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #E4E4E7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hidden-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.05rem 0.4rem;
  border-radius: 20px;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #A1A1AA;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.app-row-func {
  font-size: 0.8125rem;
  color: #71717A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-row-actions {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.05);
  color: #71717A;
  border-radius: 8px;
  padding: 0.375rem;
  transition: all 150ms ease-out;
  border: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn-icon:hover {
  color: #F4F4F5;
  background: rgba(255, 255, 255, 0.1);
}

.btn-icon-active {
  color: rgb(148 153 255);
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.btn-icon-active:hover {
  color: rgb(165 169 255);
  background: rgba(99, 102, 241, 0.22);
}

.btn-icon-danger:hover {
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}
</style>
