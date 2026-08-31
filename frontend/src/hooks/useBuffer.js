import Draw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Stroke, Fill, Circle as CircleStyle } from "ol/style";
import { ref } from "vue";
import axios from "axios";

//缓冲区分析
export default function useBuffer(map, getDrawFeatures) {
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
      //点的样式
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: "rgba(255, 0, 0, 0.8)" }),
        stroke: new Stroke({ color: "rgba(255, 255, 255, 0.8)", width: 1 }),
      }),
    }),
  });
  map.addLayer(layer);
  const bufferSource = new VectorSource();
  const bufferLayer = new VectorLayer({
    source: bufferSource,
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
  // map.addLayer(bufferLayer);
  // 当前绘制出来的 GeoJSON
  let bufferGeometry = null;
  // 是否已经完成绘制
  const hasGeometry = ref(false);

  //开始绘制缓冲输入
  const startBufferDraw = (type) => {
    // 移除之前的 Draw
    stopBufferDraw();

    // 清除之前绘制的要素
    // source.clear();

    // 清除之前的 GeoJSON
    bufferGeometry = null;
    hasGeometry.value = false;
    drawInstance = new Draw({
      source,
      type,
    });

    map.addInteraction(drawInstance);

    drawInstance.on("drawend", (event) => {
      const geometry = event.feature.getGeometry();
      const geojson = new GeoJSON().writeGeometryObject(geometry); //将几何对象转换为GeoJSON格式
      // 保存 GeoJSON
      bufferGeometry = geojson;

      hasGeometry.value = true;

      // 绘制完成后停止 Draw
      // stopBufferDraw();
    });
  };

  const stopBufferDraw = () => {
    if (drawInstance) {
      map.removeInteraction(drawInstance);
      drawInstance = null;
    }
  };

  const doBuffer = async (bufferDistance) => {
    // if (!bufferGeometry) {
    //   console.log("没有缓冲区分析对象,请先绘制");
    //   return;
    // }
    if (bufferDistance === null || bufferDistance <= 0) {
      bufferDistance;
      console.log("请输入有效的缓冲距离");
      return;
    }
    // // 3. 构造请求数据,buffergeometry,缓冲区分析用到的几何对象包括geometry和distance
    // const data = {
    //   geometry: bufferGeometry,
    //   distance: Number(bufferDistance),
    // };
    /**
     * 多要素buffer
     *
     */
    //从useDraw中得到绘制的所有要素
    const features = getDrawFeatures();

    if (features.length === 0) {
      console.log("没有缓冲区分析对象，请先绘制");
      return;
    }
    //GeoJSON构建featureCollection
    const geojsonFormat = new GeoJSON();
    const featureCollection = geojsonFormat.writeFeaturesObject(features);
    const data = {
      geometry: featureCollection,
      distance: Number(bufferDistance),
    };
    // console.log("geojson:",data);

    try {
      const response = await axios.post(
        "http://localhost:8089/api/analysis/buffer",
        data,
      );
      console.log("后端返回：", response.data);

      const geojsonFormat = new GeoJSON();

      const feature = geojsonFormat.readFeature(response.data, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326",
      });
      bufferSource.addFeature(feature);
    } catch (error) {
      console.error("请求失败:", error);
    }
    return {
      id: `buffer_${bufferDistance}`,
      name: `缓冲区分析_${bufferDistance}`,
      layer: bufferLayer,
    };
  };

  const clearBufferDraw = () => {
    source.clear();
    bufferSource.clear();
  };

  return {
    startBufferDraw,
    stopBufferDraw,
    doBuffer,
    clearBufferDraw,

    bufferGeometry,
    hasGeometry,
  };
}
