//切换底图

export default function useBaseMap(maplayers) {
   const changeBaseMap = (type) => {
    //Object.keys:是指对象的“键”名
    Object.keys(maplayers).forEach((key) => {

      maplayers[key].forEach((layer) => {
        layer.setVisible(key === type);
      });

    });

  };

  const initBaseMap = (type = "vector") => {
    changeBaseMap(type);
  };

  return {
    // changeVector,
    // changeImage,
    initBaseMap,
    changeBaseMap,
  };
}
