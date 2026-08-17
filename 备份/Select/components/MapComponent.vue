<template>
  <div id="map"></div>
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
  import Select from 'ol/interaction/Select'
  let map = null;
  let view = null;
  let layer1 = null; //矢量底图
  let layer2 = null; //矢量注记
  let layers = null;

  let jsonSource = null; // 用于存储加载的 GeoJSON 数据源
  let jsonLayer = null; // 用于存储加载的 GeoJSON 图层
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

     //加载GeoJSON数据
    jsonSource = new VectorSource({
      url: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
      format: new GeoJSON(),
    });
    //默认样式
    let jsonStyle = new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 0.2)',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    }),
      jsonLayer = new VectorLayer({
        source: jsonSource,
        style: jsonStyle,
      })
    map.addLayer(jsonLayer);

    let selectInteraction = new Select({
      layers: [jsonLayer],
    });
    map.addInteraction(selectInteraction);
    selectInteraction.on("select",(e)=>{
      console.log(e.target.getFeatures().getArray()[0].getProperties().name);
    })
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
