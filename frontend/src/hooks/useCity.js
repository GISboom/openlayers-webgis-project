import axios from "axios";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from "ol/style";
/*
8.23 13:32
添加了图层管理功能
需要改动这里的代码

*/
export default function useCity(map, view) {
  let citySource = null;
  let citylayer = null;
  const key = import.meta.env.VITE_AMAP_KEY;

  //含城市中心坐标
  const fetchCityInfo = async (keyword) => {
    const url =
      `https://restapi.amap.com/v3/config/district?keywords=${keyword.trim()}&subdistrict=0&key=` +
      key;
    const res = await axios.get(url);
    return res.data;
  };

  // 根据城市名称获取城市边界
  const renderCityBoundary = (adcode, center) => {
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
      console.error("城市边界geojson加载失败 adcode:", adcode);
    });

    //返回图层
    return citylayer;
  };

  // 对外暴露的搜索方法
  const searchCity = async (keyword) => {
    if (!keyword) return;

    try {
      // 第一步：拿数据
      const cityData = await fetchCityInfo(keyword);
      // 第二步：处理数据
      const district = cityData.districts[0];

      const adcode = district.adcode;
      // 字符串分割，每一项转数字
      const [lng, lat] = district.center.split(",").map(Number);

      const center = [lng, lat];
      // 第三步：更新视图
      const layer = renderCityBoundary(adcode, center);      
      return {
        name: district.name,
        adcode,
        center,
        layer,
      };
    } catch (error) {
      console.error("城市搜索失败", error);
    }
  };

  return {
    searchCity,
      };
}
