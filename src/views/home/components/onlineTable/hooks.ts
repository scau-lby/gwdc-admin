import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { useRouter, useRoute } from "vue-router";
import { onBeforeMount } from "vue";

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const id = route.query?.id ?? "";

  function toDetail(index: number | string | string[] | number[]) {
    useMultiTagsStoreHook().handleTags("push", {
      path: `/realtime/data`,
      parentPath: route.matched[0].path,
      name: "LiveData",
      query: { id: String(index) },
      meta: {
        title: { zh: `${index} - 作业数据`, en: `${index} - 作业数据` },
        showLink: false,
        dynamicLevel: 3
      }
    });
    router.push({ name: "LiveData", query: { id: String(index) } });
  }

  function initToDetail() {
    onBeforeMount(() => {
      if (id) toDetail(id);
    });
  }

  return { toDetail, initToDetail, id, router };
}
