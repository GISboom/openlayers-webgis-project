import layerState from "../stores/mapLayerState";

export default function useLayerManager(map) {
  //添加图层
  const addLayer = (config) => {
    console.log(config);
    
    const { id, name, layer } = config;
    map.addLayer(layer);
    layerState.layers.push({
      id,
      name,
      layer,
      visible: true,
    });
  };
  //删除图层
  const removeLayer = (id) => {
    const index = layerState.layers.findIndex((item) => item.id === id);
    if (index !== -1) {
      const target = layerState.layers[index];
      map.removeLayer(target.layer);
      layerState.layers.splice(index, 1);
    }
  };
  //控制显示隐藏
  const toggleLayer = (id) => {
    const target = layerState.layers.find((item) => item.id === id);
    if (target) {
      target.visible = !target.visible;
      target.layer.setVisible(target.visible);
    }
  };
  return {
    addLayer,
    removeLayer,
    toggleLayer,
  };
}
