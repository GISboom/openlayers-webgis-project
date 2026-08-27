<template>
  <div class="layer-panel">
    <h3>图层列表</h3>
    <div v-for="item in layers" :key="item.id" class="layer-item">
      <input type="checkbox" :checked="item.visible" @click="toggle(item.id)" />
      <span>
        {{ item.name }}
      </span>
      <el-button type="primary" plain @click="remove(item.id)">移除</el-button>
    </div>
  </div>
</template>

<script setup>
import layerState from "../stores/mapLayerState";
const layers = layerState.layers;
const props = defineProps(["manager"]);

const toggle = (id) => {
  props.manager.toggleLayer(id);
};

const remove = (id) => {
  if (!props.manager) return;
  props.manager.removeLayer(id);
};
</script>
<style scoped>
.layer-panel {
  position: absolute;
  top: 20%;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 999;
}
h3{
  margin-bottom: 10px;
  padding: 0;
  text-align: center;
}
.layer-item{
  margin: 5px 0;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
input{
  margin-right: 20px;
}
.el-button{
  margin-left: 20px;
}
</style>
