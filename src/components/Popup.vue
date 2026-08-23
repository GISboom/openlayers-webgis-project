<template>
  <div class="popup" v-if="info">
    <h3>城市：{{info.name}}</h3>
    <h3>编码：{{info.adcode}}</h3>
    <br>
    <el-button style="width: 100%;" type="primary" plain @click="mapState.selectedInfo = null">关闭</el-button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { computed } from "vue";
import mapState from "../stores/mapState";

let info = computed(() => mapState.selectedInfo);
</script>
<style scoped>
.popup {
  position: absolute;
  top: 10%;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 999;
}
</style>
