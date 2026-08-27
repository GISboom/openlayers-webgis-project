import Draw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Stroke, Fill, Circle as CircleStyle } from "ol/style";

//缓冲区分析
export default function useBuffer(map) {
  let drawInstance = null;
  const source = new VectorSource();
  const layer = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({
        color: "#ff0000",
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(255,0,0,0.2)",
      }),
    }),
  });
  map.addLayer(layer);

  //开始绘制缓冲输入
  const startBufferDraw = (type) => {
    stopBufferDraw();
    drawInstance = new Draw({
      source,
      type,
    });

    map.addInteraction(drawInstance);

    drawInstance.on("drawend", (event) => {
      const geometry = event.feature.getGeometry();
      const geojson = new GeoJSON().writeGeometryObject(geometry);//将几何对象转换为GeoJSON格式
      console.log("buffer输入:", geojson);
    });
  };

  const stopBufferDraw = () => {
    if (drawInstance) {
      map.removeInteraction(drawInstance);
      drawInstance = null;
    }
  };

  const clearBufferDraw = () => {
    source.clear();
  };

  return {
    startBufferDraw,
    stopBufferDraw,
    clearBufferDraw,
  };
}
