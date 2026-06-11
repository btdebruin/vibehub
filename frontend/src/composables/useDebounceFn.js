import { onUnmounted } from 'vue';

// Debounced wrapper with cancel/flush, auto-cancelled on component unmount.
export function useDebounceFn(fn, delay) {
  let timer = null;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };

  debounced.pending = () => timer !== null;

  // run immediately if a call is pending
  debounced.flush = (...args) => {
    if (timer !== null) {
      debounced.cancel();
      return fn(...args);
    }
  };

  onUnmounted(debounced.cancel);

  return debounced;
}
