import Draw from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill } from "ol/style";
import { getLength, getArea } from "ol/sphere";

export default function useMeasure(map) {
  let measureInstance = null;
  const measureSource = new VectorSource();
  const measureLayer = new VectorLayer({
    source: measureSource,
    style: new Style({
      stroke: new Stroke({
        color: "rgba(0, 128, 255, 0.8)",
        width: 2,
      }),
      fill: new Fill({
        color: "rgba(0, 128, 255, 0.1)",
      }),
    }),
  });
  map.addLayer(measureLayer);
  // 开始测量
  const startMeasure = (measureType) => {
    if (!map) return;
    // 移除旧测量交互
    stopMeasure();
    // 清除之前的测量结果
    measureSource.clear();
    measureInstance = new Draw({
      source: measureSource,
      type: measureType,
    });
    map.addInteraction(measureInstance);
    measureInstance.on("drawend", (e) => {
      const geometry = e.feature.getGeometry();
      if (measureType === "LineString") {
        const length = getLength(geometry, {
          projection: map.getView().getProjection(),
        });
        console.log("距离：", formatLength(length));
      }
      if (measureType === "Polygon") {
        const area = getArea(geometry, {
          projection: map.getView().getProjection(),
        });
        console.log("面积：", formatArea(area));
      }
    });
  };
  // 停止测量
  const stopMeasure = () => {
    if (measureInstance) {
      map.removeInteraction(measureInstance);
      measureInstance = null;
    }
  };
  // 清除测量结果
  const clearMeasure = () => {
    measureSource.clear();
    stopMeasure();
  };
  // 格式化距离
  const formatLength = (length) => {
    if (length < 1000) {
      return `${length.toFixed(2)} 米`;
    }
    return `${(length / 1000).toFixed(2)} 千米`;
  };
  // 格式化面积
  const formatArea = (area) => {
    if (area < 10000) {
      return `${area.toFixed(2)} 平方米`;
    }
    if (area < 1000000) {
      return `${(area / 10000).toFixed(2)} 公顷`;
    }
    return `${(area / 1000000).toFixed(2)} 平方千米`;
  };
  return {
    startMeasure,
    stopMeasure,
    clearMeasure,
  };
}
