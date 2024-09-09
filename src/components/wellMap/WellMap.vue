<template>
  <div class="mapPage w-full h-full">
    <div id="map" class="w-full h-full"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import mapJSON from "../../assets/map.json";
export default {
  name: "WellMap",
  props: [],
  components: {},
  mounted () {
    let myChart = echarts.getInstanceByDom(document.getElementById("map"));
    if (myChart == null) {
      myChart = echarts.init(myChart);
    }
    echarts.registerMap("xa", mapJSON);
    var option = {
      geo: {
        map: "xa",
        zoom: 1,
        roam: true,
        center: [118.00853, 36.01078],
        label: {
          show: true,
          color: "rgba(255,255,255,0.2)"
        },
        itemStyle: {
          areaColor: "#080b1a",
          borderColor: "rgba(0,116,255,0.2)",
          borderWidth: 2,
          borderType: "dashed",
          emphasis: {
            areaColor: "#4f6ee9",
            color: "rgba(255,255,255,0.8)"
          }
        }
      },
      series: [
        //绘制一个新地图
        {
          type: "map",
          map: "xa",
          zoom: 1,
          roam: true,
          center: [118.00853, 36.01078],
          z: -1,
          itemStyle: {
            areaColor: "#2e488f",
            borderColor: "#0074ff",
            borderWidth: 5
          }
        },
        {
          type: "effectScatter", // 特效散点图
          coordinateSystem: "geo",
          symbol: "circle",
          symbolSize: function (val) {
            return 30 + (val[2] / 100) * 20;
          },
          colorBy: "series",
          //显示name并设置样式
          label: {
            show: true,
            formatter: function (data) {
              return data.value[2];
            },
            color: "#080b1a",
            fontSize: "16",
            offset: [0, 0],
            align: "center"
          },
          //涟漪效果设置
          rippleEffect: {
            color: "#32479d",
            number: 3,
            period: 4,
            scale: 2,
            brushType: "stroke"
          },
          itemStyle: {
            color: "#00e6ff",
            borderColor: "#32479d",
            borderWidth: 2
          },
          data: [
            { name: "蓝田", value: [118.00853, 34.181634, 50] },
            { name: "长安区", value: [118.00853, 34.110134, 30] },
            { name: "周至县", value: [118.00853, 34.010134, 2] },
            { name: "鄠邑区", value: [108.573479, 34.100134, 4] },
            { name: "临潼区", value: [109.283479, 34.510134, 3] },
            { name: "高陵区", value: [109.059479, 34.550134, 1] }
          ]
        }
      ]
    };
    myChart.setOption(option);
    // 同步缩放、偏移
    myChart.on("georoam", function (params) {
      var option = myChart.getOption(); //获得option对象
      if (params.zoom != null && params.zoom != undefined) {
        //捕捉到缩放时
        option.series[0].zoom = option.geo[0].zoom; //下层geo的缩放等级跟着上层的geo一起改变
        option.series[0].center = option.geo[0].center; //下层的geo的中心位置随着上层geo一起改变
      } else {
        //捕捉到拖曳时
        option.series[0].center = option.geo[0].center; //下层的geo的中心位置随着上层geo一起改变
      }
      myChart.setOption(option); //设置option
    });

    // options 为echart 的配置
    option && myChart.setOption(option, { notMerge: true });

    window.addEventListener("resize", function () {
      myChart.resize();
    });
  },
  data () {
    return {};
  }
};
</script>

<style lang="less"></style>
