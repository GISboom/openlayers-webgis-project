<template>
  <div class="menu">
    <div class="changeBaseMap">
      <el-button type="primary" plain @click="handlechangeBaseMap('vector')">切换矢量底图</el-button>
      <el-button type="primary" plain @click="handlechangeBaseMap('image')">切换影像底图</el-button>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits([
  "changeBaseMap"
]);
const handlechangeBaseMap = (type) => {
  emit("changeBaseMap",type);
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
}

.changeBaseMap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.changeBaseMap .el-button {
  margin: 0 auto;
  padding: 0;
  width: 60%;
}
</style>
