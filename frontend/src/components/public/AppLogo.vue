<template>
  <div class="logo-container" :style="{ width: size + 'px', height: size + 'px' }">
    <img
      v-if="logoUrl && !imgError"
      :src="logoUrl"
      :alt="name"
      class="logo-img"
      @error="imgError = true"
    />
    <div v-else class="logo-fallback" :style="fallbackStyle">
      {{ initial }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  logoPath: { type: String, default: null },
  name: { type: String, required: true },
  size: { type: Number, default: 64 },
});

const imgError = ref(false);

const logoUrl = computed(() => (props.logoPath ? `/logos/${props.logoPath}` : null));

const initial = computed(() => props.name.charAt(0).toUpperCase());

const GRADIENTS = [
  ['#6366F1', '#8B5CF6'],
  ['#3B82F6', '#6366F1'],
  ['#8B5CF6', '#EC4899'],
  ['#10B981', '#3B82F6'],
  ['#F59E0B', '#EF4444'],
  ['#6366F1', '#06B6D4'],
];

function hashName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h << 5) - h + name.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const fallbackStyle = computed(() => {
  const [c1, c2] = GRADIENTS[hashName(props.name) % GRADIENTS.length];
  return {
    background: `linear-gradient(135deg, ${c1}, ${c2})`,
    width: props.size + 'px',
    height: props.size + 'px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: Math.round(props.size * 0.4) + 'px',
    flexShrink: '0',
  };
});
</script>

<style scoped>
.logo-container {
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.logo-fallback {
  flex-shrink: 0;
}
</style>
