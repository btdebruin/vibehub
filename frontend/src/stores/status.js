import { defineStore } from 'pinia';
import { ref } from 'vue';

const POLL_INTERVAL_MS = 60_000;

export const useStatusStore = defineStore('status', () => {
  // map of app id -> 'up' | 'down'; missing id = unknown (no dot shown)
  const statuses = ref({});
  let timer = null;

  async function fetchStatuses() {
    try {
      const res = await fetch('/api/status');
      if (res.ok) statuses.value = await res.json();
    } catch {
      // leave last-known statuses in place
    }
  }

  function startPolling() {
    if (timer) return;
    fetchStatuses();
    timer = setInterval(fetchStatuses, POLL_INTERVAL_MS);
  }

  function stopPolling() {
    clearInterval(timer);
    timer = null;
  }

  function statusFor(id) {
    return statuses.value[id] ?? null;
  }

  return { statuses, fetchStatuses, startPolling, stopPolling, statusFor };
});
