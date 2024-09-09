import { cloneDeep } from "lodash";
import mockData from "../mock/mock";
import { wellList } from "../mock/DetectionAndImprovementMockData.js";

export const getDrillData = async (params, type) => {
  // 本地测试用mock数据
  if (type === 0) {
    return mockData.drillData;
  }
  if (type === 1) {
    return mockData.drillData2;
  }
  if (type === 2) {
    return mockData.drillData3;
  }
};
export const getWellList = async (params, type) => {
  // 本地测试用mock数据
  return wellList;
};

// // production

// import axios from "axios";

// export const getDrillData = async params => {
//   const res = await axios.get("rop/getWellData", { params });
//   return res.data;
// };

// export const getWellList = async params => {
//   const res = await axios.get("rop/getWellList", { params });
//   return res.data;
// };
