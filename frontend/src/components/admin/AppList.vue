<template>
  <div class="app-list">
    <draggable
      v-model="localApps"
      handle=".drag-handle"
      item-key="id"
      animation="200"
      ghost-class="ghost-row"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <AdminAppRow :app="element" @delete="$emit('delete', element)" />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';
import AdminAppRow from './AdminAppRow.vue';

const props = defineProps({
  apps: { type: Array, required: true },
});

const emit = defineEmits(['reorder', 'delete']);

const localApps = ref([...props.apps]);

watch(
  () => props.apps,
  (val) => { localApps.value = [...val]; },
);

function onDragEnd() {
  emit('reorder', localApps.value.map((a) => a.id));
}
</script>

<style scoped>
.app-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

:deep(.ghost-row) {
  opacity: 0.4;
  background: rgba(99, 102, 241, 0.1);
  border: 1px dashed #6366F1 !important;
}
</style>
