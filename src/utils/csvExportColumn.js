export const riskInfoColumn = [
  { title: "时间", key: "time" },
  { title: "井深", key: "wellDepth" },
  { title: "风险类型", key: "type" },
  { title: "状态", key: "status" },
  { title: "备注", key: "remark" },
  { title: "钻头深度", key: "bitDepth" },
  { title: "转盘转速", key: "rotateSpeed" },
  { title: "扭矩", key: "rotaryTorque" },
  { title: "立管压力", key: "standpipePressure" },
  { title: "套管压力", key: "casingPressure" },
  { title: "累积泵冲", key: "spm" },
  { title: "总池体积", key: "totalPoolVol" },
  { title: "入口流量", key: "flowIn" },
  { title: "出口流量", key: "flowOut" },
  { title: "入口导电", key: "mci" },
  { title: "出口导电", key: "mco" },
  { title: "全烃", key: "gas" },
  { title: "大钩载荷", key: "who" },
  { title: "钻压", key: "wob" },
  { title: "层位/岩性", key: "horizonName" },
  { title: "地层", key: "formationType" },
  { title: "钻进工况", key: "drillingCondition" },
  { title: "流量差", key: "flowDifferential" },
  { title: "溢流风险", key: "kick" },
  { title: "井底压力", key: "bhpPre" },
  { title: "预测井漏", key: "proLostRisk" },
  { title: "井漏风险", key: "labelLostRisk" },
  { title: "卡钻概率", key: "stuck" },
];

export const detectionAndImprovementColumn = [
  { title: "时间", key: "time" },
  { title: "井深", key: "wellDepth" },
  { title: "进尺", key: "drillingFootage" },
  { title: "排量", key: "pumpRate" },
  { title: "层位", key: "horizonName" },
  { title: "钻进状态", key: "conditions" },
  { title: "钻压", key: "wob" },
  { title: "推荐钻压", key: "wobOpt" },
  { title: "钻速", key: "rop" },
  { title: "推荐钻速", key: "ropOpt" },
  { title: "优化钻速", key: "rotateOpt" },
  { title: "实际机械比能", key: "mse" },
  { title: "优化机械比能", key: "mseOpt" },
  { title: "转速", key: "rotateSpeed" },
  { title: "优化转速", key: "rotateOpt" },
  { title: "进尺时间", key: "drillingTime" },
  { title: "磨损度", key: "wearMonitoring" },
  { title: "入口流量", key: "flowIn" },
  { title: "出口流量", key: "flowOut" },
  { title: "钻头攻击性", key: "aggressive" },
  { title: "钻头磨损指标", key: "wear" },
  { title: "机械比能", key: "wearMse" },
];

export const lateralForceAndTorqueColumn = [
  { title: "井深", key: "depth" },
  { title: "侧向力", key: "LateralForce" },
  { title: "扭矩", key: "Torque" },
];

export const axialForceColumn = [
  { title: "井深", key: "depth" },
  { title: "轴向力", key: "AxialForce" },
  { title: "螺旋屈曲 + 旋转", key: "HelBuckling_rotate" },
  { title: "螺旋屈曲 + 滑动", key: "HelBuckling_slide" },
  { title: "正弦屈曲", key: "SinBuckling" },
];

export const trajectoryColumn = [
  { title: "井深", key: "js" },
  { title: "井斜角", key: "jxj" },
  { title: "狗腿度", key: "fwj" },
];

export const hookColumn = [
  { title: "井深", key: "depth" },
  { title: "下放F=0.1", key: "SlidingDownFF1" },
  { title: "下放F=0.2", key: "SlidingDownFF2" },
  { title: "下放F=0.3", key: "SlidingDownFF3" },
  { title: "下放F=0.4", key: "SlidingDownFF4" },
  { title: "下放F=0.5", key: "SlidingDownFF5" },
  { title: "上提F=0.1", key: "SlidingLiftingFF1" },
  { title: "上提F=0.2", key: "SlidingLiftingFF2" },
  { title: "上提F=0.3", key: "SlidingLiftingFF3" },
  { title: "上提F=0.4", key: "SlidingLiftingFF4" },
  { title: "上提F=0.5", key: "SlidingLiftingFF5" },
  { title: "空转", key: "RotateFree" },
];

export const torqueColumn = [
  { title: "井深", key: "depth" },
  { title: "空钻F=0.1", key: "FF1" },
  { title: "空钻F=0.2", key: "FF2" },
  { title: "空钻F=0.3", key: "FF3" },
  { title: "空钻F=0.4", key: "FF4" },
  { title: "空钻F=0.5", key: "FF5" },
];
