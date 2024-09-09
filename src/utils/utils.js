export const drillingOptions = [
  {
    label: "井斜角",
    value: "ANGLE_DEVIATION",
    unit: "度"
  },
  {
    label: "方位角",
    value: "AZIMUTH",
    unit: "度"
  },
  {
    label: "转速",
    value: "ROTATE_SPEED",
    unit: "rpm"
  },
  {
    label: "转盘扭矩",
    value: "ROTARY_TORQUE",
    unit: "tone*m"
  },
  {
    label: "立管压力",
    value: "STANDPIPE_PRESSURE",
    unit: "Mpa"
  },
  {
    label: "入口流量",
    value: "FLOW_IN",
    unit: "L/s"
  },
  {
    label: "出口流量",
    value: "FLOW_OUT",
    unit: "L/s"
  },
  {
    label: "入口密度",
    value: "MUD_DENS_IN",
    unit: "g/cm^3"
  },
  {
    label: "出口密度",
    value: "MUD_DENS_OUT",
    unit: "g/cm^3"
  },
  {
    label: "大钩载荷",
    value: "WHO",
    unit: "tone"
  },
  {
    label: "钻压",
    value: "WOB",
    unit: "tone"
  },
  {
    label: "钻头直径",
    value: "BIT_DIAMETER",
    unit: "mm"
  },
  {
    label: "钻头进尺",
    value: "DRILLING_FOOTAGE",
    unit: "m"
  },
  {
    label: "机械钻速",
    value: "ROP",
    unit: "m/h"
  },
  {
    label: "排量",
    value: "PUMP_RATE",
    unit: "L/s"
  },
  {
    label: "可钻性",
    value: "DRILLABILITY"
  },
  {
    label: "入井新度",
    value: "BIT_IN"
  },
  {
    label: "机械比能",
    value: "MSE",
    unit: "J"
  },
  {
    label: "磨损指标",
    value: "BIT_WEAR"
  },
  {
    label: "优化钻压",
    value: "OPT_WOB",
    unit: "tone"
  },
  {
    label: "优化转速",
    value: "OPT_RPM",
    unit: "rpm"
  }
];

export const loggingOptions = [
  {
    label: "冲洗带地层电阻率",
    value: "RXO"
  },
  {
    label: "密度测井",
    value: "DEN"
  },
  {
    label: "地层真电阻率",
    value: "RT",
    unit: "N.m"
  },
  {
    label: "声波时差",
    value: "AC"
  },
  {
    label: "自然伽马",
    value: "GA"
  }
];

export const landLayerMapping = {
  N2d: { name: "独山子组", color: "#806000" },
  J1b: { name: "三工河组", color: "#BF8F00" },
  T1b: { name: "百口泉组", color: "#FFD966" },
  T2k: { name: "克拉玛依组", color: "#FFE699" },
  T3b: { name: "独山子组", color: "#FFF2CC" },
  P3w: { name: "上乌尔禾组", color: "#DBDBDB" },
  P2w: { name: "下乌尔禾组", color: "#FCE4D6" },
  P1f: { name: "风城组", color: "#DDEBF7" },
  P1j: { name: "佳木河组	", color: "#E2EFDA" }
};

export const getColor = index => {
  if (index == 0) {
    return "#FF007A";
  } else if (index == 1) {
    return "#00C2FF";
  } else if (index == 2) {
    return "#FFD400";
  }
};
