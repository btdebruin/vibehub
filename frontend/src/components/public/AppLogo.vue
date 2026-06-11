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
import { gradientFor } from '../../utils/gradient.js';

const props = defineProps({
  logoPath: { type: String, default: null },
  name: { type: String, required: true },
  size: { type: Number, default: 64 },
});

const imgError = ref(false);

const logoUrl = computed(() => (props.logoPath ? `/logos/${props.logoPath}` : null));

const initial = computed(() => props.name.charAt(0).toUpperCase());

const fallbackStyle = computed(() => {
  const [c1, c2] = gradientFor(props.name);
  return {
    background: `linear-gradient(135deg, ${c1}, ${c2})`,
    width: props.size + 'px',
    height: props.size + 'px',
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
  border-radius: 12px;
}
</style>
