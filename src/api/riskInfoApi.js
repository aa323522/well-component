import {
  currentRiskData,
  riskData,
  riskTableData,
  currentRiskData2,
  dataProcess,
  algorithmList,
} from "../mock/RiskInfoMockData";

// 历史
export const getRiskData = async (params) => {
  return riskData;
};

// 最新值
export const getRiskCurrentData = async () => {
  return Math.random() > 0.5 ? currentRiskData : currentRiskData2;
};

export const clearRecord = () => {
  alert();
};

export const getWarningLogList = async (params) => {
  return riskTableData;
};

export const saveWarningLog = async (params) => {
  console.log(params);
};

export const getUnconfirmedLogList = async (params) => {
  return riskTableData;
};

export const riskDeleteLogRemark = async (params) => {
  return;
};

export const riskEditLogRemark = async (params) => {
  return;
};

export const getAlgorithmList = async (params) => {
  return algorithmList;
};

export const getDataProcess = async (params) => {
  console.log(params);
  return dataProcess;
};
export const algorithmUpdate = async (params) => {
  return;
};

export const getRiskURL = async (params) => {
  return {
    success: true,
    msg: "",
    data: { url: "1111" },
  };
};

export const setRiskURL = async (params) => {
  return {
    success: true,
    msg: "",
    data: {},
  };
};

export const getStuck = async (params) => {
  return {
    success: true,
    msg: "",
    data: { stuck: 10 },
  };
};

// production
// 离线
// // const electronApiUrl = "http://localhost:10004/api/";
// // 离线 zhanrui
// const electronApiUrl = "http://localhost:10004";
// // dist
// // const electronApiUrl = location.origin + "/";
// import axios from "axios";

// export const getRiskData = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "/risk/getRecord", {
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

// export const getRiskCurrentData = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "/risk/getRiskData", {
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

// export const clearRecord = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "/risk/clearRecord");
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const getWarningLogList = async (params) => {
//   try {
//     const res = await axios.get(electronApiUrl + "/risk/getWarningLogList");
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const saveWarningLog = async (params) => {
//   try {
//     const res = await axios.post(
//       electronApiUrl + "risk/saveWarningLog",
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

// export const getUnconfirmedLogList = async (params) => {
//   try {
//     const res = await axios.get(
//       electronApiUrl + "/risk/getUnconfirmedLogList",
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

// export const riskEditLogRemark = async (params) => {
//   // const res = await axios.post("/risk/editLogRemark", params);
//   // return res.data;
//   try {
//     const res = await axios.post(
//       electronApiUrl + "/risk/editLogRemark",
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

// export const riskDeleteLogRemark = async (params) => {
//   // const res = await axios.post("/risk/deleteLog", params);
//   // return res.data;
//   try {
//     const res = await axios.post(electronApiUrl + "/risk/deleteLog", params);
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// // 获取模型列表;
// export const getAlgorithmList = async (params) => {
//   // const res = await axios.get("/risk/getAlgorithmList", { params });
//   // return res.data;
//   try {
//     const res = await axios.get(electronApiUrl + "/risk/getAlgorithmList", {
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

// // 获取优化数据;
// export const getDataProcess = async (params) => {
//   // const res = await axios.get("/risk/getDataProcess", { params });
//   // return res.data;
//   try {
//     const res = await axios.get(electronApiUrl + "/risk/getDataProcess", {
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

// // 保存模型;
// export const algorithmUpdate = async (params) => {
//   // const res = await axios.post("/risk/algorithmUpdate", params);
//   // return res.data;
//   try {
//     const res = await axios.post(
//       electronApiUrl + "/risk/algorithmUpdate",
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

// export const getRiskURL = async () => {
//   try {
//     const res = await axios.get(electronApiUrl + "/risk/getURL");
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };

// export const setRiskURL = async (params) => {
//   try {
//     const res = await axios.post(electronApiUrl + "/risk/setURL", params);
//     return res.data;
//   } catch (e) {
//     return {
//       data: {
//         success: false,
//       },
//     };
//   }
// };
