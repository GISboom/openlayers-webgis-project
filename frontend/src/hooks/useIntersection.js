import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Stroke, Fill } from "ol/style";
import axios from "axios";
import useLayerManager from "./useLayerManager";

//相交分析
export default function useIntersection(map, getDrawFeatures) {
  const intersectionSource = new VectorSource();
  const intersectionLayer = new VectorLayer({
    source: intersectionSource,
    style: new Style({
      stroke: new Stroke({
        color: "#1fdb87",
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(26, 203, 58, 0.87)",
      }),
    }),
  });
  // map.addLayer(intersectionLayer);
  const doIntersection = async (cityLayer) => {
    //获取图层要素
    const cityFeatures = cityLayer.getSource().getFeatures();
    //获取绘制要素
    const drawFeatures = getDrawFeatures();
    if (!cityLayer) {
      console.log("没有分析图层");
      return;
    }
    if (cityFeatures.length === 0) {
      console.log("城市图层没有要素");
      return;
    }
    if (drawFeatures.length === 0) {
      console.log("没有绘制要素");
      return;
    }
    // console.log("城市Feature:", cityFeatures);
    // console.log("绘制Feature:", drawFeatures);

    //要素转GeoJSON
    const geojsonFormat = new GeoJSON();
    const layerGeoJSON = geojsonFormat.writeFeaturesObject(cityFeatures);
    const drawGeoJSON = geojsonFormat.writeFeaturesObject(drawFeatures);

    const data = {
      layerFeatures: layerGeoJSON,
      drawFeatures: drawGeoJSON,
    };
    // console.log(data);

    //发送请求
    try {
      const response = await axios.post(
        "http://localhost:8089/api/analysis/intersection",
        data,
      );
      console.log("后端返回：", response.data);
      const geojsonFormat = new GeoJSON();

      const feature = geojsonFormat.readFeature(response.data, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326",
      });
      intersectionSource.clear();
      intersectionSource.addFeature(feature);
    } catch (error) {
      console.error("请求失败:", error);
    }
    return {
      id:"intersection",
      name: "相交分析",
      layer: intersectionLayer,
    }
  };
  const clearIntersection = () => {
    intersectionSource.clear();
  }
  return {
    doIntersection,
    clearIntersection
  };
}
