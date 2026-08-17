<template>
  <div id="map"></div>
  <div class="addLine">
    <button @click="startDrawingLine">绘制折线</button>
    <button @click="stopDrawLine">结束绘制</button>
    <button @click="clearLine">清除折线</button>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted } from "vue";
  import "ol/ol.css";
  import Map from "ol/Map";
  import View from "ol/View";
  import TileLayer from "ol/layer/Tile";
  import XYZ from "ol/source/XYZ";
  import VectorLayer from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";
  import GeoJSON from "ol/format/GeoJSON";
  import { Style, Stroke, Fill } from "ol/style";
  import { Feature } from "ol";
  import { Point, LineString } from "ol/geom";
  import CircleStyle from "ol/style/Circle";
  import Icon from "ol/style/Icon";
  import Text from "ol/style/Text";
  import Draw from 'ol/interaction/Draw'
  let map = null;
  let view = null;
  let layer1 = null; //矢量底图
  let layer2 = null; //矢量注记
  let layers = null;

  let drawLineSource = null;    // 折线数据源
  let drawLineLayer = null;     // 折线图层
  let drawLineInteraction = null; // 绘制交互实例
  let isDrawingLine = false;    // 绘制状态标记，用于隔离点击加点冲突

  //开始绘制折线
  const startDrawingLine = () => {
    if (!map) return;
    //先移除旧交互，防止重复添加
    if (drawLineInteraction) {
      map.removeInteraction(drawLineInteraction);
    }
    drawLineInteraction = new Draw({
      source: drawLineSource,
      type: 'Polygon',
    });
    map.addInteraction(drawLineInteraction);
    isDrawingLine = true;
    // 绘制完成回调（双击结束一条线时触发）
    drawLineInteraction.on('drawend', (e) => {
      console.log(e.feature.getGeometry().getCoordinates());
    });
  };
  //结束绘制折线
  const stopDrawLine = () => {
    if (!map || !drawLineInteraction) return;
    if (drawLineInteraction) {
      map.removeInteraction(drawLineInteraction);
      drawLineInteraction = null;
    }
    isDrawingLine = false;
  };
  //清除折线
  const clearLine = () => {
    if (!drawLineSource) return;
    drawLineSource.clear();
  };

  onMounted(() => {
    view = new View({
      center: [115.85, 28.7],
      zoom: 8,
      projection: "EPSG:4326",
    });

    layer1 = new TileLayer({
      source: new XYZ({
        projection: "EPSG:4326",
        url: "http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=95e12b51a6d9a591822ef3a51d612352",
      }),
    });
    layer2 = new TileLayer({
      source: new XYZ({
        projection: "EPSG:4326",
        url: "http://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=95e12b51a6d9a591822ef3a51d612352",
      }),
    });

    layers = [layer1, layer2];

    map = new Map({
      target: "map",
      view: view,
      layers: layers,
    });

    //绘制折线
    drawLineSource = new VectorSource();
    drawLineLayer = new VectorLayer({
      source: drawLineSource,
      style: new Style({
        stroke: new Stroke({
          color: "blue",
          width: 2,
        }),
      }),
    });
    map.addLayer(drawLineLayer);
  });
  onUnmounted(() => {

  })
</script>

<style scoped>
  #map {
    width: 100%;
    height: 100%;
  }

  .addLine {
    position: absolute;
    height: 150px;
    width: 100px;
    bottom: 10px;
    left: 10px;
    z-index: 1000;
  }

  .addLine button {

    margin: 5px;
    padding: 5px 10px;
  }
</style>
