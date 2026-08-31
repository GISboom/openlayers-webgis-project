import Draw from "ol/interaction/Draw";
import CircleStyle from "ol/style/Circle";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill } from "ol/style";

export default function useDraw(map) {
  let drawInstance = null; //绘制交互实例
  let drawSource = null;
  let drawLayer = null;
  const initDrawLayer = () => {
    drawSource = new VectorSource();
    drawLayer = new VectorLayer({
      source: drawSource,
      style: new Style({
        //点的样式
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: "rgba(255, 0, 0, 0.8)" }),
          stroke: new Stroke({ color: "rgba(255, 255, 255, 0.8)", width: 1 }),
        }),
        //线面的样式
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 0.5)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.1)",
        }),
      }),
    });
    map.addLayer(drawLayer);
  };

  //绘制图形
  const startdraw = (drawType) => {
    // console.log(drawType);
    if (!map) return;
    // 防抖处理：移除旧的绘制交互
    if (drawInstance) {
      map.removeInteraction(drawInstance);
      drawInstance = null;
    }
    if (!drawType) return;

    // 3. 创建新的 Draw 交互
    drawInstance = new Draw({
      source: drawSource,
      type: drawType,
    });

    // 4. 添加到地图生效
    map.addInteraction(drawInstance);
    // 绘制完成回调（双击结束一条线时触发）
    drawInstance.on("drawend", (e) => {
      // console.log(e.feature.getGeometry().getCoordinates());
      
    });
  };

  //停止绘制，防止和icon的绘制冲突
  const stopDraw = () => {
    if (drawInstance) {
      map.removeInteraction(drawInstance);
      drawInstance = null;
    }
  };

  //清除绘制
  const clearDraw = () => {
    if (!drawSource) return;
    drawSource.clear();
  };
  //对外提供一个获取 Feature 的方法。
  const getDrawFeatures = () => {
  return drawSource.getFeatures();
};
  // 初始化
  initDrawLayer();
  return {
    startdraw,
    stopDraw,
    clearDraw,
    getDrawFeatures,
  };
}
