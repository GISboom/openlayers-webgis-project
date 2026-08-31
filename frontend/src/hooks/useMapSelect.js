import Select from "ol/interaction/Select";
import mapState from "../stores/mapState";

export default function useMapSelect(map, layer) {
  let select = null;
  //创建Select
  const initSelect = () => {
    select = new Select({
      //所有VectorLayer都参与
      filter: (feature, layer) => {
        return layer && layer.getSource();
      },
    });
    map.addInteraction(select);
    select.on("select", handleSelect);
  };

  //点击事件
  const handleSelect = (e) => {
    const feature = e.selected[0];
    if (feature) {
      const properties = feature.getProperties();
      delete properties.geometry;
      mapState.selectedInfo = properties;
    } else {
      mapState.selectedInfo = null;
    }
  };
  const clearSelection = () => {
    select.getFeatures().clear();
    mapState.selectedInfo = null;
  };
  //销毁
  const destroy = () => {
    if (select) {
      select.un("select", handleSelect);
      map.removeInteraction(select);
      select = null;
    }
  };
  // =========新增开关方法========
  /** 禁用要素选择 */
  const disable = () => {
    select.setActive(false);
    clearSelection(); // 同时清空已选中，关闭弹窗
  };
  /** 启用要素选择 */
  const enable = () => {
    select.setActive(true);
  };

  return {
    initSelect,
    destroy,
    enable,
    disable,
  };
}
