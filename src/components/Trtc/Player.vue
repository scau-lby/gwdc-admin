<template>
  <div class="player-container">
    <div
      v-for="item in store.remoteStreams"
      :key="item.getId()"
      class="remote"
      :id="item.getId()"
      :style="{ width: width + 'px', height: width + 'px' }"
    />
  </div>
</template>

<script lang="ts" setup>
import { inject, nextTick, ref } from "vue";
import { useTrtcStoreHook } from "/@/store/modules/trtc";

const store = useTrtcStoreHook();

const $bus = inject("$bus");

($bus as any).on("stream-subscribed", async (event: any) => {
  const remoteStream = event.stream;
  const id = remoteStream.getId();
  const userId = remoteStream.getUserId();
  const remoteId = `${id}`;
  store.remoteStreams.push(remoteStream);
  await nextTick();
  remoteStream
    .play(remoteId)
    .then(() => {
      store.addSuccessLog(`RemoteStream play success: [${userId}]`);
    })
    .catch((error: any) => {
      store.addFailedLog(
        `RemoteStream play failed: [${userId}], error: ${error.message_}`
      );
    });

  console.log("stream-subscribed ID: ", id);
});

($bus as any).on("stream-removed", (event: any) => {
  const remoteStream = event.stream;
  const id = remoteStream.getId();
  store.remoteStreams = store.remoteStreams.filter(
    (stream: any) => stream.getId() !== id
  );
});

const props = defineProps({
  width: {
    type: Number,
    default: 260
  }
});

const width = ref(props.width);
</script>

<style lang="scss" scoped>
.player-container {
  margin-left: 5px;
  height: 260px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.remote {
  margin-right: 5px;
}
</style>
