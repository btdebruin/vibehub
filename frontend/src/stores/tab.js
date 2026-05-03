import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTabStore = defineStore('tab', () => {
  const activeTab = ref('internal');
  function setTab(tab) { activeTab.value = tab; }
  return { activeTab, setTab };
});
