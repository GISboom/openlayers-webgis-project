import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export default function(){
    //矢量底图
    const vec = new TileLayer({
        source: new XYZ({
            projection: "EPSG:4326",
            url: "http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=95e12b51a6d9a591822ef3a51d612352",
        })
    })

    //注记
    const label = new TileLayer({
        source: new XYZ({
            projection: "EPSG:4326",
            url:"http://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=95e12b51a6d9a591822ef3a51d612352"
        })
    })

    let layers = [vec, label]
    return layers
}