import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Stroke, Fill } from "ol/style";
import CircleStyle from "ol/style/Circle";
import Text from "ol/style/Text";
import Cluster from "ol/source/Cluster";


export default function useGeoJsonLayer(map) {
  const handleGeoJsonUpload = async (file) => {
    const rawFile = file.raw;
    const text = await rawFile.text();
    const geojsonObj = JSON.parse(text);
    const layerID = file.uid;
    const layerName = file.name;

    const vectorStyle = new Style({
      fill: new Fill({ color: "rgba(67,160,71,0.25)" }),
      stroke: new Stroke({ color: "#2e7d32", width: 2 }),
      //点的样式
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: "rgba(255, 0, 0, 0.8)" }),
        stroke: new Stroke({ color: "rgba(255, 255, 255, 0.8)", width: 1 }),
      }),
    });
    const features = new GeoJSON().readFeatures(geojsonObj, {
      featureProjection: "EPSG:4326",
    });
    // 判断是否全部为Point
    const isPointData =
      features.length > 0 &&
      features.every((feature) => feature.getGeometry().getType() === "Point");
    let source;
    let layer;
    // 点数据使用聚合
    if (isPointData) {
      const originalSource = new VectorSource({
        features,
      });
      const clusterSource = new Cluster({
        distance: 40,
        source: originalSource,
      });
      layer = new VectorLayer({
        source: clusterSource,
        style: (feature) => {
          const clusterFeatures = feature.get("features");
          const count = clusterFeatures.length;
          // 单个点
          if (count === 1) {
            return vectorStyle;
          }
          // 聚合点
          return new Style({
            image: new CircleStyle({
              radius: 16,
              fill: new Fill({
                color: "rgba(255, 87, 34, 0.8)",
              }),
              stroke: new Stroke({
                color: "#ffffff",
                width: 2,
              }),
            }),
            text: new Text({
              text: String(count),
              fill: new Fill({
                color: "#ffffff",
              }),
            }),
          });
        },
      });
      source = originalSource;
    } else {
      // 非点数据正常显示
      source = new VectorSource({
        features,
      });
      layer = new VectorLayer({
        source,
        style: vectorStyle,
      });
    }
    // map.addLayer(layer);//图层管理负责添加图层
    // 定位到图层范围
    const extent = source.getExtent();
    map.getView().fit(extent, { duration: 1200, padding: [40, 40, 40, 40] });

    return {
      id: layerID,
      name: layerName,
      layer,
    };
  };
  return {
    handleGeoJsonUpload,
  };
}
