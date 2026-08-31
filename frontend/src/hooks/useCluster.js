import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";


export default function useCluster(map) {

  let source = null;
  let clusterSource = null;
  let clusterLayer = null;

  const initCluster = (features = [], distance = 100) => {
    source = new VectorSource({
      features,
    });
    clusterSource = new Cluster({
      distance,
      source,
    });
    clusterLayer = new VectorLayer({
      source: clusterSource,
      style: (feature) => {

        const features =
          feature.get("features");

        const size = features.length;

        const style = new Style({
            image: new CircleStyle({
            radius: size === 1 ? 6 : 15,
            fill: new Fill({
              color:
                size === 1
                  ? "#409eff"
                  : "#f56c6c",
            }),
            stroke: new Stroke({
              color: "#fff",
              width: 2,
            }),
          }),
          text: new Text({
            text:
              size > 1
                ? String(size)
                : "",
            fill: new Fill({
              color: "#fff",
            }),
          }),
        })
        return style;
      },
    });
    map.addLayer(clusterLayer);
  };

  const clearCluster = () => {
    if (source) {
      source.clear();
    }
  };

  const destroy = () => {

    if (clusterLayer) {
      map.removeLayer(clusterLayer);
    }

    clusterLayer = null;
    clusterSource = null;
    source = null;

  };


  return {
    initCluster,
    clearCluster,
    destroy,
  };

}