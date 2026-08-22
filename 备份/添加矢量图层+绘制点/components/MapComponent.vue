<template>
  <div id="map"></div>
  <div class="btns">
    <button id="bj" @click="moveToBJ">北京</button>
    <button id="up" @mousedown="startMove('up')" @mouseup="stopMove" @mouseleave="stopMove">
      上
    </button>
    <button id="down" @mousedown="startMove('down')" @mouseup="stopMove" @mouseleave="stopMove">
      下
    </button>
    <button id="left" @mousedown="startMove('left')" @mouseup="stopMove" @mouseleave="stopMove">
      左
    </button>
    <button id="right" @mousedown="startMove('right')" @mouseup="stopMove" @mouseleave="stopMove">
      右
    </button>
  </div>
  <div class="changemap">
    <button id="sitelite" @click="changesite">卫星地图</button>
    <button id="vector" @click="changevector">矢量地图</button>
  </div>
  <div class="clearAllFeatures">
    <button @click="clearAllFeatures()">清除绘制要素</button>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted } from "vue";
  import "ol/ol.css";
  import Map from "ol/Map";
  import View from "ol/View";
  import TileLayer from "ol/layer/Tile";
  import XYZ from "ol/source/XYZ";
  import OSM from "ol/source/OSM";
  import WMTS from "ol/source/WMTS";
  import VectorLayer from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";
  import GeoJSON from "ol/format/GeoJSON";
  import { Style, Stroke, Fill } from "ol/style";
  import Cluster from 'ol/source/Cluster.js';
  import { Feature } from "ol";
  import { Point, LineString } from "ol/geom";
  import CircleStyle from "ol/style/Circle";
  import Icon from "ol/style/Icon";
  import Text from "ol/style/Text";
  let map = null;
  let view = null;
  let layer1 = null; //矢量底图
  let layer2 = null; //矢量注记
  let layer3 = null; //卫星影像底图
  let layer4 = null; //卫星影像注记
  let layers = [];

  let jsonSource = null; // 用于存储加载的 GeoJSON 数据源
  let jsonLayer = null; // 用于存储加载的 GeoJSON 图层

  let citySource = null;
  let cityLayer = null;


  const moveToBJ = () => {
    view.animate({
      center: [116.407395, 39.904211],
      duration: 2000,
      zoom: 10,
    });
  };

  const moveStep = 0.1;
  const moveInterval = 80;
  let moveTimer = null;

  const doMove = (dir) => {
    const [lon, lat] = view.getCenter();
    let newLon = lon;
    let newLat = lat;
    switch (dir) {
      case "up":
        newLat += moveStep;
        break;
      case "down":
        newLat -= moveStep;
        break;
      case "left":
        newLon -= moveStep;
        break;
      case "right":
        newLon += moveStep;
        break;
    }
    view.animate({ center: [newLon, newLat], duration: 100 });
  };

  const startMove = (dir) => {
    doMove(dir);
    moveTimer = setInterval(() => doMove(dir), moveInterval);
  };

  const stopMove = () => {
    if (moveTimer) {
      clearInterval(moveTimer);
      moveTimer = null;
    }
  };
  //切换底图
  const changesite = () => {
    layer1.setZIndex(10)
    layer2.setZIndex(11)
    layer3.setZIndex(50)
    layer4.setZIndex(51)
  };
  const changevector = () => {
    layer3.setZIndex(10)
    layer4.setZIndex(11)
    layer1.setZIndex(50)
    layer2.setZIndex(51)
  };
  //清除点要素
  let pointSource = null;
  let pointLayer = null;
  const clearAllFeatures = () => {
    // 防御判断：地图/点位数据源还没初始化时直接return，防止报错
    if (!pointSource) return
    // OpenLayers原生方法，清空该source下所有点要素
    pointSource.clear()
  };

  //线要素
  let lineSource = null;
  let lineLayer = null;

  //绘制线要素
  let drawLineSource = null;
  let drawLineLayer = null;
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
    // layer3 = new TileLayer({
    //   source: new XYZ({
    //     projection: "EPSG:4326",
    //     url: "http://t0.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=95e12b51a6d9a591822ef3a51d612352",
    //   }),
    // });
    // layer4 = new TileLayer({
    //   source: new XYZ({
    //     projection: "EPSG:4326",
    //     url: "http://t0.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=95e12b51a6d9a591822ef3a51d612352",
    //   }),
    // });

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

    //处理数据要异步，在回调函数中
    jsonSource.on('change', () => {
      let features = jsonSource.getFeatures();
      // console.log(features[0].values_.name);
      if (features.length > 0) {
        // 可以在这里对 features 进行进一步处理，例如添加到地图上
        let citiesData = features.map(feature => feature.getProperties());//内置方法，获取属性
        // console.log(citiesData);
      }
    });

    //鼠标移动到某个省份，该省份高亮显示
    //1.绑定事件
    //2.先获取鼠标位置
    //3.获取要素信息
    //4.判断鼠标是否在要素内
    //5.如果在要素内，设置样式，如果不在要素内，恢复默认样式

    let highlightedFeature = null;// 用于存储当前高亮的要素，要在外部定义，以便在事件处理函数中访问
    map.on('pointermove', (e) => {
      //高亮样式
      let highlightStyle = new Style({
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 0.8)',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.2)',
        }),
      });
      //恢复上一个高亮要素的样式
      if (highlightedFeature) {
        highlightedFeature.setStyle(jsonStyle);
        highlightedFeature = null;
      }

      //获取鼠标位置
      let coordinate = e.coordinate;
      let foundFeature = jsonSource.getFeaturesAtCoordinate(coordinate);//第二种方法
      // console.log(foundFeature);
      if (foundFeature.length > 0) {
        highlightedFeature = foundFeature[0];
        //设置高亮样式
        foundFeature[0].setStyle(highlightStyle);
      }
      // let features = jsonSource.getFeatures();
      // if (features.length > 0) {
      //   let foundFeature = null;// 用于存储找到的要素
      //   for (let feature of features) {
      //     if (feature.getGeometry().intersectsCoordinate(coordinate)) {
      //       highlightedFeature = feature;
      //       foundFeature = feature;//intersectsCoordinate返回true或false，判断鼠标是否在要素内
      //       break;
      //     }
      //   }
      //   if (foundFeature) {
      //     //设置高亮样式
      //     foundFeature.setStyle(highlightStyle);
      //   }
      // }
    })


    //添加地图的点击事件，点击某个省份，显示该省份的信息
    //1.绑定事件
    //2.获取鼠标位置
    //3.获取要素信息
    //4.判断鼠标是否在要素内
    map.on("click", (e) => {
      // console.log(e.coordinate);
      let coordinate = e.coordinate;
      let features = jsonSource.getFeatures();
      if (features.length > 0) {
        let foundFeature = null;// 用于存储找到的要素
        for (let feature of features) {
          if (feature.getGeometry().intersectsCoordinate(coordinate)) {
            foundFeature = feature;//intersectsCoordinate返回true或false，判断鼠标是否在要素内
            break;
          }
        }
        if (foundFeature) {
          //获取要素的属性信息
          let properties = foundFeature.getProperties();
          // console.log(properties);
          //显示要素的信息
        }
      }
    })


    //添加一个点要素
    //1.创建一个点要素
    //2.创建一个矢量图层
    //3.将点要素添加到矢量图层中
    //4.将矢量图层添加到地图中

    //点位配置数组，只维护原始数据，新增/删改只在这里操作
    const markerList = [
      { name: "北京", coord: [116.40, 39.91] },
      { name: "天津", coord: [117.20, 39.08] },
      { name: "上海", coord: [121.47, 31.23] },
      { name: "重庆", coord: [106.55, 29.56] },
      { name: "石家庄", coord: [114.51, 38.04] },
      { name: "太原", coord: [112.55, 37.87] },
      { name: "呼和浩特", coord: [111.75, 40.82] },
      { name: "沈阳", coord: [123.43, 41.80] },
      { name: "长春", coord: [125.33, 43.88] },
      { name: "哈尔滨", coord: [126.64, 45.77] },
      { name: "南京", coord: [118.78, 32.04] },
      { name: "杭州", coord: [120.15, 30.28] },
      { name: "合肥", coord: [117.28, 31.86] },
      { name: "福州", coord: [119.30, 26.08] },
      { name: "南昌", coord: [115.85, 28.70] },
      { name: "济南", coord: [117.00, 36.67] },
      { name: "郑州", coord: [113.66, 34.76] },
      { name: "武汉", coord: [114.31, 30.52] },
      { name: "长沙", coord: [112.93, 28.23] },
      { name: "广州", coord: [113.27, 23.13] },
      { name: "南宁", coord: [108.32, 22.82] },
      { name: "海口", coord: [110.32, 20.03] },
      { name: "成都", coord: [104.07, 30.67] },
      { name: "贵阳", coord: [106.63, 26.65] },
      { name: "昆明", coord: [102.71, 25.04] },
      { name: "拉萨", coord: [91.11, 29.64] },
      { name: "西安", coord: [108.95, 34.27] },
      { name: "兰州", coord: [103.83, 36.06] },
      { name: "西宁", coord: [101.78, 36.62] },
      { name: "银川", coord: [106.27, 38.48] },
      { name: "乌鲁木齐", coord: [87.62, 43.82] },
      { name: "香港", coord: [114.17, 22.28] },
      { name: "澳门", coord: [113.55, 22.19] },
      { name: "台北", coord: [121.50, 25.05] }
    ]
    // 2. 循环批量生成Feature
    const markerFeatures = markerList.map(item => {
      const feat = new Feature({
        geometry: new Point(item.coord),
        name: item.name,
      })
      // const singleStyle = markerStyle.clone()
      // feat.setStyle(singleStyle)
      feat.setStyle(new Style({
        image: new Icon({
          scale: 0.1,
          src: '/public/data/beijing.png',
        }),
        text: new Text({
          text: item.name,
          font: '12px sans-serif',
          fill: new Fill({ color: 'rgba(255, 255, 255, 0.8)' }),
          stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.8)', width: 2 }),
          offsetY: -15,
        }),

      }),)
      return feat
    })
    // 4. 一次性放进数据源
    citySource = new VectorSource({
      features: markerFeatures,
    })
    cityLayer = new VectorLayer({
      source: citySource,
    })
    map.addLayer(cityLayer);

    //绘制点要素
    pointSource = new VectorSource({
      features: [],
    })
    pointLayer = new VectorLayer({
      source: pointSource,
    })
    map.addLayer(pointLayer);//只在初始化添加一次，不要写在click事件内！
    //鼠标点，创建点要素
    map.on("click", (e) => {
      let coordinate = e.coordinate;
      let newPointFeature = new Feature({
        geometry: new Point(coordinate),
        name: "新点",
      })
      newPointFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: 'rgba(255, 0, 0, 0.8)' }),
            stroke: new Stroke({ color: 'rgba(255, 255, 255, 0.8)', width: 1 }),
          }),
          text: new Text({
            text: `经纬度：${coordinate[0].toFixed(1)}, ${coordinate[1].toFixed(1)}`,
            font: '12px sans-serif',
            fill: new Fill({ color: 'rgba(255, 255, 255, 0.8)' }),
            stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.8)', width: 2 }),
            offsetY: -15,
          }),
        }))
      pointSource.addFeature(newPointFeature);
    })

    //绘制线要素
    //固定点
    let lineFeature = new Feature({
      geometry: new LineString([[115.85, 28.704211], [116.407395, 39.904211]]),
      name: "南昌-北京",
    })
    lineFeature.setStyle(new Style({
      stroke: new Stroke({
        color: 'rgba(0, 255, 0, 0.8)',
        width: 2,
      }),
    }))
    lineSource = new VectorSource({
      features: [lineFeature],
    })
    lineLayer = new VectorLayer({
      source: lineSource,
    })
    map.addLayer(lineLayer);
  });

  //手动绘制折线
  //1.map绑定点击事件，获取鼠标点击的坐标
  //2.将坐标存入数组中
  //3.当数组中有两个及以上的坐标时，创建折线
  
  onUnmounted(() => {
    //清除平移定时器
    if (moveTimer) clearInterval(moveTimer)
    //销毁地图实例，移除所有监听，防止内存泄漏
    if (map) {
      map.setTarget(null)
      map = null
    }
  })
</script>

<style scoped>
  #map {
    width: 100%;
    height: 100%;
  }

  .btns {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 132px;
    height: 132px;
    z-index: 999;
  }

  .btns button {
    position: absolute;
    width: 44px;
    height: 44px;
    border: none;
    background: #fff;
    color: #333;
    font-size: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btns button:hover {
    background: #f0f0f0;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  }

  .btns button:active {
    transform: scale(0.96);
  }

  #up {
    top: 0;
    left: 44px;
  }

  #down {
    top: 88px;
    left: 44px;
  }

  #left {
    top: 44px;
    left: 0;
  }

  #right {
    top: 44px;
    left: 88px;
  }

  #bj {
    top: 44px;
    left: 44px;
  }

  .changemap {
    padding: 5px;
    position: absolute;
    top: 20px;
    right: 15px;
    width: 100px;
    height: 100px;
    z-index: 999;
  }

  .changemap button {
    width: 84px;
    height: 44px;
    border: none;
    background: #fff;
    color: #333;
    font-size: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .changemap #sitelite {
    margin-bottom: 10px;
  }

  .clearAllFeatures {
    padding: 5px;
    position: absolute;
    bottom: 20px;
    right: 15px;
    width: 120px;
    height: 50px;
    z-index: 999;
  }

  .clearAllFeatures button {
    width: 100%;
    height: 100%;
    border: none;
    background: #fff;
    color: #333;
    font-size: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
  }
</style>
