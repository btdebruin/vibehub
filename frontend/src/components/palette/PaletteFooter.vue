<template>
  <div class="palette-footer">
    <span><kbd>↑↓</kbd> Navigate</span>
    <span class="dot">·</span>
    <span><kbd>⏎</kbd> Open</span>
    <span class="dot">·</span>
    <span><kbd>ESC</kbd> Close</span>
  </div>
</template>

<style scoped>
.palette-footer {
  display: none;
}

@media (min-width: 640px) {
  .palette-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 0.75rem;
    color: #52525B;
  }
}

.dot {
  color: #3f3f46;
}

kbd {
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  font-family: inherit;
  color: #71717A;
}
</style>
