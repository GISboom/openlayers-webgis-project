<template>
  <div class="header">
    <div class="nowCity">当前您所在位置：{{ nowCity }}</div>
    <div class="inputCity">
      <el-input
        v-model="inputCity"
        clearable
        style="width: 200px"
        placeholder="请输入地名"
        @keyup.enter="searchCity"
      />
    </div>

    <div class="drawbox">
      <el-select
        v-model="presentDraw"
        placeholder="选择绘制"
        style="width: 200px"
        @change="draw"
      >
        <el-option
          v-for="item in drawOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button @click="clearDraw">清除绘制</el-button>
    </div>
    <div class="iconBox">
      <el-select
        v-model="icon"
        placeholder="图标"
        style="width: 200px"
        @change="drawIcon"
      >
        <el-option
          v-for="item in iconsOption"
          :key="item.value"
          :label="item.lable"
          :value="item.value"
        />
      </el-select>
      <el-button @click="clearIcon">清除图标</el-button>
    </div>
  </div>
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
import Select from "ol/interaction/Select";
import { defaults } from "ol/control/defaults";
import ScaleLine from "ol/control/ScaleLine.js";
import FullScreen from "ol/control/FullScreen.js";
import OverviewMap from "ol/control/OverviewMap.js";
import MousePosition from "ol/control/MousePosition.js";
import Draw from "ol/interaction/Draw";
import CircleStyle from "ol/style/Circle";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import axios from "axios";

import { ref } from "vue";

const nowCity = ref("赣州市");
const adcode = ref("");

//搜索城市
const inputCity = ref("");

//下拉菜单
const presentDraw = ref("");
const drawOptions = [
  {
    value: "Point",
    label: "点",
  },
  {
    value: "LineString",
    label: "线",
  },
  {
    value: "Polygon",
    label: "面",
  },
  {
    value: "Circle",
    label: "圆",
  },
];
const icon = ref("");
const iconsOption = [
  {
    lable: "加油站",
    value: "gasStation",
    svg: `<svg t="1786933069728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12442" width="200" height="200"><path d="M128 810.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h384a42.666667 42.666667 0 0 1 42.666666 42.666667v341.333333h85.333334a85.333333 85.333333 0 0 1 85.333333 85.333333v170.666667a42.666667 42.666667 0 1 0 85.333333 0v-298.666667h-85.333333a42.666667 42.666667 0 0 1-42.666667-42.666666V273.664l-70.698666-70.698667 60.330666-60.330666 211.2 211.2A42.538667 42.538667 0 0 1 938.666667 384v384a128 128 0 1 1-256 0v-170.666667h-85.333334v213.333334h42.666667v85.333333H85.333333v-85.333333h42.666667zM213.333333 213.333333v256h298.666667V213.333333H213.333333z" fill="#000000" p-id="12443"></path></svg>`,
  },
  {
    lable: "公交站",
    value: "busStation",
    svg: `<svg t="1786933098385" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13532" width="200" height="200"><path d="M509.170273 1022.494826C224.270931 1017.738476-3.732832 786.302916 0.903104 506.521167 5.53904 223.90969 239.5635-4.334901 520.007526 1.565381c282.430856 5.900282 503.87206 229.087488 503.149577 514.287865-0.662277 282.55127-236.914393 511.21731-513.98683 506.64158z" fill="#3B80C3" p-id="13533"></path><path d="M512.60207 979.627469C252.869238 979.687676 42.325494 769.746002 43.047977 511.277516 43.770461 253.110066 254.856068 43.890875 514.287865 44.372531c256.662277 0.481656 466.844779 211.567262 466.724365 468.711194-0.180621 256.842897-210.603951 466.483537-468.41016 466.543744z" fill="#FFFFFF" p-id="13534"></path><path d="M443.424271 765.170273c0 23.902164-0.60207 47.864534 0.301035 71.706491 0.421449 11.920978-3.793039 15.111947-15.111948 14.750705-21.975541-0.78269-44.071496-0.662277-66.047036-0.060207-10.355597 0.301035-14.449671-2.76952-14.329257-13.727187 0.481656-49.068674-0.120414-98.197554 0.481656-147.266227 0.361242-28.116651 21.072437-48.165569 47.74412-47.864535 26.370649 0.240828 46.299153 20.590781 46.901223 48.827846 0.421449 24.504233 0 49.068674 0.060207 73.633114z" fill="#FFFFFF" p-id="13535"></path><path d="M932.84666 512.060207c0.120414 233.783631-188.267168 422.652869-421.388523 422.412041-231.796802-0.240828-420.003763-188.507996-420.365004-420.425211-0.301035-234.626529 185.497648-422.532455 419.883349-424.519285 231.555974-1.926623 421.749765 188.507996 421.870178 422.532455z" fill="#3B80C3" p-id="13536"></path><path d="M441.015992 198.261524h12.523048c4.15428 2.408278 8.368768 2.408278 12.523048 0h18.784572c6.261524 2.468485 12.523048 2.468485 18.784572 0h18.784572c6.261524 2.468485 12.523048 2.468485 18.784572 0h15.65381c4.15428 2.408278 8.368768 2.408278 12.523048 0h12.523048c28.658514 4.094073 57.678269 3.130762 86.457197 6.020696 25.648166 2.588899 50.272813 9.392286 73.332079 19.80809 25.708373 11.559737 38.291627 34.07714 40.940734 61.83255 1.204139 12.88429 0.301035 25.9492 0.541862 38.953904 0.120414 7.826905 1.685795 15.111947 10.536219 16.857949 21.01223 4.214487 30.223895 17.941675 32.270931 38.0508v56.353716c-4.274694 16.195673-12.402634 28.5381-30.344309 31.789275-10.476011 1.926623-12.342427 9.753528-12.402634 18.844779-0.180621 20.349953-0.060207 40.699906-0.060207 60.989652-0.060207 54.788335-0.120414 109.516463 0.060207 164.304798 0.060207 14.931326-3.251176 27.755409-14.991533 37.689558-7.224835 6.080903-9.572907 14.26905-10.295391 23.601129-2.649106 35.702728-20.771402 52.259643-56.474129 52.380056-35.582314 0.120414-51.537159-12.703669-57.678269-47.74412-1.866416-10.89746-7.285042-15.292568-17.761054-15.352776-75.078081-0.180621-150.216369-0.180621-225.29445 0-10.174976 0-16.135466 3.672625-18.42333 14.750706-9.633114 46.600188-29.983067 50.092192-68.033866 47.804327-29.862653-1.806209-43.108184-21.01223-45.937912-49.73095-1.023518-10.29539-2.950141-19.507056-11.138288-26.430856-11.318909-9.572907-14.329257-22.035748-14.329257-36.365005 0.060207-71.947319 0.120414-143.954845 0-215.902163-0.060207-23.119473-0.120414-23.059266-20.891815-31.668862-11.800564-4.936971-20.289746-13.004704-21.855127-26.250235-2.76952-23.360301-3.010348-46.720602 0.842897-70.020696 2.227658-13.787394 11.740357-20.771402 23.841957-24.022578 14.26905-3.793039 18.543744-12.462841 18.242709-26.430856-0.421449-21.19285-2.167451-42.626529 8.970838-62.61524 9.091251-16.316087 21.493885-27.574788 38.713076-34.498589 35.401693-14.26905 72.428975-18.844779 110.118532-19.687676 13.426152-0.421449 26.852305-0.963311 40.158043-3.311383z" fill="#FFFFFF" p-id="13537"></path><path d="M466.001881 198.261524c-4.15428 3.853246-8.368768 4.575729-12.523048 0h12.523048zM513.023518 573.772342c-63.578551 0-127.21731 0.060207-190.79586 0-19.266228 0-21.975541-2.649106-21.975541-21.493885-0.060207-60.989652-0.060207-121.979304 0-183.029163 0-17.881468 2.950141-20.771402 21.132643-20.771401 127.759172-0.060207 255.458137-0.060207 383.21731 0 18.242709 0 21.19285 2.829727 21.19285 20.711194 0.060207 61.531515-0.180621 123.063029 0.180621 184.594544 0.120414 14.871119-5.900282 20.289746-20.530574 20.169332-64.180621-0.361242-128.301035-0.180621-192.421449-0.180621zM512.78269 298.385701c-34.920038 0-69.840075 0.120414-104.760112-0.060207-18.182502-0.060207-20.229539-2.76952-20.229539-24.805268 0-22.156162 2.107244-25.106303 19.868297-25.16651 70.381938-0.120414 140.703669 0.120414 211.085607-0.180621 13.968015-0.060207 20.530574 5.478833 19.446848 19.507056-0.180621 2.588899 0 5.238006 0 7.826905-0.120414 20.349953-2.408278 22.818438-22.216369 22.878645-34.438382 0.060207-68.816557 0-103.194732 0zM362.445908 674.558796c-0.301035 15.834431-15.834431 30.765757-31.668862 30.344308-15.954845-0.421449-30.886171-15.954845-30.344308-31.668861 0.541863-16.075259 15.834431-30.765757 31.668861-30.404516 15.894638 0.481656 30.645343 15.834431 30.344309 31.729069zM693.825024 642.889934c15.834431-0.421449 31.126999 14.329257 31.668861 30.404516 0.541863 15.714017-14.389464 31.247413-30.344308 31.668861-15.834431 0.421449-31.367827-14.509878-31.668862-30.344308-0.301035-15.954845 14.449671-31.30762 30.344309-31.729069z" fill="#3B80C3" p-id="13538"></path></svg>`,
  },
  {
    lable: "地铁站",
    value: "subwayStation",
    svg: `<svg t="1786933121364" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14556" width="200" height="200"><path d="M469.333333 618.666667h-106.666666a21.333333 21.333333 0 0 1-21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333334-21.333334h298.666666a21.333333 21.333333 0 0 1 21.333334 21.333334v42.666666a21.333333 21.333333 0 0 1-21.333334 21.333334h-106.666666v234.666666h320a21.333333 21.333333 0 0 1 21.333333 21.333334v42.666666a21.333333 21.333333 0 0 1-21.333333 21.333334H149.333333a21.333333 21.333333 0 0 1-21.333333-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333333-21.333334h320V618.666667z m64-533.333334a21.333333 21.333333 0 0 1 21.333334 21.333334v21.333333h-40.32C725.376 129.28 896 301.333333 896 513.322667c0 95.573333-34.858667 185.749333-96.682667 255.637333l-6.058666 6.698667-62.592-57.984A299.456 299.456 0 0 0 810.666667 513.322667C810.666667 347.605333 676.906667 213.333333 512 213.333333s-298.666667 134.272-298.666667 299.989334c0 73.813333 26.581333 143.317333 73.898667 197.546666l5.333333 5.973334-62.805333 57.770666A384.768 384.768 0 0 1 128 513.322667C128 300.544 299.882667 128 512 128h-42.666667V106.666667a21.333333 21.333333 0 0 1 21.333334-21.333334h42.666666z" fill="#1296db" p-id="14557"></path></svg>`,
  },
  {
    lable: "停车场",
    value: "parkingLot",
    svg: `<svg t="1786933143207" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15604" width="200" height="200"><path d="M535.27241 618.35664a25.134528 25.134528 0 0 1 30.254525 10.007266H605.090544v-23.272711h-69.818134zM628.363256 628.363906h37.236338a28.392708 28.392708 0 0 1 23.272711-11.636356 27.229072 27.229072 0 0 1 9.774539 2.094544V605.091195H628.363256zM543.650586 418.909503a90.996302 90.996302 0 0 0 29.556344-19.549077 95.883571 95.883571 0 0 0 20.247258-29.090889 88.203576 88.203576 0 0 0 7.447268-35.839976 84.479942 84.479942 0 0 0-7.21454-35.374521 80.989036 80.989036 0 0 0-19.549078-27.694527 91.694483 91.694483 0 0 0-29.090889-18.618169 98.210842 98.210842 0 0 0-36.538157-6.749086h-128.930821v180.130786h128.930821a86.341759 86.341759 0 0 0 35.141794-7.214541z" fill="#5C88FF" p-id="15605"></path><path d="M511.999699 116.364255a325.81796 325.81796 0 1 0 325.817959 325.81796A325.81796 325.81796 0 0 0 511.999699 116.364255z m-132.421728 558.545074h-50.734511V200.844198h179.665332a151.039897 151.039897 0 0 1 61.672685 11.869082 142.196267 142.196267 0 0 1 44.916333 31.185434 127.069004 127.069004 0 0 1 27.229072 43.51997 133.352636 133.352636 0 0 1 9.309085 48.40724 139.636268 139.636268 0 0 1-9.541812 50.269056 135.912635 135.912635 0 0 1-27.694526 43.519971 131.258092 131.258092 0 0 1-44.916333 30.487252 157.323529 157.323529 0 0 1-60.974504 11.403628h-128.930821z m343.970674-29.090889h-6.050905a29.090889 29.090889 0 0 1-58.181778 0h-87.272668a29.090889 29.090889 0 0 1-58.181779 0h-6.050905a14.196354 14.196354 0 0 1-12.799991-20.712713l14.894535-29.556344a13.963627 13.963627 0 0 1 12.567265-7.912722h27.461799a6.749086 6.749086 0 0 1-6.981813-6.981813 80.756309 80.756309 0 0 1 53.527236-22.109076h38.399974a168.959885 168.959885 0 0 1 53.527236 22.109076 6.981813 6.981813 0 0 1-6.981813 6.981813h27.229072a13.963627 13.963627 0 0 1 12.567264 7.912722l14.894535 29.556344a14.196354 14.196354 0 0 1-12.567264 20.712713z" fill="#5C88FF" p-id="15606"></path><path d="M511.999699 0.000698a442.181517 442.181517 0 0 0-116.363558 869.003044A289.745257 289.745257 0 0 1 511.999699 1024a289.745257 289.745257 0 0 1 116.363557-154.996258A442.181517 442.181517 0 0 0 511.999699 0.000698z m0 814.544899a372.363382 372.363382 0 1 1 372.363382-372.363382 372.363382 372.363382 0 0 1-372.363382 372.363382z" fill="#5C88FF" p-id="15607"></path></svg>`,
  },
];

let map = null;
let view = null;
let layer1 = null; //矢量底图
let layer2 = null; //矢量注记
let layers = null;

let citySource = null;
let citylayer = null;
const key = 
import.meta.env.VITE_AMAP_KEY;

//含城市中心坐标
const fetchCityInfo = async (url) => {
  const res = await axios.get(url);
  return res.data;
};

const renderCityBoundary = (adcode, center) => {
  // 关键：先移除旧图层，避免重复叠加
  if (citylayer) {
    map.removeLayer(citylayer);
    citylayer = null;
  }
  //获取当前城市矢量范围
  citySource = new VectorSource({
    url: `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}.json`,
    format: new GeoJSON(),
  });
  citylayer = new VectorLayer({
    source: citySource,
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 0, 0, 0.1)",
      }),
      stroke: new Stroke({
        color: "#ff0000",
        width: 2,
      }),
    }),
  });
  map.addLayer(citylayer);

  //替代setTimeout，等geojson加载完成之后再做动画定位
  citySource.once("featuresloadend", () => {
    view.animate({
      zoom: 8,
      center: center,
      duration: 1000,
    });
  });

  // 捕获geojson加载失败
  citySource.once("featuresloaderror", () => {
    console.error("城市边界geojson加载失败 adcode:", adcodeVal);
  });
};

//加载城市地图
const loadCity = async (url) => {
  try {
    // 第一步：拿数据
    const cityData = await fetchCityInfo(url);
    // 第二步：处理数据
    const centerStr = cityData.districts[0].center;
    adcode.value = cityData.districts[0].adcode;
    // 字符串分割，每一项转数字
    const [lng, lat] = centerStr.split(",").map(Number);
    const cityCenter = [lng, lat];
    // console.log(cityCenter);

    // 第三步：更新视图
    renderCityBoundary(adcode.value, cityCenter);
  } catch (err) {
    console.error("获取城市信息失败：", err);
  }
};

//搜索城市
const searchCity = () => {
  if (!inputCity.value.trim()) return; //.trim()去除开头和结尾空格
  const url =
    `https://restapi.amap.com/v3/config/district?keywords=${inputCity.value.trim()}&subdistrict=0&key=` +
    key;
  loadCity(url);
};

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
const draw = (drawType) => {
  // console.log(drawType);
  if (!map) return;
  // 1. 先移除旧的绘制交互，关键步骤！
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
    console.log(e.feature.getGeometry().getCoordinates());
  });
};

//清除绘制
const clearDraw = () => {
  if (!drawSource) return;
  drawSource.clear();
};

//绘制图标
let iconSource = null;
let iconLayer = null;
//初始化图标图层
function initIconLayer() {
  iconSource = new VectorSource();
  iconLayer = new VectorLayer({
    source: iconSource,
  })
  map.addLayer(iconLayer);
}
//转换图标格式
function svgToDataUrl(svgStr) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
}
// 选中后直接获取对应图标 URL
const getCurrentIconUrl = () => {
  const target = iconsOption.find((item) => item.value === icon.value);
  // 找不到就返回默认图标，做容错
  return target ? svgToDataUrl(target.svg) : "/public/data/beijing.png";
};
const drawIcon = (icon) => {
  // console.log(icon);
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
    
    const iconUrl = getCurrentIconUrl();
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

//清除图标
const clearIcon = () => {
  if (!iconSource) return;
  iconSource.clear();
};

onMounted(async () => {
  view = new View({
    center: [115.85, 28.7],
    zoom: 4,
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

  initDrawLayer();
  initIconLayer();
  const ipurl = "https://restapi.amap.com/v3/ip?key=" + key;
  //获取当前城市信息
  const ipCity = await fetch(ipurl);
  const ipCityJson = await ipCity.json();
  // console.log(ipCityJson);
  nowCity.value = ipCityJson.city;
  adcode.value = ipCityJson.adcode;

  //开始动画定位到ip城市,并显示该城市矢量范围
  const url =
    `https://restapi.amap.com/v3/config/district?keywords=${adcode.value}&subdistrict=0&key=` +
    key;

  loadCity(url);
});
onUnmounted(() => {
  // 组件销毁前清理，防止内存泄漏
  if (draw) map.value.removeInteraction(draw);
});
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
.header {
  width: 100%;
  height: 10%;
  background-color: #4875cf;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.nowCity {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
}
.el-select {
  margin-right: 10px;
}
</style>
