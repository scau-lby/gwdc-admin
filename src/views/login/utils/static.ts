import { computed } from "vue";
import bg from "/@/assets/login/bg1.png";
import illustration from "/@/assets/login/illustration.svg?component";

const currentWeek = computed(() => {
  return illustration;
});

export { bg, currentWeek };
