import {
  getTrajectoryData,
  getWellStructureData,
  getPipeStructureData,
  getGjpzlistData,
  hookMockData,
  torqueData,
  bucklingLimitData,
  dragTorqueData,
  getNHGZNData,
} from "@/mock/frictionTorqueAnalysisMockData.js";

// 获取井眼轨迹
export const getTrajectory = () => {
  return getTrajectoryData;
};

// 获取井身结构
export const getWellStructure = () => {
  return getWellStructureData;
};

// .获取钻具组合
export const getPipeStructure = () => {
  return getPipeStructureData;
};

// // 获取灌浆数据

export const getGjpzlist = () => {
  return getGjpzlistData;
};

export const hookLoad = async (params) => {
  return hookMockData;
};

export const torque = () => {
  return torqueData;
};

export const bucklingLimit = () => {
  return bucklingLimitData;
};

export const dragTorque = () => {
  return dragTorqueData;
};

export const getNHGZN = () => {
  return getNHGZNData;
};
// production

// import axios from "axios";

// export const getTrajectory = async params => {
//   const res = await axios.get("api/mozu/getTrajectory", { params });
//   return res.data;
// };

// export const getWellStructure = async params => {
//   const res = await axios.get("api/mozu/getWellStructure", { params });
//   return res.data;
// };

// export const getPipeStructure = async params => {
//   const res = await axios.get("api/mozu/getPipeStructure", { params });
//   return res.data;
// };

// export const getGjpzlist = async params => {
//   const res = await axios.get("api/mozu/getGjpzlist", { params });
//   return res.data;
// };

// export const getNHGZN = async params => {
//   const res = await axios.get("api/mozu/getNHGZNJ", { params });
//   return res.data;
// };

// export const hookLoad = async params => {
//   const param = new URLSearchParams();
//   param.append("FF1", 0.1);
//   param.append("FF2", 0.2);
//   param.append("FF3", 0.3);
//   param.append("FF4", 0.4);
//   param.append("FF5", 0.5);
//   param.append("start_depth", params.start_depth);
//   param.append("end_depth", params.end_depth);
//   param.append("data_step", 30);
//   param.append("mud_density", params.mud_density);

//   param.append("gjpzlist", params.gjpzlist);
//   param.append("trajectory", params.trajectory);
//   param.append("pipe_structure", params.pipeStructure);
//   param.append("well_structure", params.wellStructure);

//   const res = await axios.post(`mozu/HookLoad`, param);

//   return res.data;
// };
// // ## 5.扭矩扫把图
// export const torque = async params => {
//   const param = new URLSearchParams();
//   param.append("FF1", 0.1);
//   param.append("FF2", 0.2);
//   param.append("FF3", 0.3);
//   param.append("FF4", 0.4);
//   param.append("FF5", 0.5);
//   param.append("start_depth", params.start_depth);
//   param.append("end_depth", params.end_depth);
//   param.append("data_step", 30);
//   param.append("mud_density", params.mud_density);

//   param.append("trajectory", params.trajectory);
//   param.append("pipe_structure", params.pipeStructure);
//   param.append("well_structure", params.wellStructure);

//   const res = await axios.post(`mozu/Torque`, param);

//   return res.data;
// };

// // 6.轴向力+屈曲极限
// export const bucklingLimit = async params => {
//   const param = new URLSearchParams();
//   param.append("end_depth", params.end_depth);
//   param.append("WOB", params.WOB);
//   param.append("TOB", params.TOB);
//   param.append("FF", 0.2);
//   param.append("mud_density", params.mud_density);

//   param.append("trajectory", params.trajectory);
//   param.append("pipe_structure", params.pipeStructure);
//   param.append("well_structure", params.wellStructure);

//   const res = await axios.post(`mozu/Buckling_Limit`, param);

//   return res.data;
// };

// // 7.摩阻扭矩计算（钻进扭矩和侧向力）

// export const dragTorque = async params => {
//   // const data = {
//   //   end_depth: 4000, // 井深
//   //   operation_mode: 4, //  工况（固定）
//   //   WOB: 100000, // 钻压
//   //   TOB: 15000, //扭矩
//   //   FF: 0.2, // 摩阻系数（固定）
//   //   mud_density: JSON.stringify({ md: 1.7 }), // 钻井液密度
//   //   trajectory: params.trajectory, //井眼轨迹
//   //   pip_structure: params.getPipeStructure, // 钻具组合
//   //   well_structure: params.wellStructure
//   // };
//   // const res = await axios.get("api/mozu/DragTorque", { params: data });
//   // return res.data;

//   const param = new URLSearchParams();
//   param.append("end_depth", params.end_depth);
//   param.append("operation_mode", 4);
//   param.append("WOB", params.WOB);
//   param.append("TOB", params.TOB);
//   param.append("FF", 0.2);
//   param.append("mud_density", params.mud_density);

//   param.append("trajectory", params.trajectory);
//   param.append("pipe_structure", params.pipeStructure);
//   param.append("well_structure", params.wellStructure);

//   const res = await axios.post(`mozu/DragTorque`, param);

//   return res.data;
// };
