<template>
  <div class="player-container">
    <template v-for="item in store.remoteStreams" :key="item.getId()">
      <div class="remote" :id="item.getId()" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { inject, nextTick } from "vue";
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
</script>

<style lang="scss" scoped>
.player-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.remote {
  min-width: 150px;
  flex: 1;
  margin: 0 5px 0 0;
  position: relative;
}
</style>
