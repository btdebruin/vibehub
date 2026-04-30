import { computed } from 'vue';
import Fuse from 'fuse.js';

export function useFuzzySearch(items, query) {
  const fuse = computed(
    () =>
      new Fuse(items.value, {
        keys: [
          { name: 'name', weight: 2 },
          { name: 'functionality', weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
  );

  const results = computed(() => {
    if (!query.value.trim()) return items.value;
    return fuse.value.search(query.value).map((r) => r.item);
  });

  return { results };
}
