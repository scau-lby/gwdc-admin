<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps({
  cruise: {
    type: Boolean,
    default: false
  },
  speed: {
    type: Number,
    default: 50
  }
});
const cruise = ref(props.cruise);
watch(
  () => props.cruise,
  val => {
    cruise.value = val;
  }
);
const speed = ref(props.speed);
watch(
  () => props.speed,
  val => {
    speed.value = val;
  }
);
const emits = defineEmits(["setControl", "setCmd", "setSpeed"]);
function emitControl(command: string) {
  emits("setControl", command);
}

function emitCmd(command: string, action: number) {
  emits("setCmd", command, action);
}

function onSpeedChange(val: number) {
  emits("setSpeed", val);
}
</script>

<template>
  <div class="remote-container">
    <div class="control-container">
      <div class="control-wrapper">
        <div class="control-btn control-left" @click="emitControl('LEFT')" />
        <div
          class="control-btn control-left-up"
          @click="emitControl('LEFT_UP')"
        />
        <div class="control-btn control-up" @click="emitControl('UP')" />
        <div
          class="control-btn control-right-up"
          @click="emitControl('RIGHT_UP')"
        />
        <div class="control-btn control-right" @click="emitControl('RIGHT')" />
        <div
          class="control-btn control-right-down"
          @click="emitControl('RIGHT_DOWN')"
        />
        <div class="control-btn control-down" @click="emitControl('DOWN')" />
        <div
          class="control-btn control-left-down"
          @click="emitControl('LEFT_DOWN')"
        />
        <div class="control-round">
          <div class="control-round-inner">
            <el-icon :size="22" style="color: #78aee4">
              <IconifyIconOffline
                icon="refresh-left"
                @click="emitCmd('LEFT', 0)"
                v-if="!cruise"
              />

              <IconifyIconOffline
                icon="pause-fill"
                @click="emitCmd('LEFT', 1)"
                v-else
              />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="cmd-container">
      <div class="cmd-wrapper">
        <div>变倍</div>
        <div class="cmd-btn-wrapper">
          <div class="cmd-btn">
            <el-icon :size="17">
              <IconifyIconOffline icon="plus" @click="emitControl('ZOOM_IN')" />
            </el-icon>
          </div>
          <div class="cmd-btn">
            <el-icon :size="17">
              <IconifyIconOffline
                icon="minus"
                @click="emitControl('ZOOM_OUT')"
              />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="cmd-wrapper">
        <div>光圈</div>
        <div class="cmd-btn-wrapper">
          <div class="cmd-btn">
            <el-icon :size="17">
              <IconifyIconOffline
                icon="plus"
                @click="emitControl('IRIS_ENLARGE')"
              />
            </el-icon>
          </div>
          <div class="cmd-btn">
            <el-icon :size="17">
              <IconifyIconOffline
                icon="minus"
                @click="emitControl('IRIS_REDUCE')"
              />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="cmd-wrapper">
        <div>聚焦</div>
        <div class="cmd-btn-wrapper">
          <div class="cmd-btn">
            <el-icon :size="17">
              <IconifyIconOffline
                icon="plus"
                @click="emitControl('FOCUS_NEAR')"
              />
            </el-icon>
          </div>
          <div class="cmd-btn">
            <el-icon :size="17">
              <IconifyIconOffline
                icon="minus"
                @click="emitControl('FOCUS_FAR')"
              />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="cmd-wrapper" style="margin-bottom: 0">
        <div>速度</div>
        <div class="cmd-btn-wrapper">
          <el-slider
            v-model="speed"
            :min="1"
            :max="100"
            @change="onSpeedChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.remote-container {
  border-radius: 5px;
  background-color: #444851;
  padding: 30px 20px;
}

.cmd-container {
  color: #fff;
  line-height: 35px;
  margin-top: 40px;
}

.cmd-wrapper {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
}

.cmd-btn-wrapper {
  display: flex;
  justify-content: space-between;
  width: 110px;
}

.cmd-btn {
  width: 30px;
  height: 30px;
  line-height: 35px;
  text-align: center;
  border-radius: 50%;
  background-color: #363b44;
  border: 1px solid #30353e;
  box-shadow: 0px 0px 6px 2px #30353e;
}

.control-container {
  background-color: #2a2e37;
  border: 2px solid #78aee4;
  border-radius: 50%;
  padding: 20px;
}

.control-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
}

.control-btn {
  position: absolute;
  width: 15%;
  height: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.3s linear;
}

.control-btn:before {
  content: "";
  position: relative;
  display: block;
  width: 16px;
  height: 16px;
  border-top: 3px solid #78aee4;
  border-right: 3px solid #78aee4;
  border-radius: 0 4px 0 0;
  box-sizing: border-box;
  z-index: 2;
}

.control-left {
  top: 50%;
  left: 0;
  transform: translateY(-50%) rotate(45deg);
  border-radius: 4px 4px 4px 100%;
}

.control-left:before {
  transform: translate(-25%, 30%) rotate(180deg);
}

.control-left-up {
  top: 20%;
  left: 20%;
  transform: translateX(-50%) translateY(-50%) rotate(-90deg);
  border-radius: 4px 100% 4px 4px;
}

.control-left-up:before {
  transform: translate(30%, -25%);
}

.control-up {
  top: 0;
  left: 50%;
  transform: translateX(-50%) rotate(-45deg);
  border-radius: 4px 100% 4px 4px;
}

.control-up:before {
  transform: translate(30%, -25%);
}

.control-right-up {
  top: 20%;
  left: 80%;
  transform: translateX(-50%) translateY(-50%) rotate(0deg);
  border-radius: 4px 100% 4px 4px;
}

.control-right-up:before {
  transform: translate(30%, -25%);
}

.control-down {
  left: 50%;
  bottom: 0;
  transform: translateX(-50%) rotate(45deg);
  border-radius: 4px 4px 100% 4px;
}

.control-down:before {
  transform: translate(25%, 25%) rotate(90deg);
}

.control-right-down {
  top: 80%;
  left: 80%;
  transform: translateX(-50%) translateY(-50%) rotate(90deg);
  border-radius: 4px 100% 4px 4px;
}

.control-right-down:before {
  transform: translate(30%, -25%);
}

.control-right {
  top: 50%;
  right: 0;
  transform: translateY(-50%) rotate(45deg);
  border-radius: 4px 100% 4px 4px;
}

.control-right:before {
  transform: translate(30%, -25%);
}

.control-left-down {
  top: 80%;
  left: 20%;
  transform: translateX(-50%) translateY(-50%) rotate(180deg);
  border-radius: 4px 100% 4px 4px;
}

.control-left-down:before {
  transform: translate(30%, -25%);
}

.control-round {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 51.2%;
  height: 51.2%;
  background: #3c454b;
  border-radius: 50%;
}

.control-round-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 70%;
  border: 2px solid #78aee4;
  border-radius: 50%;
}
</style>
