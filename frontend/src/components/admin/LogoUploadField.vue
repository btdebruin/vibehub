<template>
  <div>
    <label class="form-label">Logo</label>

    <!-- Preview -->
    <div v-if="preview || currentLogoPath" class="logo-preview-wrap">
      <img :src="preview || `/logos/${currentLogoPath}`" alt="Logo preview" class="logo-preview-img" />
      <button type="button" class="logo-remove-btn" @click="removeLogo">
        <X :size="14" />
      </button>
    </div>

    <!-- Drop zone -->
    <div
      v-else
      class="drop-zone"
      :class="{ dragging }"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="handleDrop"
      @click="fileInput?.click()"
    >
      <Upload :size="22" class="text-zinc-600 mb-2" />
      <p class="text-sm text-zinc-500">Drop image here or <span class="text-indigo-400">browse</span></p>
      <p class="text-xs text-zinc-600 mt-1">PNG, JPG, WebP · Auto-resized to 256px</p>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Upload, X } from 'lucide-vue-next';

const props = defineProps({
  currentLogoPath: { type: String, default: null },
});

const emit = defineEmits(['change', 'remove']);

const fileInput = ref(null);
const preview = ref(null);
const dragging = ref(false);

async function handleDrop(e) {
  dragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    await processFile(file);
  }
}

async function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) await processFile(file);
}

async function processFile(file) {
  const resized = await resizeImage(file, 256);
  const url = URL.createObjectURL(resized);
  preview.value = url;
  emit('change', resized);
}

async function resizeImage(file, maxSize) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })),
        'image/jpeg',
        0.9,
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

function removeLogo() {
  preview.value = null;
  if (fileInput.value) fileInput.value.value = '';
  emit('remove');
}
</script>

<style scoped>
.logo-preview-wrap {
  position: relative;
  display: inline-block;
}

.logo-preview-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #EF4444;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.drop-zone {
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 150ms ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drop-zone:hover,
.drop-zone.dragging {
  border-color: #6366F1;
  background: rgba(99, 102, 241, 0.06);
}
</style>
