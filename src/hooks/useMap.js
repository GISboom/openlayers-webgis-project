import Map from "ol/Map";
import View from "ol/View";
export default function useMap() {
  let map = null;
  let view = null;

  const initMap = (target,layers) => {
    view = new View({
      center: [115.85, 28.7],
      zoom: 5,
      projection: "EPSG:4326",
    });
    map = new Map({
      target: target,
      view: view,
      layers:layers,   
    })

    return {
        map,
        view
    }
  };
  return {
    initMap
  }

}
