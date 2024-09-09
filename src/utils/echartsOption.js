export const chartBarOption = {
  color: ["#A48DFF", "#FFBB0E", "#55ADFF", "#FD866B"],
  title: {
    text: ""
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    show: false,
    bottom: 0,
    data: ["溢流", "井漏", "卡钻", "硫化氢"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "6%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    axisLabel: {
      show: true,
      color: "#ffffff",
      fontSize: 16,
      interval: 0
    },
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "溢流", //'溢流', '井漏', '硫化氢', '卡钻'
      type: "bar",
      barGap: 0,
      barWidth: 20,
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      name: "井漏",
      type: "bar",
      barWidth: 20,
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      name: "卡钻",
      type: "bar",
      barWidth: 20,
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      name: "硫化氢",
      type: "bar",
      barWidth: 20,
      data: [0, 0, 0, 0, 0, 0, 0]
    }
  ],
  backgroundColor: "#093A6F"
};
