<template>
  <div class="menu">
    <div class="changeBaseMap">
      <el-button type="primary" plain @click="handlechangeBaseMap('vector')"
        >切换矢量底图</el-button
      >
      <el-button type="primary" plain @click="handlechangeBaseMap('image')"
        >切换影像底图</el-button
      >
    </div>
    <div class="geojson">
      <el-upload
        accept=".geojson,.json"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleAddGeoJson"
      >
        <el-button type="primary" plain>加载GeoJSON</el-button>
      </el-upload>
    </div>
    <div class="measure">
      <el-button type="primary" plain @click="handlestartMeasure('LineString')">
        测距
      </el-button>

      <el-button type="primary" plain @click="handlestartMeasure('Polygon')">
        测面积
      </el-button>

      <el-button type="primary" plain @click="handleclearMeasure">
        清除测量
      </el-button>
    </div>
    <div class="buffer">
      <div class="distance">
        <el-input
          v-model="bufferDistance"
          :precision="2"
          placeholder="缓冲距离"
        />
        <span>米</span>
      </div>

      <el-button type="primary" plain @click="handleexecuteBuffer">
        执行缓冲
      </el-button>
      <el-button type="primary" plain @click="handleclearBufferDraw"
        >清空buffer</el-button
      >
    </div>
    <div class="intersection">
      <el-button type="primary" plain @click="handleIntersection">相交分析</el-button>
      <el-button type="primary" plain @click="handleClearIntersection">清除相交图层</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
let bufferDistance = ref(null);
const emit = defineEmits([
  "changeBaseMap",
  "addGeoJson",
  "startMeasure",
  "clearMeasure",
  "executeBuffer",
  "clearBufferDraw",
  "doIntersection",
  "clearIntersection",
]);
const handlechangeBaseMap = (type) => {
  emit("changeBaseMap", type);
};
const handleAddGeoJson = (file) => {
  emit("addGeoJson", file);
};
const handlestartMeasure = (type) => {
  emit("startMeasure", type);
};
const handleclearMeasure = () => {
  emit("clearMeasure", "clear");
};
const handleexecuteBuffer = () => {
  emit("executeBuffer", bufferDistance.value);
};
const handleclearBufferDraw = () => {
  emit("clearBufferDraw");
};
const handleIntersection = () => {
  emit("doIntersection");
};
const handleClearIntersection = () => {
  emit("clearIntersection");
};
</script>
<style scoped>
.menu {
  position: absolute;
  top: 90px;
  right: 20px;
  z-index: 999;
  width: 200px;
  height: 80%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  overflow: scroll;
}

.changeBaseMap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #22bdd5;
  padding: 10px;
  border-radius: 5px;
}
.changeBaseMap .el-button {
  margin: 0 auto;
  padding: 0;
  width: 60%;
}
.geojson {
  background-color: #22bdd5;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  margin: 20px auto;
  display: flex;
  justify-content: center;
}
.measure {
  width: 100%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #22bdd5;
  padding: 10px;
  border-radius: 5px;
}
.measure .el-button {
  margin: 0 auto;
  padding: 0;
  width: 60%;
}
.buffer {
  width: 100%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #22bdd5;
  padding: 10px;
  border-radius: 5px;
}
.buffer .el-button {
  margin: 0 auto;
  padding: 0;
  width: 70%;
}
.buffer .distance {
  margin: 0 auto;
  padding: 0;
}
.buffer .distance .el-input {
  margin-left: 13%;
  width: 70%;
}
.intersection {
  width: 100%;
  margin: 20px auto;
  background-color: #22bdd5;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-radius: 5px;
}
.intersection .el-button {
  margin: 0 auto;
  padding: 0;
  width: 70%;
}
</style>
