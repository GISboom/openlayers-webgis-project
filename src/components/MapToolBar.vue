<template>
  <div class="header">
    <div class="nowCity">当前您所在位置：{{ nowCity }}</div>
    <div class="inputCity">
      <el-input
        v-model="inputCity"
        clearable
        style="width: 200px"
        placeholder="请输入地名"
        @keyup.enter="search"
      />
    </div>

    <div class="drawbox">
      <el-select
        v-model="presentDraw"
        placeholder="选择绘制"
        style="width: 200px"
        @change="handleDraw"
      >
        <el-option
          v-for="item in drawOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button @click="handleClearDraw">清除绘制</el-button>
    </div>
    <div class="iconBox">
      <el-select
        v-model="icon"
        placeholder="图标"
        style="width: 200px"
        @change="handleDrawIcon"
      >
        <el-option
          v-for="item in iconOptions"
          :key="item.value"
          :label="item.lable"
          :value="item.value"
        />
      </el-select>
      <el-button @click="handleClearIcon">清除图标</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import useIPCity from "../hooks/useIPCity";
import { iconOptions } from "../config/iconOptions";
const nowCity = ref("");

//搜索框
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

const emit = defineEmits([
  "search",
  "draw",
  "clearDraw",
  "drawIcon",
  "clearIcon",
  "locateNowCity", //定位到当前城市，用的还是search中的方法
]);

const search = () => {
  if (!inputCity.value.trim()) return;

  emit("search", inputCity.value);
};

const handleDraw = (type) => {
  icon.value = "";
  emit("draw", type);
};

const handleClearDraw = () => {
  presentDraw.value = "";
  emit("clearDraw");
};

const handleDrawIcon = (icon) => {
  presentDraw.value = "";
  emit("drawIcon", icon);
};

const handleClearIcon = () => {
  icon.value = "";
  emit("clearIcon");
};
onMounted(() => {
  //获取当前ip城市，加载矢量边界
  let { getNowCity } = useIPCity();
  getNowCity().then((res) => {
    // console.log(res);

    nowCity.value = res;
    emit("locateNowCity", res);
  });
});
</script>
<style scoped>
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
