<template>
  <div class="popup" v-if="info">
    <el-card  shadow="always">
      <div v-for="(value, key) in info" :key="key" class="popup-item">
        <h3>{{ key }} : {{ value }}</h3>
      </div>
      <div class="button">
        <el-button style="width: 100%;height: 100%;" type="primary" plain @click="mapState.selectedInfo = null"
          >关闭</el-button
        >
      </div>
    </el-card>
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
  left: 30%;
  background-color: rgba(255, 255, 255, 0);
  padding: 10px;
  border-radius: 5px;
  z-index: 999;
}
.button {
  width: 50%;
  height: 30px;
  margin: 10px auto;
}
</style>
