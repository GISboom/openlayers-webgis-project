import Draw from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { iconOptions } from "../config/iconOptions";
import Icon from "ol/style/Icon";

export default function useMarker(map) {
  //绘制图标
  let drawInstance = null; //绘制交互实例
  let iconSource = null;
  let iconLayer = null;
  const initIconLayer = () => {
    iconSource = new VectorSource();
    iconLayer = new VectorLayer({
      source: iconSource,
    });
    map.addLayer(iconLayer);
  };

  const svgToDataUrl = (svgStr) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
  };

  const getCurrentIconUrl = (icon) => {
    const target = iconOptions.find((item) => item.value === icon);
    // 找不到就返回默认图标，做容错
    return target ? svgToDataUrl(target.svg) : "/public/data/beijing.png";
  };
  const drawIcon = (icon) => {
    if (!map) return;
    //移除旧交互
    if (drawInstance) {
      map.removeInteraction(drawInstance);
      drawInstance = null;
    }
    drawInstance = new Draw({
      source: iconSource,
      type: "Point",
    });
    map.addInteraction(drawInstance);
    // 绘制完成回调
    drawInstance.on("drawend", (e) => {
      // console.log(e.feature.getGeometry().getCoordinates());

      const iconUrl = getCurrentIconUrl(icon);
      //拿到刚刚画出来的要素
      const feature = e.feature;
      //给这个要素设置选中图标样式
      feature.setStyle(
        new Style({
          image: new Icon({
            src: iconUrl,
            scale: 0.1, //原始svg viewBox=1024，需要缩小
            anchor: [0.5, 0.5],
          }),
        }),
      );
    });
  };

  //停止绘制图标
  const stopIcon = () => {
    if (drawInstance) {
      map.removeInteraction(drawInstance);

      drawInstance = null;
    }
  };

  //清除图标
  const clearIcon = () => {
    if (!iconSource) return;
    iconSource.clear();
  };
  initIconLayer();
  return {
    drawIcon,
    stopIcon,
    clearIcon,
  };
}
