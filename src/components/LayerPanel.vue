<template>
  <div class="layer-panel">
    <h3>图层列表</h3>
    <div v-for="item in layers" :key="item.id" class="layer-item">
      <input type="checkbox" :checked="item.visible" @click="toggle(item.id)" />
      <span>
        {{ item.name }}
      </span>
      <button @click="remove(item.id)">删除</button>
    </div>
  </div>
</template>

<script setup>
import layerState from "../stores/mapLayerState";

const layers = layerState.layers;
const props = defineProps({
  manager: Object,
});

const toggle = (id) => {
  props.manager.toggleLayer(id);
};

const remove = (id) => {
  props.manager.removeLayer(id);
};
</script>
<style scoped>
.layer-panel {
  position: absolute;
  top: 10%;
  left: 10px;
  width: 200px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 999;
}
</style>
