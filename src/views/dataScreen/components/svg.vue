<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { gsap } from "gsap";
let tl = null;
nextTick(() => {
  tl = gsap.timeline();
});
const props = defineProps({
  abdcll: {
    type: String,
    default: ""
  },
  abdclllj: {
    type: String,
    default: ""
  },
  qsll: {
    type: String,
    default: ""
  },
  qslj: {
    type: String,
    default: ""
  },
  yw: {
    type: Number,
    default: 100
  }
});
const abdcll = ref(props.abdcll);
watch(
  () => props.abdcll,
  val => {
    if (val) {
      abdcll.value = val;
    }
  }
);
const abdclllj = ref(props.abdclllj);
watch(
  () => props.abdclllj,
  val => {
    if (val) {
      abdclllj.value = val;
    }
  }
);
const qsll = ref(props.qsll);
watch(
  () => props.qsll,
  val => {
    if (val) {
      qsll.value = val;
    }
  }
);
const qslj = ref(props.qslj);
watch(
  () => props.qslj,
  val => {
    if (val) {
      qslj.value = val;
    }
  }
);
const yw = ref("0");
watch(
  () => props.yw,
  val => {
    console.log(val);
    yw.value = val.toFixed(3);
    tl.to("#yw3", { scaleY: val / 100, duration: 1 });
  }
);
</script>
<template>
  <svg
    version="1.1"
    id="设备设施"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width="100%"
    height="100%"
    viewBox="420 80 1100 675"
    xml:space="preserve"
  >
    <g id="计量罐_1_">
      <path
        class="st0"
        d="M582,317.7l4.2,74.3c0,0-1.7,8.3,8,8.3h217.4c0,0,8.6,0.2,9.3-9.3l3.7-73.4c0,0,2.1-2.9-4.8-6.4l-30.3-15.6c0,0-2.6-1.9-7.5-1.9H624.6c0,0-3.7-0.8-9.4,2.3l-29.5,16c0,0-4.1,1.3-3.8,4.9L582,317.7z"
      />
      <path
        class="st1"
        d="M685.3,399.4h-88.7c-1.2,0-2.3-1-2.3-2.3v-77.7c0-1.2,1-2.3,2.3-2.3h88.7c1.2,0,2.3,1,2.3,2.3V397C687.6,398.3,686.5,399.4,685.3,399.4z"
      />
      <path
        class="st1"
        id="yw2"
        style="fill: #0000ff"
        d="M685.3,399.4h-88.7c-1.2,0-2.3-1-2.3-2.3v-77.7c0-1.2,1-2.3,2.3-2.3h88.7c1.2,0,2.3,1,2.3,2.3V397C687.6,398.3,686.5,399.4,685.3,399.4z"
      />
      <path
        class="st1"
        d="M806.2,399.4h-88.7c-1.2,0-2.3-1-2.3-2.3v-77.7c0-1.2,1-2.3,2.3-2.3h88.7c1.2,0,2.3,1,2.3,2.3V397C808.5,398.3,807.5,399.4,806.2,399.4z"
      />
      <path
        class="st1"
        id="yw1"
        style="fill: #0000ff"
        d="M806.2,399.4h-88.7c-1.2,0-2.3-1-2.3-2.3v-77.7c0-1.2,1-2.3,2.3-2.3h88.7c1.2,0,2.3,1,2.3,2.3V397C808.5,398.3,807.5,399.4,806.2,399.4z"
      />
      <path
        class="st2"
        d="M620,298.4L598,312.1c0,0-3.1,1.2,0,1.2h210.5c0,0,4.7,0.5-0.7-2.1l-22.6-12.9c0,0,0.2-0.9-5.4-0.9H621.7C621.7,297.5,620.9,297.9,620,298.4L620,298.4z"
      />
      <path
        class="st3"
        d="M643.2,303.2c0,0-3.8,0-3.1,2.3c0.6,2.3,4.9,4.2,4.9,4.2s34.2,0.6,37.8,0c3.7-0.6,7.9-3.1,3.1-4.9c-4.9-1.8-33.9-3.3-37.9-3.1C643.8,301.7,643.2,303.2,643.2,303.2z"
      />
      <path
        class="st4"
        d="M735,302.8l-7.2,0.6c0,0-6.7-0.7-9,2c-2.3,2.8,8.9,3.5,9.7,3.5c0.7,0,18.4,1,18.4,1h10c0,0,8.8-0.9,8.4-3.6c-0.4-2.7-6.8-4-13-3.6c-6.2,0.5-11.3-0.1-11.3-0.1L735,302.8z"
      />
      <path
        class="st5"
        d="M669.3,400.1l0.7,10.6c0,0-0.4,1.2,4,1.2h58c0,0,3.3,0.7,4.1-1.4l0.4-10.5l-67.1-0.6C669.3,399.4,669.3,400.1,669.3,400.1z"
      />
      <polygon
        class="st5"
        points="703.4,297.5 702,313.4 700.1,313.3 701.7,297.5"
      />
    </g>
    <g id="混浆罐_1_">
      <path
        class="st5"
        d="M1038.5,352.1l2.7,44c0,0-0.2,1.7,3.8,5.3l30.7,31.9c0,0,6.1,6,19.2,6.8h49.5c0,0,11.6-0.4,19-7.4l30.8-31.1c0,0,4.7-3.3,5-7.5c0.3-4.3,1.8-42.1,1.8-42.1L1038.5,352.1L1038.5,352.1L1038.5,352.1z"
      />
      <path class="st6" d="M1069.2,356l1.5,47.1c-22.5-0.2-27.1-3.5-27.1-3.5" />
      <line class="st6" x1="1105" y1="440.1" x2="1070.7" y2="402.9" />
      <polyline class="st6" points="1169,356.3 1167,404.6 1134.3,440.1 " />
      <path class="st6" d="M1197.4,397.7c0,0-0.4,4.3-30.4,6.8" />
      <path
        class="st1"
        d="M1146.3,435.8h-52.4c-1.2,0-2.1-1-2.1-2.2v-73.2c0-1.2,0.9-2.2,2.1-2.2h52.4c1.2,0,2.1,1,2.1,2.2v73.2C1148.4,434.8,1147.5,435.8,1146.3,435.8z"
      />
      <path
        class="st1"
        id="yw3"
        style="fill: #999999"
        d="M1146.3,435.8h-52.4c-1.2,0-2.1-1-2.1-2.2v-73.2c0-1.2,0.9-2.2,2.1-2.2h52.4c1.2,0,2.1,1,2.1,2.2v73.2C1148.4,434.8,1147.5,435.8,1146.3,435.8z"
      />
      <path class="st1" d="M1038.9,351.3" />
      <path
        class="st7"
        d="M1200.7,351.3c0,0,3,4.6-36.1,4.9h-97.3c0,0-26,0.4-28.9-4.9c0,0-1.5-4.9,20.2-6.3h113.8c0,0,25.6,0.8,28.3,5.6L1200.7,351.3z"
      />
      <path
        class="st5"
        d="M1136.5,334.9V351c0,0,15.2,9,33.7,0l0.5-16.1v-4.1c0,0-14.7-6.9-34.2,0v0.9L1136.5,334.9L1136.5,334.9z"
      />
      <path class="st6" d="M1136.5,334.9c0,0,19.9,3.1,34.2,0" />
      <path class="st6" d="M1136.5,331.8c0,0,18.8,3.8,34.2,0.6" />
      <path
        class="st5"
        d="M1138.4,309.4c0,0,6.9,1.7,7.9,6v5.1l1.2,0.5v9.6c0,0,5.2,3.7,13.2,0v-9.1l1.7-1v-5.2c0,0,1.8-11.9-8.9-17.6c0,0-5.5-4-13.7-3.3c0,0-2.8,3.8-3.4,14.3L1138.4,309.4z"
      />
      <line class="st8" x1="1151.5" y1="296.5" x2="1142.3" y2="310.9" />
      <polyline
        class="st9"
        points="1153.6,297.6 1146.2,309.3 1146.9,309.8 1157.9,301.9 "
      />
      <line class="st8" x1="1147.8" y1="310.5" x2="1160.9" y2="306.8" />
      <line class="st8" x1="1161.7" y1="308.7" x2="1145.7" y2="314" />
      <line class="st8" x1="1146.9" y1="314.9" x2="1162.5" y2="315.2" />
      <line class="st8" x1="1147.6" y1="321" x2="1160.8" y2="321.4" />
      <line class="st8" x1="1145.2" y1="294.5" x2="1141.9" y2="309.8" />
      <line class="st10" x1="1055.5" y1="316.8" x2="1057.3" y2="345.2" />
      <line class="st10" x1="1045.5" y1="316.6" x2="1047" y2="346.4" />
      <polyline class="st11" points="1079.7,312.1 1144.1,312.1 1146.2,309.8 " />
      <polyline class="st10" points="1092.6,312.1 1093.2,337 1093.4,345.2 " />
      <line class="st10" x1="1136.5" y1="337.1" x2="1093.2" y2="337" />
      <path
        class="st10"
        d="M1056.9,338.4c0,0-10.7-2.4-16.6,3c0,0-2.6,0.8,5.8,3"
      />
      <path
        class="st10"
        d="M1069.4,311.3c0,0-21.5-0.8-32,1.9l-0.6,0.8c1.1,3.5,21.1,2.8,21.1,2.8"
      />
      <path
        class="st12"
        d="M1171,334.9c0,0,7.2-2.9,9-4.1c0,0,6.6-4.7,8.4-6.9l5.6-2.7l-5.6-10.2l2.7-1.8l-1.6-2l7.6-6l-0.6-0.8l-2.1,1.3c0,0-11-0.3-5.4-10.5l1.6-1.6l-2.6-4.6l12-6.2l2.9,4.7l1.7-0.6l0.5,0.8l-1.4,2.2l5.3,8.1v1.4l5.1-3.1l8.5-3.8c0,0,4.4-0.8,3,3.9l-10.5,6.3l-0.9-0.6l-2.5,1.1l1.1,1l5.8,2.7c0,0-0.1,2.4-0.7,3.2c-0.6,0.8-1.5,1.4-1.5,1.4s2.5,2,2.1,5.6l-0.6,2.8l9.4-5.5l2.2,2.7l4.1-2.7l7.5,10.7l-4.9,2.5l-2.9-3.6l-7.5,3.3l3.4,6.3l-3.1,2.1l-5.2-9.5l6.7-3.7l-1-1.7l-10.2,5.3c0,0-1.7,6.4-8,7.2l1.5,3.4c0,0-2,2.8-6.3,3.8l-5.5,1.1c0,0-8.1,0.5-11.8,1.9l-9.3,5.3h-6.2L1171,334.9z"
      />
      <line class="st6" x1="1175.6" y1="332.9" x2="1180.9" y2="342.4" />
      <line class="st6" x1="1180" y1="330.8" x2="1186.1" y2="339.5" />
      <line class="st6" x1="1188.3" y1="323.9" x2="1196.8" y2="337.7" />
      <path class="st13" d="M1204.3,312.1c0,0,9-4.3,13.4-5.9" />
      <line class="st13" x1="1201.8" y1="306.8" x2="1214.2" y2="301.1" />
      <polyline class="st14" points="1214.3,292.3 1217,296.9 1217.3,297.4 " />
      <line class="st13" x1="1191.8" y1="291.6" x2="1196.4" y2="300.5" />
      <path
        class="st15"
        d="M1201,306.2c0,0-5.6,1-6.9,3.6l4.7,7.4c0,0,1.5-2.8,4.9,0l1.4-4L1201,306.2z"
      />
    </g>
    <g id="line_1_">
      <line
        id="V6_x5F_line_2_"
        class="st16"
        x1="732.1"
        y1="411.6"
        x2="732.1"
        y2="508"
      />
      <line
        id="V5_x5F_line_2_"
        class="st16"
        x1="674.3"
        y1="411.6"
        x2="674.3"
        y2="505.4"
      />
      <line
        id="V5_x5F_V6_x5F_line_2_"
        class="st16"
        x1="732.1"
        y1="505.4"
        x2="673.4"
        y2="505.4"
      />
      <line
        id="V12_x5F_line_x5F_2_2_"
        class="st16"
        x1="732.1"
        y1="586.9"
        x2="732.1"
        y2="505.4"
      />
      <line
        id="V12_x5F_line_2_"
        class="st16"
        x1="892.5"
        y1="586.1"
        x2="731.3"
        y2="586.1"
      />
      <line
        id="V7_x5F_line_2_"
        class="st16"
        x1="674.3"
        y1="505.4"
        x2="674.3"
        y2="667.6"
      />
      <line
        id="V8_x5F_line_2_"
        class="st16"
        x1="597.1"
        y1="399.4"
        x2="597.1"
        y2="492.3"
      />
      <line
        id="V9_x5F_line_x5F_2_2_"
        class="st16"
        x1="603.3"
        y1="525.6"
        x2="603.3"
        y2="667.6"
      />
      <line
        id="V9_x5F_line_x5F_1_1_"
        class="st16"
        x1="674.3"
        y1="667.6"
        x2="601.5"
        y2="667.6"
      />
      <line
        id="V11_x5F_line_x5F_1_2_"
        class="st16"
        x1="515.6"
        y1="415.1"
        x2="596.3"
        y2="415.1"
      />
      <line
        id="V11_x5F_line_x5F_2_2_"
        class="st16"
        x1="516.5"
        y1="705.3"
        x2="516.5"
        y2="415.1"
      />
      <line
        id="V11_x5F_line_x5F_3_2_"
        class="st16"
        x1="981.1"
        y1="705.3"
        x2="515.6"
        y2="705.3"
      />
      <line
        id="V11_x5F_line_x5F_4_2_"
        class="st16"
        x1="980.2"
        y1="676.3"
        x2="980.2"
        y2="705.3"
      />
      <line
        id="out_x5F_pump_x5F_1_2_"
        class="st16"
        x1="541"
        y1="586.9"
        x2="603.3"
        y2="586.9"
      />
      <line
        id="out_x5F_pump_x5F_2_2_"
        class="st16"
        x1="541.9"
        y1="548.4"
        x2="541.9"
        y2="627.3"
      />
      <line
        id="V10_x5F_line_2_"
        class="st16"
        x1="674.3"
        y1="667.6"
        x2="752.3"
        y2="667.6"
      />
      <line
        id="water_x5F_valve_x5F_line_x5F_3_2_"
        class="st16"
        x1="784.7"
        y1="676.3"
        x2="1363.3"
        y2="676.3"
      />
      <line
        id="V13_x5F_line_2_"
        class="st16"
        x1="964.4"
        y1="586.1"
        x2="1280.5"
        y2="586.1"
      />
      <line
        id="cir_x5F_pump_x5F_line_2_"
        class="st16"
        x1="1089.8"
        y1="564.6"
        x2="1089.8"
        y2="586.5"
      />
      <line
        id="V14_x5F_line_2_"
        class="st16"
        x1="1095.9"
        y1="530.8"
        x2="1095.9"
        y2="439.7"
      />
      <line
        id="V15_x5F_line_2_"
        class="st16"
        x1="1147.6"
        y1="439.7"
        x2="1147.6"
        y2="485.3"
      />
      <line
        id="V17_x5F_line_2_"
        class="st16"
        x1="1229.1"
        y1="329.2"
        x2="1229.1"
        y2="586.1"
      />
      <line
        id="V16_x5F_line_2_"
        class="st16"
        x1="1280.5"
        y1="351.1"
        x2="1280.5"
        y2="586.1"
      />
      <line
        id="V18_x5F_line_2_"
        class="st16"
        x1="1201.1"
        y1="352"
        x2="1363.3"
        y2="352"
      />
      <line
        id="water_x5F_valve_x5F_line_x5F_1_2_"
        class="st16"
        x1="1362.4"
        y1="324"
        x2="1362.4"
        y2="676.3"
      />
      <line
        id="water_x5F_valve_x5F_line_x5F_2_2_"
        class="st16"
        x1="1237.9"
        y1="324"
        x2="1363.3"
        y2="324"
      />
      <line
        id="cem_x5F_value_x5F_line_2_"
        class="st16"
        x1="1218.6"
        y1="302.9"
        x2="1371.1"
        y2="302.9"
      />
      <line
        id="V20_x5F_line_2_"
        class="st16"
        x1="1370.3"
        y1="244.2"
        x2="1370.3"
        y2="302.9"
      />
      <line
        id="V19_x5F_line_2_"
        class="st16"
        x1="1316.8"
        y1="244.2"
        x2="1316.8"
        y2="303.8"
      />
      <line
        id="V1_x5F_line_x5F_1_2_"
        class="st16"
        x1="629.6"
        y1="225.8"
        x2="703.2"
        y2="225.8"
      />
      <line
        id="V2_x5F_line_x5F_1_2_"
        class="st16"
        x1="778.6"
        y1="225.8"
        x2="703.2"
        y2="225.8"
      />
      <line
        id="V1_x5F_V2_x5F_line_2_"
        class="st16"
        x1="703.2"
        y1="278.4"
        x2="703.2"
        y2="225.8"
      />
      <line
        id="V3_x5F_line_x5F_1_2_"
        class="st16"
        x1="595.4"
        y1="278.4"
        x2="703.2"
        y2="278.4"
      />
      <line
        id="V4_x5F_line_x5F_1_2_"
        class="st16"
        x1="805.8"
        y1="278.4"
        x2="703.2"
        y2="278.4"
      />
      <line
        id="V4_x5F_line_x5F_2_2_"
        class="st16"
        x1="804.9"
        y1="303.8"
        x2="804.9"
        y2="278.4"
      />
      <line
        id="V4_x5F_line_x5F_3_2_"
        class="st16"
        x1="805.8"
        y1="399.4"
        x2="805.8"
        y2="459.8"
      />
      <line
        id="out_x5F_1_2_"
        class="st16"
        x1="778.6"
        y1="459.8"
        x2="837.3"
        y2="459.8"
      />
      <line
        id="V3_x5F_line_x5F_2_2_"
        class="st16"
        x1="596.3"
        y1="277.5"
        x2="596.3"
        y2="306.4"
      />
      <line
        id="V2_x5F_line_x5F_2_2_"
        class="st16"
        x1="777.7"
        y1="224.9"
        x2="777.7"
        y2="242.4"
      />
      <line
        id="V1_x5F_line_x5F_2_2_"
        class="st16"
        x1="630.4"
        y1="224.5"
        x2="630.4"
        y2="242"
      />
      <polygon class="st17" points="630.4,254.7 636.1,238.5 624.8,238.5 " />
      <polygon class="st17" points="777.7,254.7 783.4,238.5 772,238.5 " />
      <rect x="834.7" y="453.7" class="st18" width="5.3" height="13.1" />
      <rect x="795.2" y="159.2" class="st18" width="5.3" height="13.1" />
      <rect x="772.5" y="453.7" class="st18" width="5.3" height="13.1" />
      <rect x="534.9" y="624.6" class="st18" width="13.1" height="5.3" />
      <rect x="535.8" y="544" class="st18" width="13.1" height="5.3" />
      <rect x="1363.3" y="239.8" class="st18" width="13.1" height="5.3" />
      <rect x="1309.8" y="238.9" class="st18" width="13.1" height="5.3" />
      <polygon class="st17" points="1317.1,236.3 1322.8,220.1 1311.4,220.1 " />
      <polygon class="st17" points="1370.4,237.2 1376.1,221 1364.7,221 " />
      <polygon class="st17" points="542.2,542.2 547.9,526 536.5,526 " />
      <polygon class="st17" points="842.6,459.7 858.8,465.4 858.8,454 " />
      <polygon class="st17" points="769.8,459.7 753.6,454 753.6,465.4 " />
      <polygon class="st17" points="541.3,632.5 535.6,648.7 547,648.7 " />
      <line class="st19" x1="878.1" y1="313.9" x2="878.1" y2="531.3" />
      <line class="st19" x1="898.7" y1="530" x2="876.8" y2="530" />
      <line class="st19" x1="981.1" y1="531.7" x2="999.5" y2="531.7" />
      <line class="st19" x1="997.7" y1="165.3" x2="997.7" y2="530.8" />
      <line class="st19" x1="847" y1="313.5" x2="879.4" y2="313.5" />
      <polygon class="st17" points="830.3,313.2 846.5,318.9 846.5,307.5 " />
      <polygon class="st17" points="1147.7,501 1153.4,484.8 1142,484.8 " />
      <g id="sup_x5F_pump_x5F_in_2_">
        <circle id="pump_x5F_1_4_" class="st20" cx="604.2" cy="512.4" r="2.2" />
        <line class="st21" x1="604.2" y1="509.4" x2="604.2" y2="503.2" />
        <line class="st21" x1="604.2" y1="521.6" x2="604.2" y2="515.5" />
        <line class="st21" x1="607.2" y1="512.4" x2="613.4" y2="512.4" />
        <line class="st21" x1="601.1" y1="512.4" x2="594.9" y2="512.4" />
        <line class="st21" x1="607.3" y1="509.7" x2="611.6" y2="505.4" />
        <line class="st21" x1="597" y1="519.4" x2="601.3" y2="515.1" />
        <line class="st21" x1="606.7" y1="514.4" x2="611" y2="518.7" />
        <line class="st21" x1="597" y1="505.6" x2="601.3" y2="509.9" />
      </g>
      <g id="sup_x5F_pump_x5F_out_2_">
        <circle class="st19" cx="603.9" cy="512.2" r="12.5" />
        <line class="st19" x1="591" y1="493.1" x2="602.4" y2="493.1" />
        <line class="st19" x1="600.6" y1="499.3" x2="600.6" y2="493.1" />
        <line
          id="pump_x5F_1_1_"
          class="st19"
          x1="592.8"
          y1="506.3"
          x2="592.8"
          y2="493.1"
        />
      </g>
      <g>
        <line class="st21" x1="1093" y1="541.2" x2="1088.6" y2="536.8" />
        <circle
          id="pump_x5F_2_4_"
          class="st20"
          cx="1095.5"
          cy="543.1"
          r="2.2"
        />
        <line class="st21" x1="1095.5" y1="546.2" x2="1095.5" y2="552.3" />
        <line class="st21" x1="1095.5" y1="533.9" x2="1095.5" y2="540" />
        <line class="st21" x1="1092.4" y1="543.1" x2="1086.3" y2="543.1" />
        <line class="st21" x1="1098.5" y1="543.1" x2="1104.7" y2="543.1" />
        <line class="st21" x1="1092.4" y1="545.8" x2="1088" y2="550.1" />
        <line class="st21" x1="1102.6" y1="536.1" x2="1098.3" y2="540.5" />
        <line class="st21" x1="1102.6" y1="549.9" x2="1098.3" y2="545.6" />
      </g>
      <g id="cyc_x5F_pump_x5F_shell_2_">
        <circle class="st19" cx="1095.7" cy="543.3" r="12.5" />
        <line class="st19" x1="1093.3" y1="556.7" x2="1093.3" y2="562.8" />
        <line class="st19" x1="1095.5" y1="564.1" x2="1084.1" y2="564.1" />
        <line
          id="pump_x5F_2_1_"
          class="st19"
          x1="1086.3"
          y1="551.9"
          x2="1086.3"
          y2="562.8"
        />
      </g>
      <g id="jet_x5F_pump_x5F_in_2_">
        <circle id="pump_x5F_3_4_" class="st20" cx="764.7" cy="667.9" r="2.2" />
        <line class="st21" x1="767.8" y1="667.9" x2="773.9" y2="667.9" />
        <line class="st21" x1="755.5" y1="667.9" x2="761.7" y2="667.9" />
        <line class="st21" x1="764.7" y1="671" x2="764.7" y2="677.2" />
        <line class="st21" x1="764.7" y1="664.9" x2="764.7" y2="658.7" />
        <line class="st21" x1="767.4" y1="671.1" x2="771.8" y2="675.4" />
        <line class="st21" x1="757.8" y1="660.8" x2="762.1" y2="665.1" />
        <line class="st21" x1="762.8" y1="670.4" x2="758.4" y2="674.8" />
        <line class="st21" x1="771.5" y1="660.8" x2="767.2" y2="665.1" />
      </g>
      <g id="jet_x5F_pump_x5F_out_2_">
        <circle class="st19" cx="765" cy="667.7" r="12.5" />
        <line class="st19" x1="778.1" y1="671.1" x2="784.3" y2="671.1" />
        <line class="st19" x1="784.3" y1="669.1" x2="784.3" y2="680.5" />
        <line
          id="pump_x5F_3_1_"
          class="st19"
          x1="770.7"
          y1="679"
          x2="785.2"
          y2="679"
        />
      </g>
      <line
        id="灰罐连接1_2_"
        class="st16"
        x1="1362.4"
        y1="196"
        x2="1371.1"
        y2="220.5"
      />
      <line
        id="灰罐连接2_2_"
        class="st16"
        x1="1310"
        y1="194"
        x2="1317"
        y2="220"
      />
      <line class="st19" x1="999" y1="166.2" x2="988.5" y2="166.2" />
    </g>
    <g id="valve_1_">
      <text transform="matrix(1 0 0 1 1380 274)" class="st1 st22 st23">
        V20
      </text>
      <text transform="matrix(1 0 0 1 1280 274)" class="st1 st22 st23">
        V19
      </text>
      <text transform="matrix(1 0 0 1 1320 375)" class="st1 st22 st23">
        V18
      </text>
      <text transform="matrix(1 0 0 1 1244 462)" class="st1 st22 st23">
        V17
      </text>
      <text transform="matrix(1 0 0 1 1295 462)" class="st1 st22 st23">
        V16
      </text>
      <text transform="matrix(1 0 0 1 1162 462)" class="st1 st22 st23">
        V15
      </text>
      <text transform="matrix(1 0 0 1 1110 462)" class="st1 st22 st23">
        V14
      </text>
      <text transform="matrix(1 0 0 1 1025 610)" class="st1 st22 st23">
        V13
      </text>
      <text transform="matrix(1 0 0 1 805 610)" class="st1 st22 st23">V12</text>
      <text transform="matrix(1 0 0 1 544.8936 400.6392)" class="st1 st22 st23">
        V11
      </text>
      <text transform="matrix(1 0 0 1 705.7148 650)" class="st1 st22 st23">
        V10
      </text>
      <text transform="matrix(1 0 0 1 631.2075 650)" class="st1 st22 st23">
        V9
      </text>
      <text transform="matrix(1 0 0 1 565 456.3882)" class="st1 st22 st23">
        V8
      </text>
      <text transform="matrix(1 0 0 1 645 556.3271)" class="st1 st22 st23">
        V7
      </text>
      <text transform="matrix(1 0 0 1 702 456.3999)" class="st1 st22 st23">
        V6
      </text>
      <text transform="matrix(1 0 0 1 645 456.3999)" class="st1 st22 st23">
        V5
      </text>
      <text transform="matrix(1 0 0 1 742 263)" class="st1 st22 st23">V4</text>
      <text transform="matrix(1 0 0 1 655 263)" class="st1 st22 st23">V3</text>
      <text transform="matrix(1 0 0 1 740 210)" class="st1 st22 st23">V2</text>
      <text transform="matrix(1 0 0 1 653 210)" class="st1 st22 st23">V1</text>
      <g id="water_x5F_valve_1_">
        <polygon class="st24" points="1346,323.6 1335.5,319.3 1335.5,328" />
        <polygon class="st24" points="1346.4,323.6 1356.9,328 1356.9,319.3" />
        <line class="st25" x1="1346" y1="324.4" x2="1346" y2="313.3" />
        <rect x="1335.7" y="306.4" class="st26" width="21" height="7.1" />
      </g>
      <g id="cement_x5F_valve_3_">
        <polygon class="st24" points="1242.9,302.9 1232.4,298.5 1232.4,307.3" />
        <polygon class="st24" points="1243.3,302.9 1253.8,307.3 1253.8,298.5" />
        <line class="st25" x1="1242.9" y1="303.6" x2="1242.9" y2="292.5" />
        <rect x="1232.7" y="285.7" class="st26" width="21" height="7.1" />
      </g>
      <g id="H1_1_">
        <rect x="868.9" y="397.6" class="st27" width="1.8" height="8.8" />
        <rect x="864.5" y="397.6" class="st27" width="2.6" height="8.8" />
        <rect x="867.1" y="399.4" class="st27" width="1.8" height="5.3" />
        <rect x="870.6" y="400.2" class="st27" width="1.8" height="3.5" />
        <rect x="872.4" y="397.6" class="st27" width="11.4" height="9.6" />
        <rect x="874.1" y="407.2" class="st27" width="7.9" height="0.9" />
        <rect x="874.1" y="396.7" class="st27" width="7.9" height="0.9" />
        <rect x="872.4" y="408.1" class="st27" width="11.4" height="4.4" />
        <rect x="872.4" y="392.3" class="st27" width="11.4" height="4.4" />
        <rect x="874.1" y="412.5" class="st27" width="7.9" height="3.5" />
        <rect x="874.1" y="388.8" class="st27" width="7.9" height="3.5" />
      </g>
      <g id="H2_1_">
        <rect x="988.1" y="399.4" class="st27" width="1.8" height="8.8" />
        <rect x="983.7" y="399.4" class="st27" width="2.6" height="8.8" />
        <rect x="986.3" y="401.1" class="st27" width="1.8" height="5.3" />
        <rect x="989.8" y="402" class="st27" width="1.8" height="3.5" />
        <rect x="991.6" y="399.4" class="st27" width="11.4" height="9.6" />
        <rect x="993.3" y="409" class="st27" width="7.9" height="0.9" />
        <rect x="993.3" y="398.5" class="st27" width="7.9" height="0.9" />
        <rect x="991.6" y="409.9" class="st27" width="11.4" height="4.4" />
        <rect x="991.6" y="394.1" class="st27" width="11.4" height="4.4" />
        <rect x="993.3" y="414.3" class="st27" width="7.9" height="3.5" />
        <rect x="993.3" y="390.6" class="st27" width="7.9" height="3.5" />
      </g>
      <g id="V20_1_">
        <g>
          <polygon
            class="st24"
            points="1370.2,270.7 1365.8,281.2 1374.6,281.2"
          />
          <polygon
            class="st24"
            points="1370.2,270.3 1374.6,259.8 1365.8,259.8"
          />
        </g>
        <line class="st25" x1="1370.9" y1="270.7" x2="1363.9" y2="270.7" />
        <ellipse class="st28" cx="1361.7" cy="270.7" rx="3.5" ry="6.6" />
      </g>
      <g id="V19_1_">
        <g>
          <polygon
            class="st24"
            points="1316.7,270.7 1312.3,281.2 1321.1,281.2"
          />
          <polygon
            class="st24"
            points="1316.7,270.3 1321.1,259.8 1312.3,259.8"
          />
        </g>
        <line class="st25" x1="1317.4" y1="270.7" x2="1310.4" y2="270.7" />
        <ellipse class="st28" cx="1308.2" cy="270.7" rx="3.5" ry="6.6" />
      </g>
      <g id="V18_1_">
        <g>
          <polygon
            class="st24"
            points="1325.9,352.1 1315.4,347.7 1315.4,356.4"
          />
          <polygon
            class="st24"
            points="1326.3,352.1 1336.8,356.4 1336.8,347.7"
          />
        </g>
        <line class="st25" x1="1325.9" y1="352.8" x2="1325.9" y2="345.8" />
        <ellipse class="st28" cx="1325.9" cy="343.6" rx="6.6" ry="3.5" />
      </g>
      <g id="V17_1_">
        <g>
          <polygon class="st24" points="1229.4,457.7 1233.8,447.1 1225,447.1" />
          <polygon class="st24" points="1229.4,458.1 1225,468.6 1233.8,468.6" />
        </g>
        <line class="st25" x1="1228.7" y1="457.7" x2="1235.7" y2="457.7" />
        <ellipse class="st28" cx="1237.9" cy="457.7" rx="3.5" ry="6.6" />
      </g>
      <g id="V16_1_">
        <g>
          <polygon class="st24" points="1280.7,458.5 1285.1,448 1276.4,448" />
          <polygon
            class="st24"
            points="1280.7,458.9 1276.4,469.5 1285.1,469.5"
          />
        </g>
        <line class="st25" x1="1280" y1="458.5" x2="1287" y2="458.5" />
        <ellipse class="st28" cx="1289.2" cy="458.5" rx="3.5" ry="6.6" />
      </g>
      <g id="V15_1_">
        <g>
          <polygon
            class="st24"
            points="1147.6,458.8 1151.9,448.3 1143.2,448.3"
          />
          <polygon
            class="st24"
            points="1147.6,459.2 1143.2,469.7 1151.9,469.7"
          />
        </g>
        <line class="st25" x1="1146.8" y1="458.8" x2="1153.8" y2="458.8" />
        <ellipse class="st28" cx="1156" cy="458.8" rx="3.5" ry="6.6" />
      </g>
      <g id="V14_1_">
        <g>
          <polygon
            class="st24"
            points="1096.2,459.6 1100.6,449.1 1091.8,449.1"
          />
          <polygon class="st24" points="1096.2,460 1091.8,470.5 1100.6,470.5" />
        </g>
        <line class="st25" x1="1095.5" y1="459.6" x2="1102.5" y2="459.6" />
        <ellipse class="st28" cx="1104.7" cy="459.6" rx="3.5" ry="6.6" />
      </g>
      <g id="V13_1_">
        <g>
          <polygon class="st24" points="1033,586 1022.5,581.6 1022.5,590.4" />
          <polygon class="st24" points="1033.4,586 1043.9,590.4 1043.9,581.6" />
        </g>
        <line class="st25" x1="1033" y1="586.7" x2="1033" y2="579.7" />
        <ellipse class="st28" cx="1033" cy="577.5" rx="6.6" ry="3.5" />
      </g>
      <g id="V12_1_">
        <g>
          <polygon class="st24" points="812.1,586 801.6,581.6 801.6,590.4" />
          <polygon class="st24" points="812.5,586 823,590.4 823,581.6" />
        </g>
        <line class="st25" x1="812.1" y1="586.7" x2="812.1" y2="579.7" />
        <ellipse class="st28" cx="812.1" cy="577.5" rx="6.6" ry="3.5" />
      </g>
      <g id="V11_1_">
        <g>
          <polygon class="st24" points="551.1,414.7 540.6,410.3 540.6,419.1" />
          <polygon class="st24" points="551.5,414.7 562,419.1 562,410.3" />
        </g>
        <line class="st25" x1="551.1" y1="415.4" x2="551.1" y2="408.4" />
        <ellipse class="st28" cx="551.1" cy="406.2" rx="6.6" ry="3.5" />
      </g>
      <g id="V10_1_">
        <g>
          <polygon class="st24" points="712.2,667.6 701.7,663.2 701.7,672" />
          <polygon class="st24" points="712.6,667.6 723.1,672 723.1,663.2" />
        </g>
        <line class="st25" x1="712.2" y1="668.3" x2="712.2" y2="661.3" />
        <ellipse class="st28" cx="712.2" cy="659.1" rx="6.6" ry="3.5" />
      </g>
      <g id="V9_1_">
        <g>
          <polygon class="st24" points="636.6,667.7 626.1,663.3 626.1,672.1" />
          <polygon class="st24" points="637,667.7 647.5,672.1 647.5,663.3" />
        </g>
        <line class="st25" x1="636.6" y1="668.5" x2="636.6" y2="661.4" />
        <ellipse class="st28" cx="636.6" cy="659.3" rx="6.6" ry="3.5" />
      </g>
      <g id="V8_1_">
        <g>
          <polygon class="st24" points="596.7,454.4 592.3,464.9 601.1,464.9" />
          <polygon class="st24" points="596.7,454 601.1,443.5 592.3,443.5" />
        </g>
        <line class="st25" x1="597.4" y1="454.4" x2="590.4" y2="454.4" />
        <ellipse class="st28" cx="588.2" cy="454.4" rx="3.5" ry="6.6" />
      </g>
      <g id="V7_1_">
        <g>
          <polygon class="st24" points="674.2,553.8 669.9,564.3 678.6,564.3" />
          <polygon class="st24" points="674.2,553.4 678.6,542.8 669.9,542.8" />
        </g>
        <line class="st25" x1="675" y1="553.8" x2="667.9" y2="553.8" />
        <ellipse class="st28" cx="665.8" cy="553.8" rx="3.5" ry="6.6" />
      </g>
      <g id="V6_1_">
        <g>
          <polygon class="st24" points="732.1,454.7 727.7,465.2 736.5,465.2" />
          <polygon class="st24" points="732.1,454.3 736.5,443.8 727.7,443.8" />
        </g>
        <line class="st25" x1="732.8" y1="454.7" x2="725.8" y2="454.7" />
        <ellipse class="st28" cx="723.6" cy="454.7" rx="3.5" ry="6.6" />
      </g>
      <g id="V5_1_">
        <g>
          <polygon class="st24" points="674.2,454.5 669.9,465 678.6,465" />
          <polygon class="st24" points="674.2,454.1 678.6,443.6 669.9,443.6" />
        </g>
        <line class="st25" x1="675" y1="454.5" x2="668" y2="454.5" />
        <ellipse class="st28" cx="665.8" cy="454.5" rx="3.5" ry="6.6" />
      </g>
      <g id="V4_1_">
        <g>
          <polygon class="st24" points="745.7,277.9 735.2,273.6 735.2,282.3" />
          <polygon class="st24" points="746.1,277.9 756.6,282.3 756.6,273.6" />
        </g>
        <line class="st25" x1="745.7" y1="278.7" x2="745.7" y2="271.7" />
        <ellipse class="st28" cx="745.7" cy="269.5" rx="6.6" ry="3.5" />
      </g>
      <g id="V3_1_">
        <g>
          <polygon class="st24" points="657.1,277.9 646.6,273.6 646.6,282.3" />
          <polygon class="st24" points="657.6,277.9 668.1,282.3 668.1,273.6" />
        </g>
        <line class="st25" x1="657.1" y1="278.7" x2="657.1" y2="271.7" />
        <ellipse class="st28" cx="657.1" cy="269.5" rx="6.6" ry="3.5" />
      </g>
      <g id="V2_1_">
        <g>
          <polygon class="st24" points="744.8,225.3 734.3,221 734.3,229.7" />
          <polygon class="st24" points="745.2,225.3 755.7,229.7 755.7,221" />
        </g>
        <line class="st25" x1="744.8" y1="226.1" x2="744.8" y2="219.1" />
        <ellipse class="st28" cx="744.8" cy="216.9" rx="6.6" ry="3.5" />
      </g>
      <g id="V1_1_">
        <g>
          <polygon class="st24" points="657.1,225.3 646.6,221 646.6,229.7" />
          <polygon class="st24" points="657.6,225.3 668.1,229.7 668.1,221" />
        </g>
        <line class="st25" x1="657.1" y1="226.1" x2="657.1" y2="219.1" />
        <ellipse class="st28" cx="657.1" cy="216.9" rx="6.6" ry="3.5" />
      </g>
      <text
        id="B罐液位_1_"
        transform="matrix(1 0 0 1 625 380)"
        class="st22 st29"
      >
        100%
      </text>
      <text transform="matrix(1 0 0 1 628 350)" class="st22 st29">B罐</text>
      <text
        id="A罐液位_1_"
        transform="matrix(1 0 0 1 745 380)"
        class="st22 st29"
      >
        100%
      </text>
      <text transform="matrix(1 0 0 1 748 350)" class="st22 st29">A罐</text>
      <text
        id="混浆罐液位_1_"
        transform="matrix(1 0 0 1 1100 400)"
        class="st22 st29"
      >
        {{ yw + "%" }}
      </text>
      <g id="hand_x5F_valve_x5F_2_9_">
        <polygon class="st24" points="542.2,568 537.8,578.5 546.6,578.5" />
        <polygon class="st24" points="542.2,567.6 546.6,557 537.8,557" />
        <line class="st25" x1="542.9" y1="568" x2="531.8" y2="568" />
        <line class="st25" x1="532.5" y1="578.3" x2="532.5" y2="567.2" />
      </g>
      <g id="hand_x5F_valve_x5F_2_8_">
        <polygon class="st24" points="788.8,459.4 778.3,455 778.3,463.8" />
        <polygon class="st24" points="789.2,459.4 799.7,463.8 799.7,455" />
        <line class="st25" x1="788.8" y1="460.2" x2="788.8" y2="449.1" />
        <line class="st25" x1="778.5" y1="449.8" x2="789.5" y2="449.8" />
      </g>
      <g id="hand_x5F_valve_x5F_2_7_">
        <polygon class="st24" points="823.9,459.4 813.4,455 813.4,463.8" />
        <polygon class="st24" points="824.3,459.4 834.8,463.8 834.8,455" />
        <line class="st25" x1="823.9" y1="460.2" x2="823.9" y2="449.1" />
        <line class="st25" x1="813.5" y1="449.8" x2="824.6" y2="449.8" />
      </g>
      <g id="hand_x5F_valve_x5F_2_6_">
        <polygon class="st24" points="1261.5,351.6 1251,347.2 1251,356" />
        <polygon class="st24" points="1261.9,351.6 1272.5,356 1272.5,347.2" />
        <line class="st25" x1="1261.5" y1="352.3" x2="1261.5" y2="341.3" />
        <line class="st25" x1="1251.2" y1="341.9" x2="1262.2" y2="341.9" />
      </g>
      <g id="hand_x5F_valve_x5F_2_5_">
        <polygon class="st24" points="1278.8,302.5 1268.3,298.1 1268.3,306.9" />
        <polygon class="st24" points="1279.2,302.5 1289.7,306.9 1289.7,298.1" />
        <line class="st25" x1="1278.8" y1="303.3" x2="1278.8" y2="292.2" />
        <line class="st25" x1="1268.5" y1="292.9" x2="1279.5" y2="292.9" />
      </g>
      <g id="hand_x5F_valve_x5F_1_1_">
        <polygon class="st24" points="542.2,603.9 537.8,614.4 546.6,614.4" />
        <polygon class="st24" points="542.2,603.5 546.6,593 537.8,593" />
        <line class="st25" x1="542.9" y1="603.9" x2="531.8" y2="603.9" />
        <line class="st25" x1="532.5" y1="614.3" x2="532.5" y2="603.2" />
      </g>
    </g>
    <g id="仪表_1_">
      <image
        style="overflow: visible; enable-background: new"
        width="200"
        height="200"
        xlink:href="./2CBFE681.png"
        transform="matrix(-5.161901e-08 -0.1695 0.149 -4.537348e-08 1340.8992 581.5363)"
      />

      <image
        style="overflow: visible; enable-background: new"
        width="211"
        height="200"
        xlink:href="./2CBFE683.png"
        transform="matrix(0 -0.1208 0.1208 0 716.7904 570.157)"
      />
      <g id="密度计_2_">
        <ellipse class="st30" cx="1282.6" cy="399.8" rx="5.3" ry="13.1" />
        <rect x="1278.2" y="383.1" class="st30" width="3.5" height="3.5" />
        <rect x="1278.2" y="412.9" class="st30" width="3.5" height="3.5" />
        <rect x="1274.7" y="415.6" class="st30" width="10.5" height="1.8" />
        <rect x="1274.7" y="382.3" class="st30" width="10.5" height="1.8" />
        <g id="XMLID_1_">
          <g>
            <rect x="1276.9" y="386.6" class="st30" width="5.3" height="26.3" />
          </g>
        </g>
        <path class="st30" d="M1282.6,412.9" />
        <rect x="1273.8" y="398" class="st30" width="3.5" height="3.5" />
        <rect x="1265" y="395.4" class="st30" width="8.8" height="8.8" />
      </g>

      <image
        style="overflow: visible; enable-background: new"
        width="1698"
        height="2004"
        id="立式灰罐_2_"
        xlink:href="./2CBFE686.png"
        transform="matrix(6.688131e-02 0 0 6.688131e-02 1286.5524 76.3414)"
      />
      <g id="cementhead_2_">
        <rect x="896.6" y="164" class="st31" width="65.3" height="4.4" />
        <rect x="965" y="164" class="st31" width="27" height="4.4" />
        <rect x="896.6" y="112.3" class="st31" width="65.3" height="4.4" />
        <rect x="800.2" y="164" class="st31" width="65.3" height="4.4" />
        <rect x="961.9" y="102.1" class="st31" width="3.8" height="125.9" />
        <rect x="865.4" y="155.7" class="st31" width="31.3" height="18" />
        <rect x="872.2" y="188.7" class="st31" width="17.7" height="10" />
        <rect x="863.1" y="198.2" class="st31" width="34.9" height="10" />
        <rect x="872.2" y="220.7" class="st31" width="17.7" height="10" />
        <rect x="874.9" y="230.2" class="st31" width="12.2" height="10" />
        <rect x="866.3" y="173.7" class="st31" width="29.5" height="15" />
        <rect x="869.9" y="122.6" class="st31" width="21.3" height="33" />
        <rect x="864.4" y="106.1" class="st31" width="32.2" height="16.5" />
        <rect x="867.6" y="95.6" class="st31" width="25.8" height="11" />
        <polygon
          class="st31"
          points="867.6,208.2 872.2,220.7 889.8,220.7 894.4,208.2"
        />
      </g>
      <g id="cement_x5F_valve_1_">
        <g id="head_x5F_3_2_">
          <rect x="953.9" y="194.2" class="st27" width="1.8" height="8.8" />
          <rect x="949.5" y="194.2" class="st27" width="2.6" height="8.8" />
          <rect x="952.1" y="196" class="st27" width="1.8" height="5.3" />
          <rect x="955.7" y="196.9" class="st27" width="1.8" height="3.5" />
          <rect x="957.4" y="194.2" class="st27" width="11.4" height="9.6" />
          <rect x="959.2" y="203.9" class="st27" width="7.9" height="0.9" />
          <rect x="959.2" y="193.4" class="st27" width="7.9" height="0.9" />
          <rect x="957.4" y="204.8" class="st27" width="11.4" height="4.4" />
          <rect x="957.4" y="189" class="st27" width="11.4" height="4.4" />
          <rect x="959.2" y="209.1" class="st27" width="7.9" height="3.5" />
          <rect x="959.2" y="185.5" class="st27" width="7.9" height="3.5" />
        </g>
        <g id="head_x5F_1_2_">
          <rect x="924.5" y="121.9" class="st27" width="8.8" height="1.8" />
          <rect x="924.5" y="125.4" class="st27" width="8.8" height="2.6" />
          <rect x="926.3" y="123.7" class="st27" width="5.3" height="1.8" />
          <rect x="927.2" y="120.2" class="st27" width="3.5" height="1.8" />
          <rect x="924.5" y="108.8" class="st27" width="9.6" height="11.4" />
          <rect x="934.2" y="110.5" class="st27" width="0.9" height="7.9" />
          <rect x="923.7" y="110.5" class="st27" width="0.9" height="7.9" />
          <rect x="935.1" y="108.8" class="st27" width="4.4" height="11.4" />
          <rect x="919.3" y="108.8" class="st27" width="4.4" height="11.4" />
          <rect x="939.4" y="110.5" class="st27" width="3.5" height="7.9" />
          <rect x="915.8" y="110.5" class="st27" width="3.5" height="7.9" />
        </g>
        <g id="head_x5F_4_2_">
          <rect x="925" y="173.2" class="st27" width="8.8" height="1.8" />
          <rect x="925" y="176.7" class="st27" width="8.8" height="2.6" />
          <rect x="926.7" y="175" class="st27" width="5.3" height="1.8" />
          <rect x="927.6" y="171.4" class="st27" width="3.5" height="1.8" />
          <rect x="925" y="160.1" class="st27" width="9.6" height="11.4" />
          <rect x="934.6" y="161.8" class="st27" width="0.9" height="7.9" />
          <rect x="924.1" y="161.8" class="st27" width="0.9" height="7.9" />
          <rect x="935.5" y="160.1" class="st27" width="4.4" height="11.4" />
          <rect x="919.7" y="160.1" class="st27" width="4.4" height="11.4" />
          <rect x="939.9" y="161.8" class="st27" width="3.5" height="7.9" />
          <rect x="916.2" y="161.8" class="st27" width="3.5" height="7.9" />
        </g>
        <g id="head_x5F_2_2_">
          <rect x="827.7" y="173.2" class="st27" width="8.8" height="1.8" />
          <rect x="827.7" y="176.7" class="st27" width="8.8" height="2.6" />
          <rect x="829.4" y="175" class="st27" width="5.3" height="1.8" />
          <rect x="830.3" y="171.4" class="st27" width="3.5" height="1.8" />
          <rect x="827.7" y="160.1" class="st27" width="9.6" height="11.4" />
          <rect x="837.3" y="161.8" class="st27" width="0.9" height="7.9" />
          <rect x="826.8" y="161.8" class="st27" width="0.9" height="7.9" />
          <rect x="838.2" y="160.1" class="st27" width="4.4" height="11.4" />
          <rect x="822.4" y="160.1" class="st27" width="4.4" height="11.4" />
          <rect x="842.6" y="161.8" class="st27" width="3.5" height="7.9" />
          <rect x="818.9" y="161.8" class="st27" width="3.5" height="7.9" />
        </g>
        <text
          transform="matrix(1 0 0 1 971.8682 203.2627)"
          class="st1 st22 st32"
        >
          HH3
        </text>
        <text
          transform="matrix(1 0 0 1 921.9043 157.6821)"
          class="st1 st22 st32"
        >
          HH4
        </text>
        <text
          transform="matrix(1 0 0 1 922.7822 105.9658)"
          class="st1 st22 st32"
        >
          HH1
        </text>
        <text
          transform="matrix(1 0 0 1 826.3604 157.6821)"
          class="st1 st22 st32"
        >
          HH2
        </text>
        <text
          transform="matrix(1 0 0 1 873.454 126.9705)"
          class="st1 st22 st32"
        >
          HH6
        </text>
        <circle class="st33" cx="880.7" cy="136.8" r="6.1" />
      </g>
      <polygon class="st17" points="963.8,244.2 969.5,228 958.1,228 " />
      <polygon class="st17" points="792.6,165.9 776.4,160.2 776.4,171.6 " />
    </g>
    <g id="柱塞泵_1_">
      <defs>
        <rect id="SVGID_1_" x="836.3" y="448.3" width="190" height="190" />
      </defs>
      <clipPath id="SVGID_2_">
        <use xlink:href="#SVGID_1_" style="overflow: visible" />
      </clipPath>
      <polygon
        class="st34"
        points="880.4,561.9 885.2,594.2 964.8,594.2 969.6,561.9"
      />
      <polygon
        class="st35"
        points="880.4,561.9 885.2,594.2 964.8,594.2 969.6,561.9"
      />
      <ellipse class="st36" cx="898.7" cy="581.4" rx="10.5" ry="5.9" />
      <ellipse class="st36" cx="926" cy="581.6" rx="10.5" ry="5.9" />
      <ellipse class="st36" cx="951.7" cy="581.6" rx="10.5" ry="5.9" />
      <path
        class="st37"
        d="M901.8,581.6c0,1.2-1.4,2.1-3.1,2.1s-3.1-1-3.1-2.1s1.4-2.1,3.1-2.1S901.8,580.4,901.8,581.6"
      />
      <path
        class="st37"
        d="M929.4,581.6c0,1.2-1.4,2.1-3.1,2.1s-3.1-1-3.1-2.1s1.4-2.1,3.1-2.1S929.4,580.4,929.4,581.6"
      />
      <path
        class="st37"
        d="M954.5,581.6c0,1.2-1.4,2.1-3.1,2.1s-3.1-1-3.1-2.1s1.4-2.1,3.1-2.1S954.5,580.4,954.5,581.6"
      />
      <polygon
        class="st34"
        points="884.7,551 880.4,561.9 969.6,561.9 966.3,551"
      />
      <polygon
        class="st35"
        points="884.7,551 880.4,561.9 969.6,561.9 966.3,551"
      />
      <ellipse class="st38" cx="898.7" cy="555.1" rx="8.8" ry="3.7" />
      <ellipse class="st38" cx="924.9" cy="555.1" rx="8.8" ry="3.7" />
      <ellipse class="st38" cx="951.9" cy="555.1" rx="8.8" ry="3.7" />
      <path
        class="st39"
        d="M901.8,555.2c0,1-1.4,1.9-3.1,1.9s-3.1-0.9-3.1-1.9s1.4-1.9,3.1-1.9S901.8,554.2,901.8,555.2"
      />
      <path
        class="st39"
        d="M927.9,555.2c0,1-1.4,1.9-3.1,1.9c-1.7,0-3.1-0.9-3.1-1.9s1.4-1.9,3.1-1.9C926.6,553.3,927.9,554.2,927.9,555.2"
      />
      <path
        class="st39"
        d="M955,555.2c0,1-1.4,1.9-3.1,1.9c-1.7,0-3.1-0.9-3.1-1.9s1.4-1.9,3.1-1.9C953.6,553.3,955,554.2,955,555.2"
      />
      <polygon
        class="st34"
        points="893.3,525.3 885.9,551 889.6,551 895.6,525.3"
      />
      <polygon
        class="st40"
        points="893.3,525.3 885.9,551 889.6,551 895.6,525.3"
      />
      <polygon
        class="st34"
        points="913.5,525.3 910.9,551 915.6,551 916.9,525.3"
      />
      <polygon
        class="st40"
        points="913.5,525.3 910.9,551 915.6,551 916.9,525.3"
      />
      <polygon
        class="st34"
        points="933.6,525.3 935.3,551 939.3,551 937.2,525.3"
      />
      <polygon
        class="st40"
        points="933.6,525.3 935.3,551 939.3,551 937.2,525.3"
      />
      <polygon
        class="st34"
        points="954.5,525.3 961.3,551 965.5,551 958.1,525.3"
      />
      <polygon
        class="st40"
        points="954.5,525.3 961.3,551 965.5,551 958.1,525.3"
      />
      <path
        class="st34"
        d="M893.3,525.3h2.4h62.5c0,0,1.9-4-1.9-7.8h-60.6l-1.7,2.9L893.3,525.3z"
      />
      <path
        class="st40"
        d="M893.3,525.3h2.4h62.5c0,0,1.9-4-1.9-7.8h-60.6l-1.7,2.9L893.3,525.3z"
      />
      <polygon
        class="st34"
        points="892.6,538.1 912.2,538.1 913.5,525.3 895.6,525.3"
      />
      <polygon
        class="st40"
        points="892.6,538.1 912.2,538.1 913.5,525.3 895.6,525.3"
      />
      <polygon
        class="st34"
        points="916.9,525.3 916.2,538.1 934.5,538.1 933.6,525.3"
      />
      <polygon
        class="st40"
        points="916.9,525.3 916.2,538.1 934.5,538.1 933.6,525.3"
      />
      <polygon
        class="st34"
        points="937.2,525.3 938.3,538.1 957.9,538.1 954.5,525.3"
      />
      <polygon
        class="st40"
        points="937.2,525.3 938.3,538.1 957.9,538.1 954.5,525.3"
      />
      <path
        class="st37"
        d="M899.4,536c0,0.4-0.9,0.7-1.9,0.7c-1,0-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7C898.6,535.3,899.4,535.6,899.4,536"
      />
      <path
        class="st37"
        d="M900.9,529.3c0,0.4-0.9,0.7-1.9,0.7s-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7S900.9,528.9,900.9,529.3"
      />
      <path
        class="st37"
        d="M912.7,529.3c0,0.4-0.9,0.7-1.9,0.7s-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7S912.7,528.9,912.7,529.3"
      />
      <path
        class="st37"
        d="M911.8,536c0,0.4-0.9,0.7-1.9,0.7s-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7S911.8,535.6,911.8,536"
      />
      <path
        class="st37"
        d="M920.8,536c0,0.4-0.9,0.7-1.9,0.7c-1,0-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7C920,535.3,920.8,535.6,920.8,536"
      />
      <path
        class="st37"
        d="M933.2,536c0,0.4-0.9,0.7-1.9,0.7s-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7S933.2,535.6,933.2,536"
      />
      <path
        class="st37"
        d="M933.2,529.3c0,0.4-0.9,0.7-1.9,0.7s-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7S933.2,528.9,933.2,529.3"
      />
      <path
        class="st37"
        d="M941.7,529.3c0,0.4-0.9,0.7-1.9,0.7s-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7S941.7,528.9,941.7,529.3"
      />
      <path
        class="st37"
        d="M942.2,536c0,0.4-0.9,0.7-1.9,0.7s-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7S942.2,535.6,942.2,536"
      />
      <path
        class="st37"
        d="M955,536c0,0.4-0.9,0.7-1.9,0.7s-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7S955,535.6,955,536"
      />
      <path
        class="st37"
        d="M954.5,529.3c0,0.4-0.9,0.7-1.9,0.7s-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7S954.5,528.9,954.5,529.3"
      />
      <path
        class="st37"
        d="M920.8,529.3c0,0.4-0.9,0.7-1.9,0.7c-1,0-1.9-0.3-1.9-0.7s0.9-0.7,1.9-0.7C920,528.6,920.8,528.9,920.8,529.3"
      />
      <path
        class="st34"
        d="M965.5,515c0,0,1.7,5.1,1.6,21.7l-0.7,14.3l3.3,10.9v11.3h2.7l-0.2-2.2l0.2-1V569l9.8,0.5v-5.2l-1.4-1.9v-1.4h3.8c0,0,1-37.5,1-38c0-0.5-1-8.1-3.3-10.9c0,0-2.4-2.9-5.2,0.5l-14.3,0.5c0,0,1.9,0.5,2.4,1.4L965.5,515z"
      />
      <path
        class="st35"
        d="M965.5,515c0,0,1.7,5.1,1.6,21.7l-0.7,14.3l3.3,10.9v11.3h2.7l-0.2-2.2l0.2-1V569l9.8,0.5v-5.2l-1.4-1.9v-1.4h3.8c0,0,1-37.5,1-38c0-0.5-1-8.1-3.3-10.9c0,0-2.4-2.9-5.2,0.5l-14.3,0.5c0,0,1.9,0.5,2.4,1.4L965.5,515z"
      />
      <path
        class="st41"
        d="M956.4,517.4l6.2-5.6c0,0,4.1-0.6,4.3,8.1l-0.2,30.8h-0.9l-8.2-26.3C957.6,524.4,960,520.8,956.4,517.4"
      />
      <path
        class="st35"
        d="M956.4,517.4l6.2-5.6c0,0,4.1-0.6,4.3,8.1l-0.2,30.8h-0.9l-8.2-26.3C957.6,524.4,960,520.8,956.4,517.4z"
      />
      <path
        class="st34"
        d="M984.5,560.9h1v-1l1-0.4v-1.4h3.1c0,0,2.6,0.5,3.5,2.9h1.8c0,0,4.6-4.6,0-9.2h-1.9c0,0-1.8,2.7-3.5,2.1l-4.8-0.1l-0.2,7V560.9z"
      />
      <path
        class="st35"
        d="M984.5,560.9h1v-1l1-0.4v-1.4h3.1c0,0,2.6,0.5,3.5,2.9h1.8c0,0,4.6-4.6,0-9.2h-1.9c0,0-1.8,2.7-3.5,2.1l-4.8-0.1l-0.2,7V560.9z"
      />
      <path class="st34" d="M972.2,570.4c0,0,0.2,0.7,2.1,1.2v1.2h-2.1V570.4z" />
      <polygon
        class="st34"
        points="880.9,559 878.9,558.8 877.1,564.7 878.1,573.3 881.7,573.3 880.4,563.5 880.2,561.9 881.4,559"
      />
      <polygon class="st34" points="877.1,563.3 869,563.3 869,569 877.6,569 " />
      <path
        class="st34"
        d="M871.9,565.9c0,1.7-1.6,3.1-3.6,3.1c-2,0-3.6-1.4-3.6-3.1s1.6-3.1,3.6-3.1C870.3,562.8,871.9,564.2,871.9,565.9"
      />
      <polygon
        class="st41"
        points="892.6,538.1 892.2,539.9 911.8,539.9 912.2,538.1"
      />
      <polygon
        class="st41"
        points="916.2,538.1 916.1,539.9 934.5,539.9 934.5,538.1"
      />
      <polygon
        class="st41"
        points="938.3,538.1 938.4,539.7 958.4,539.9 957.9,538.1"
      />
      <polygon
        class="st42"
        points="892.2,539.9 889.6,551 910.9,551 911.8,539.9"
      />
      <polygon
        class="st43"
        points="892.2,539.9 889.6,551 910.9,551 911.8,539.9"
      />
      <polygon
        class="st42"
        points="938.4,539.7 939.3,551 961.3,551 958.3,540"
      />
      <polygon
        class="st43"
        points="938.4,539.7 939.3,551 961.3,551 958.3,540"
      />
      <polygon class="st42" points="916.1,540 915.6,551 935.3,551 934.6,540" />
      <polygon class="st43" points="916.1,540 915.6,551 935.3,551 934.6,540" />
      <path class="st44" d="M892.2,540c0,0,8.7,11.8,19.6,0H892.2z" />
      <path class="st44" d="M916.1,540c0,0,8.2,11.8,18.5,0H916.1z" />
      <path class="st44" d="M938.7,540c0,0,8.7,11.8,19.6,0H938.7z" />
    </g>
    <g id="清水流量计计量">
      <rect x="1380" y="530" class="st49" width="120" height="30" />
      <g>
        <rect x="1380" y="560" class="st45" width="120" height="50" />
        <line class="st45" x1="1380" y1="585" x2="1500" y2="585" />
        <line class="st45" x1="1450" y1="560" x2="1450" y2="610" />
      </g>
      <text transform="matrix(1 0 0 1 1410 550)" class="st1 st46 st47">
        清水流量
      </text>
      <text transform="matrix(1 0 0 1 1390 580)" class="st1 st46 st48">
        {{ qsll }}
      </text>
      <text transform="matrix(1 0 0 1 1390 602)" class="st1 st46 st48">
        {{ qslj }}
      </text>
      <text transform="matrix(1 0 0 1 1460 580)" class="st1 st46 st48">m³</text>
      <text transform="matrix(1 0 0 1 1460 602)" class="st1 st46 st48">
        LPM
      </text>
    </g>
    <g id="电磁流量计计量">
      <rect x="740" y="490" class="st49" width="120" height="30" />
      <g>
        <rect x="740" y="520" class="st45" width="120" height="50" />
        <line class="st45" x1="740" y1="545" x2="860" y2="545" />
        <line class="st45" x1="810" y1="520" x2="810" y2="570" />
      </g>
      <text transform="matrix(1 0 0 1 765 510)" class="st1 st46 st47">
        泵替流量
      </text>
      <text transform="matrix(1 0 0 1 748 537)" class="st1 st46 st48">
        {{ abdcll }}
      </text>
      <text transform="matrix(1 0 0 1 748 562)" class="st1 st46 st48">
        {{ abdclllj }}
      </text>
      <text transform="matrix(1 0 0 1 820 537)" class="st1 st46 st48">m³</text>
      <text transform="matrix(1 0 0 1 820 562)" class="st1 st46 st48">LPM</text>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
#yw3 {
  transform-origin: 0 80px;
}

.st0 {
  fill: #e71f19;
}

.st1 {
  fill: #ffffff;
}

.st2 {
  opacity: 0.5;
  fill: #c30d23;
  enable-background: new;
}

.st3 {
  opacity: 0.7;
  fill: #c30d23;
  enable-background: new;
}

.st4 {
  opacity: 0.69;
  fill: #c30d23;
  enable-background: new;
}

.st5 {
  fill: #e60012;
}

.st6 {
  fill: none;
  stroke: #c30d23;
  stroke-width: 3;
  stroke-miterlimit: 10;
}

.st7 {
  opacity: 0.91;
  fill: #40220f;
  enable-background: new;
}

.st8 {
  opacity: 0.5;
  fill: none;
  stroke: #c30d23;
  stroke-width: 3;
  stroke-miterlimit: 10;
  enable-background: new;
}

.st9 {
  opacity: 0.45;
  fill: none;
  stroke: #c30d23;
  stroke-width: 3;
  stroke-miterlimit: 10;
  enable-background: new;
}

.st10 {
  fill: none;
  stroke: #e60012;
  stroke-width: 6;
  stroke-miterlimit: 10;
}

.st11 {
  fill: none;
  stroke: #c30d23;
  stroke-width: 6;
  stroke-miterlimit: 10;
}

.st12 {
  fill: #e60012;
  stroke: #c30d23;
  stroke-width: 3;
  stroke-miterlimit: 10;
}

.st13 {
  fill: none;
  stroke: #c30d23;
  stroke-width: 4;
  stroke-miterlimit: 10;
}

.st14 {
  fill: none;
  stroke: #c30d23;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st15 {
  opacity: 0.31;
  fill: #6a3906;
  enable-background: new;
}

.st16 {
  fill: none;
  stroke: #c0c0c0;
  stroke-width: 3;
  stroke-miterlimit: 10;
}

.st17 {
  fill: #ff0000;
  stroke: #ff2a54;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st18 {
  fill: #808080;
  stroke: #dddddd;
  stroke-miterlimit: 10;
}

.st19 {
  fill: none;
  stroke: #ff0000;
  stroke-width: 3;
  stroke-miterlimit: 10;
}

.st20 {
  fill: #2c2c2c;
}

.st21 {
  fill: none;
  stroke: #2c2c2c;
  stroke-miterlimit: 10;
}

.st22 {
  font-family: "SimHei";
}

.st23 {
  font-size: 15px;
}

.st24 {
  fill: #696969;
  stroke: #333333;
  stroke-width: 0.75;
  stroke-miterlimit: 10;
}

.st25 {
  fill: none;
  stroke: #333333;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st26 {
  fill: #999999;
  stroke: #333333;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st27 {
  fill: #00ffff;
  stroke: #48d1cc;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st28 {
  fill: #696969;
  stroke: #333333;
  stroke-miterlimit: 10;
}

.st29 {
  font-size: 18px;
}

.st30 {
  fill: #696969;
}

.st31 {
  fill: #ff0000;
}

.st32 {
  font-size: 15px;
}

.st33 {
  fill: #00ffff;
}

.st34 {
  clip-path: url(#SVGID_2_);
  fill: #ed1c24;
}

.st35 {
  clip-path: url(#SVGID_2_);
  fill: none;
  stroke: #c1272d;
  stroke-miterlimit: 10;
}

.st36 {
  clip-path: url(#SVGID_2_);
  fill: none;
  stroke: #333333;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st37 {
  clip-path: url(#SVGID_2_);
}

.st38 {
  clip-path: url(#SVGID_2_);
  fill: none;
  stroke: #333333;
  stroke-miterlimit: 10;
}

.st39 {
  clip-path: url(#SVGID_2_);
  fill: #333333;
}

.st40 {
  clip-path: url(#SVGID_2_);
  fill: none;
  stroke: #c1272d;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st41 {
  clip-path: url(#SVGID_2_);
  fill: #c1272d;
}

.st42 {
  clip-path: url(#SVGID_2_);
  fill: #180002;
}

.st43 {
  clip-path: url(#SVGID_2_);
  fill: none;
  stroke: #4d4d4d;
  stroke-width: 0.25;
  stroke-miterlimit: 10;
}

.st44 {
  clip-path: url(#SVGID_2_);
  fill: #4a0002;
}

.st45 {
  fill: none;
  stroke: #000000;
  stroke-miterlimit: 10;
}

.st46 {
  font-family: "AdobeSongStd-Light-GBpc-EUC-H";
}

.st47 {
  font-size: 16px;
}

.st48 {
  font-size: 14px;
}

.st49 {
  stroke: #000000;
  stroke-miterlimit: 10;
}
</style>
