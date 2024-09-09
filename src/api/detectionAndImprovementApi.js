import { cloneDeep } from "lodash";
import {
  wellList,
  horizonNameList,
  rpm,
  wob,
  mseCalAndFull,
  ropOptData,
  ropOptData2,
  ropRecord,
  scatterPlot,
  envelopeCurve,
  heatMapMse,
  heatMapMseByDepth,
  heatMapRop,
  heatMapRopByDepth,
} from "../mock/DetectionAndImprovementMockData.js";

export const getWellList = async (params, type) => {
  // 本地测试用mock数据
  return wellList;
};

export const getHorizonNameList = async (params, type) => {
  // 本地测试用mock数据
  return horizonNameList;
};

export const getRpm = async (params, type) => {
  // 本地测试用mock数据
  return rpm;
};

export const getWob = async (params, type) => {
  // 本地测试用mock数据
  return wob;
};

export const getMseCalAndFull = async (params, type) => {
  // 本地测试用mock数据
  return mseCalAndFull;
};

export const getLatestData = async (params, type) => {
  const random = Math.random() > 0.5;
  // 本地测试用mock数据 获取当前数据
  return random ? ropOptData : ropOptData2;
};

export const getRopRecord = async () => {
  return ropRecord;
};

export const getScatterPlot = async () => {
  return scatterPlot;
};

export const getEnvelopeCurve = (async) => {
  return envelopeCurve;
};

export const getHeatMapMse = async () => {
  return heatMapMse;
};

export const getHeatMapRop = async () => {
  return heatMapRop;
};

export const getHeatMapMseByDepth = async () => {
  return heatMapMseByDepth;
};

export const getHeatMapRopByDepth = async () => {
  return heatMapRopByDepth;
};

export const deleteData = async (params) => {
  return;
};

export const setBitDiameter = async (params) => {
  return {
    success: true,
    msg: "",
    data: {},
  };
};

export const initDataType = async (params) => {
  return {
    success: true,
    msg: "",
    data: {},
  };
};

export const getDataType = async (params) => {
  return 2;
};

export const importAll = async (params) => {
  return {
    success: true,
    msg: "",
    data: [
      {
        wellDepth: 3380.04, //井深
        drillingFootage: 0, //进尺
        pumpRate: 0, //排量
        horizonName: "T2k", //层位
        time: "2022-07-06 04:47:18", //时间
        conditions: "钻进", //钻进状态
        rotateSpeed: 15.43, //转速
        wob: 10.87, //钻压
        rop: 19.95, //钻速
        mse: 69340.5332603403, //实际机械比能
        wobOpt: 30.87, //推荐钻压
        ropOpt: 149.95, //推荐钻速
        rotateOpt: 35.43, //优化转速
        mseOpt: 2.7585877459, //优化机械比能
        calcRop: 149.9514160156, //优化钻速
        drillingFootageL: 11,
        drillingTime: -34832, // 进尺时间
        wearMonitoring: 1, //磨损度，要乘12.5%
        wear: 1,
        aggressive: 30,
        wearMse: 30,
        flowIn: 1,
        flowOut: 2,
      },
      {
        wellDepth: 3381.04, //井深
        drillingFootage: 0, //进尺
        pumpRate: 0, //排量
        horizonName: "T2k", //层位
        time: "2022-07-06 04:47:18", //时间
        conditions: "钻进", //钻进状态
        rotateSpeed: 15.43, //转速
        wob: 16.87, //钻压
        rop: 19.95, //转速
        mse: 69640.5332603403, //实际机械比能
        wobOpt: 60.87, //推荐钻压
        ropOpt: 49.95, //推荐转速
        rotateOpt: 35.33, //优化钻速
        mseOpt: 12.7585877459, //优化机械比能
        calcRop: 19.9514160156, //优化转速
        drillingFootage: 11,
        drillingTime: -34832, // 进尺时间
        wearMonitoring: 3, //磨损度，要乘12.5%
        wear: 1,
        aggressive: 1111140,
        wearMse: 40,
        flowIn: 1,
        flowOut: 111111112,
      },
    ],
  };
};

// // production
// // 离线
const electronApiUrl = "http://localhost:10004/api/";
// // 离线 zhanrui
// // const electronApiUrl = "http://localhost:10003/";
// // dist
// // const electronApiUrl = location.origin + "/";
import axios from "axios";

// export const getWellList = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/getWellList", {
//       params,
//     });
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getHorizonNameList = async (params) => {
//   return {
//     success: true,
//     msg: "",
//     data: ["T1b", "T2k", "P3w", "P2w", "P1f", "P1j", "N2d", "T3b", "J1b"],
//   };
// };

// export const getRpm = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/getRpm", {
//       params,
//     });
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getWob = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/getWob", {
//       params,
//     });
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getMseCalAndFull = async (params) => {
//   try {
//     const res = await axios.get(
//       electronApiUrl + "rotarySpeed/getMseCalAndFull",
//       {
//         params,
//       }
//     );
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };
// export const getLatestData = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/getRopOptData", {
//       params,
//     });
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getRopRecord = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/getRopRecord", {
//       params,
//     });
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getScatterPlot = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/getScatterPlot", {
//       params,
//     });
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getEnvelopeCurve = async (params) => {
//   try {
//     const res = await axios.post(
//       electronApiUrl + "rotarySpeed/getEnvelopeCurve",
//       params
//     );
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getHeatMapMse = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/getHeatMapMse", {
//       params,
//     });
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getHeatMapRop = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/getHeatMapRop", {
//       params,
//     });
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getHeatMapMseByDepth = async (params) => {
//   try {
//     const res = await axios.get(
//       electronApiUrl + "rotarySpeed/getHeatMapMseByDepth",
//       { params }
//     );
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getHeatMapRopByDepth = async (params) => {
//   try {
//     const res = await axios.get(
//       electronApiUrl + "rotarySpeed/getHeatMapRopByDepth",
//       { params }
//     );
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const deleteData = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/clearRecord");
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const importExcel = async (params) => {
//   try {
//     const res = await axios.post(
//       electronApiUrl + "rotarySpeed/importData",
//       params
//     );
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const setBitDiameter = async (params) => {
//   try {
//     const res = await axios.post(
//       electronApiUrl + "rotarySpeed/setBitDiameter",
//       params
//     );
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const initDataType = async (params) => {
//   try {
//     const res = await axios.post(
//       electronApiUrl + "rotarySpeed/initDataType",
//       params
//     );
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getDataType = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/getDataType");
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const importAll = async (params) => {
//   try {
//     const res = await axios.post(electronApiUrl + "rotarySpeed/optAll", params);
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };
// // 废弃接口，后期删除
// export const downloadAll = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "rotarySpeed/optAll", {
//       params,
//     });
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };
