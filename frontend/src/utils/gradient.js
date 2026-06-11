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

// Deterministic gradient pair for a given name, used for logo fallbacks.
export function gradientFor(name) {
  return GRADIENTS[hashName(name) % GRADIENTS.length];
}
