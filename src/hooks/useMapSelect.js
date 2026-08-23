import Select from "ol/interaction/Select";
import mapState from "../stores/mapState";
import { Style, Stroke, Fill } from "ol/style";

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
      mapState.selectedInfo = feature.getProperties();
    } else {
      mapState.selectedInfo = null;
    }
  };

  //销毁
  const destroy = () => {
    if (select) {
      select.un("select", handleSelect);
      map.removeInteraction(select);
      select = null;
    }
  };

  return {
    initSelect,
    destroy,
  };
}
