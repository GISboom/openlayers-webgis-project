import { reactive } from "vue";
//图层状态管理
const layerState = reactive({
  layers: [],
});
/*
[
 {
   id:"city",
   name:"城市边界",
   layer:VectorLayer,
   visible:true
 }
]
*/
export default layerState;
