<template>
  <MapToolBar
    @search="searchCity"
    @draw="draw"
    @clearDraw="cleardraw"
    @drawIcon="drawIcon"
    @clearIcon="clearIcon"
    @locateNowCity="searchCity"
  />
  <ActionsMenu
    @changeBaseMap="changeBaseMap"
    @addGeoJson="addGeoJson"
    @startMeasure="startMeasure"
    @clearMeasure="clearMeasure"
  />
  <Popup />
  <LayerPanel :manager="layerManager" />
  <div id="map"></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, shallowRef } from "vue";
import { ref } from "vue";
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
import Select from "ol/interaction/Select";
import { defaults } from "ol/control/defaults";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import axios from "axios";
import useMap from "../hooks/useMap";
import useCity from "../hooks/useCity";
import useDraw from "../hooks/useDraw";
import useMarker from "../hooks/useMarker";
import useBaseMap from "../hooks/useBaseMap";
import useMapSelect from "../hooks/useMapSelect";
import useLayerManager from "../hooks/useLayerManager";
import useGeoJsonLayer from "../hooks/useGeoJsonLayer";
import useMeasure from "../hooks/useMeasure";
import getTiandituLayers from "../utils/mapLayer";
import MapToolBar from "./MapToolBar.vue";
import Popup from "./Popup.vue";
import LayerPanel from "./LayerPanel.vue";
import ActionsMenu from "./ActionsMenu.vue";
import layerState from "../stores/mapLayerState";

let { initMap } = useMap(); //hooks

let TDTlayers = getTiandituLayers(); //获取天地图图层
let allBaseMap = [...TDTlayers.image, ...TDTlayers.vector]; //...表示展开数组
let vectorLayer = TDTlayers.vector;
let imageLayer = TDTlayers.image;

let map = null;
let view = null;

let activeTool = null; //当前激活的绘制

let selectService = null;

// 保存地图服务
let cityService = null;

//图层管理器
const layerManager = shallowRef(null);
// 提前声明
// 工具栏调用的方法
const searchCity = async (keyword) => {
  if (cityService) {
    const result = await cityService.searchCity(keyword);
    layerManager.value.addLayer({
      id: "city",
      name: result.name,
      layer: result.layer,
    });
  }
};

let drawSurvice = null;
let iconSurvice = null;

//绘制图形
const draw = (drawType) => {
  //关闭标注绘制
  if (iconSurvice) {
    iconSurvice.stopIcon();
  }
  if (drawSurvice) {
    selectService.disable();
    drawSurvice.startdraw(drawType);
  }
  activeTool = "draw";
};
//清除绘制
const cleardraw = (presentDraw) => {
  if (drawSurvice) {
    drawSurvice.stopDraw();
  }
  drawSurvice.clearDraw(presentDraw);
};

//绘制图标
const drawIcon = (icon) => {
  //关闭普通绘制
  if (drawSurvice) {
    drawSurvice.stopDraw();
  }
  if (iconSurvice) {
    selectService.disable();
    iconSurvice.drawIcon(icon);
  }
  activeTool = "icon";
};

//清除图标
const clearIcon = () => {
  if (iconSurvice) {
    iconSurvice.stopIcon();
  }
  iconSurvice.clearIcon();
};

//切换底图
let baseMapService = null;
const changeBaseMap = (type) => {
  if (baseMapService) {
    baseMapService.changeBaseMap(type);
  }
};

//添加GeoJson
let geoJsonService = null;
const addGeoJson = async (file) => {
  if (geoJsonService) {
    const result = await geoJsonService.handleGeoJsonUpload(file);
    layerManager.value.addLayer({
      id: result.id,
      name: result.name,
      layer: result.layer,
    });
  }
};

let measureService = null;
const startMeasure = (type) => {
  if (measureService) {
    measureService.startMeasure(type);
  }
};
const clearMeasure = () => {
  if (measureService) {
    measureService.clearMeasure();
  }
};
onMounted(() => {
  // console.log(TDTlayers); //测试是否获取到图层
  // 创建地图
  const mapInfo = initMap("map", allBaseMap);

  map = mapInfo.map;
  view = mapInfo.view;

  // 初始化城市服务
  cityService = useCity(map, view);

  // 初始化绘制服务
  //drawService是useDraw的返回值
  drawSurvice = useDraw(map);

  // 初始化图标服务
  iconSurvice = useMarker(map);

  // 初始化底图服务
  baseMapService = useBaseMap(TDTlayers);
  baseMapService.initBaseMap("vector");

  //创建全局Select
  selectService = useMapSelect(map);
  selectService.initSelect();

  //图层管理器
  layerManager.value = useLayerManager(map);

  //GeoJson图层
  geoJsonService = useGeoJsonLayer(map);

  //测量工具
  measureService = useMeasure(map);
});

onUnmounted(() => {
  //销毁地图
  if (selectService) {
    selectService.destroy();
  }

  if (map) {
    map.setTarget(null);
    map = null;
  }
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
