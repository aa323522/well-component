import {
  statsRange,
  overview,
  p1Real_time,
  year,
  week
} from "../mock/RiskMonitorMockData";
// import { wellList } from "../mock/DetectionAndImprovementMockData.js";

export const getOverViewTableList = async params => {
  return overview;
};

export const getStatsWeek = async params => {
  return week;
};

export const getStatsMonth = async params => {
  const res = await axios.get("p1/stats/month", { params });
  return res.data;
};

export const getRealTimeData = async params => {
  return p1Real_time;
};

export const getYearDataRate = async params => {
  return year;
};

export const setDataStart = async params => {
  const res = await axios.get("p1/star", { params });
  return res.data;
};

export const getDateRange = async params => {
  return statsRange;
};

// // production

// import axios from "axios";
// export const getOverViewTableList = async params => {
//   const res = await axios.post("p1/overview", params);
//   return res.data;
// };

// export const getStatsWeek = async params => {
//   const res = await axios.post("p1/stats/week", params);
//   return res.data;
// };

// export const getStatsMonth = async params => {
//   const res = await axios.post("p1/stats/month", params);
//   return res.data;
// };

// export const getRealTimeData = async params => {
//   const res = await axios.post("p1/real_time", params);
//   return res.data;
// };

// export const getYearDataRate = async params => {
//   const res = await axios.post("p1/year", params);
//   return res.data;
// };

// export const setDataStart = async params => {
//   const res = await axios.post("p1/star", params);
//   return res.data;
// };

// export const getDateRange = async params => {
//   const res = await axios.post("p1/stats/range", params);
//   return res.data;
// };
