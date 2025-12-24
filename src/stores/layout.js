import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutStore = defineStore("layout", () => {
  const showFooter = ref(true);

  function hideFooter() {
    showFooter.value = false;
  }

  function showFooterFn() {
    showFooter.value = true;
  }

  return { showFooter, hideFooter, showFooterFn };
});
