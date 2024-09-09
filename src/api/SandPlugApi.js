import {
  getFractureDataMock,
  getSpRecordMock,
  SpWarningLogListDataMock,
  SpCurrentWarningMock,
  getSpWarningSetMock,
} from "../mock/mock";

export const getFractureData = async () => {
  return getFractureDataMock;
};

export const getSpRecord = async () => {
  return getSpRecordMock.data;
};

export const getSpWarningLogList = async () => {
  return SpWarningLogListDataMock;
};

export const editSpLogRemark = async (params) => {
  const res = await axios.post("fracture/editLogRemark", params);

  return res.data;
};

export const deleteSpLogRemark = async (params) => {
  const res = await axios.post("fracture/deleteLog", params);

  return res.data;
};

export const getSpCurrentWarning = async () => {
  return SpCurrentWarningMock;
};

export const confirmSpWarningResult = async (params) => {
  const res = await axios.post("fracture/confirmWarningLog", params);

  return res.data;
};

export const getSpWarningSet = async (params) => {
  return getSpWarningSetMock.data;
};

export const warningSetSp = async (params) => {
  const res = await axios.post("fracture/warningSet", params);

  return res.data;
};

// production
// import axios from "axios";

// // 获取砂堵压裂信息
// export const getFractureData = async () => {
//   const res = await axios.get("fracture/getFractureData");

//   return res.data;
// };

// // 获取砂堵历史压裂数据
// export const getSpRecord = async () => {
//   const res = await axios.get("fracture/getRecord");

//   return res.data;
// };

// // 获取砂堵风险日志
// export const getSpWarningLogList = async () => {
//   const res = await axios.get("fracture/getWarningLogList");

//   return res.data;
// };

// // 修改砂堵风险日志
// export const editSpLogRemark = async params => {
//   const res = await axios.post("fracture/editLogRemark", params);

//   return res.data;
// };

// // 删除砂堵风险日志
// export const deleteSpLogRemark = async params => {
//   const res = await axios.post("fracture/deleteLog", params);

//   return res.data;
// };

// // 砂堵获取最新告警信息
// export const getSpCurrentWarning = async params => {
//   const res = await axios.get("fracture/getUnconfirmedWarningLog", params);
//   return res.data;
// };

// // 砂堵接警处理
// export const confirmSpWarningResult = async params => {
//   const res = await axios.post("fracture/confirmWarningLog", params);

//   return res.data;
// };

// // 砂堵获取告警参数
// export const getSpWarningSet = async params => {
//   const res = await axios.get("fracture/getWarningSet", params);

//   return res.data;
// };

// // 砂堵设置告警参数
// export const warningSetSp = async params => {
//   const res = await axios.post("fracture/warningSet", params);

//   return res.data;
// };

// export const setMockData = async params => {
//   const res = await axios.get("fracture/udp_send", params);

//   return res.data;
// };

// export const clearRecord = async params => {
//   const res = await axios.get("rop/clearRecord", params);
//   return res.data;
// };
