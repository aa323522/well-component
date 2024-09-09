import {
  gemData,
  warningLogList,
  warningSet,
  currentWarningInfo,
  unconfirmWarning,
} from "../mock/mock";

export const getGemData = async (params) => {
  // 本地测试用mock数据
  return gemData;
};

export const getWarningList = async () => {
  // 本地测试用mock数据
  return warningLogList;
};

export const getWarningSet = async () => {
  const res = await axios.get("rop/getWarningSet");

  return res.data;
};
export const getUnconfirmWarningLog = async () => {
  // 本地测试用mock数据
  return unconfirmWarning;
};

export const setWarningParams = async (params) => {
  const res = await axios.post("api/api/rop/warningSet", params);

  return res.data;
};

export const confirmWarningResult = async (params) => {
  const res = await axios.post("api/api/rop/confirmWarningLog", params);

  return res.data;
};

export const getCurrentWarning = async () => {
  // 本地测试用mock数据
  return currentWarningInfo;
};
export const editLogRemark = async (params) => {
  const res = await axios.post("rop/editLogRemark", params);

  return res.data;
};

export const deleteLogRemark = async (params) => {
  const res = await axios.post("rop/deleteLog", params);

  return res.data;
};

// production
// import axios from "axios";
// export const getGemData = async params => {
//   const res = await axios.get("rop/getGemData", { params });

//   return res.data;
// };

// export const getWarningList = async () => {
//   const res = await axios.get("rop/getWarningLogList");

//   return res.data;
// };

// export const getWarningSet = async () => {
//   const res = await axios.get("rop/getWarningSet");

//   return res.data;
// };
// export const getCurrentWarning = async params => {
//   const res = await axios.get("rop/getWarningLogList");

//   return res.data;
// };

// export const setWarningParams = async params => {
//   const res = await axios.post("rop/warningSet", params);

//   return res.data;
// };

// export const confirmWarningResult = async params => {
//   const res = await axios.post("rop/confirmWarningLog", params);

//   return res.data;
// };

// export const editLogRemark = async params => {
//   const res = await axios.post("rop/editLogRemark", params);

//   return res.data;
// };

// export const getUnconfirmWarningLog = async () => {
//   const res = await axios.get("rop/getUnconfirmWarngingLog");

//   return res.data;
// };

// export const deleteLogRemark = async params => {
//   const res = await axios.post("rop/deleteLog", params);

//   return res.data;
// };
