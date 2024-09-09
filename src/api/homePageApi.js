import mockData from "../mock/mock";
import { drillingOptions, loggingOptions } from "../utils/utils.js";
import { isEmpty, isArray } from "lodash";
export const getWellArea = async () => {
  // 本地测试用mock数据
  return mockData.data1;
};

export const getWellListById = async (params) => {
  // 本地测试用mock数据
  return mockData.data2;
};

export const getWellList = async (params) => {
  // 本地测试用mock数据
  return mockData.data3;
};

export const getAllWellDataApi = async (params) => {
  return params.name.includes("DRILLING")
    ? mockData.allWellData
    : mockData.allWellData2;
};

export const getWellFiled = async (params) => {
  const drillRes = mockData.drillField.data.map((item) => {
    const data = drillingOptions.find(
      (option) => option.value == item.COLUMN_NAME
    );
    return {
      label: item.COMMENTS,
      value: item.COLUMN_NAME,

      unit: data ? data.unit : "",
    };
  });

  const loggingRes = mockData.loggingField.data.map((item) => {
    const data = loggingOptions.find(
      (option) => option.value == item.COLUMN_NAME
    );
    return {
      label: item.COMMENTS,
      value: item.COLUMN_NAME,

      unit: data ? data.unit : "",
    };
  });

  const checkboxValue = localStorage.getItem("checkboxValue");
  if (checkboxValue) {
    const displayItem = checkboxValue.split(",");
    const filterItem = displayItem.filter((item) => {
      return (
        drillRes.map((item) => item.value).includes(item) ||
        loggingRes.map((item) => item.value).includes(item)
      );
    });

    if (!isEmpty(filterItem)) {
      localStorage.setItem("checkboxValue", filterItem.join(","));
    } else {
      localStorage.setItem(
        "checkboxValue",
        [drillRes[0], drillRes[1], drillRes[2]].join(",")
      );
    }
  }

  return { drill: drillRes, logging: loggingRes };
};

// production

// import axios from "axios";
// import { isEmpty, isArray } from "lodash";
// import { drillingOptions, loggingOptions } from "../utils/utils.js";
// export const getWellArea = async () => {
//   const res = await axios.get("api/cupb/blockwell/block/block_list");
//   return res.data;
// };

// export const getWellListById = async params => {
//   const res = await axios.get("api/cupb/blockwell/well/well_by_block_id", {
//     params
//   });
//   return res.data;
// };

// export const getWellList = async params => {
//   const res = await axios.get(
//     "api/cupb/blockwell/well/well_by_block_id_and_well_name",
//     { params }
//   );
//   return res.data;
// };

// export const getAllWellDataApi = async params => {
//   const res = await axios.get("api/cupb/blockwell/welldata/well_data_all", {
//     params
//   });
//   return res.data;
// };

// export const getWellFiled = async params => {
//   const res1 = axios.get("api/cupb/blockwell/well/getTableField", {
//     params: { ...params, type: "DRILLING" }
//   });
//   const res2 = axios.get("api/cupb/blockwell/well/getTableField", {
//     params: { ...params, type: "LOGGING" }
//   });
//   const res = await Promise.all([res1, res2]);

//   const drillRes = res[0].data.data.map(item => {
//     const data = (drillingOptions ? drillingOptions : []).find(
//       option => option.value == item.COLUMN_NAME
//     ).unit;
//     return {
//       label: item.COMMENTS,
//       value: item.COLUMN_NAME,
//       unit: data ? data.unit : ""
//     };
//   });

//   const loggingRes = res[1].data.data.map(item => {
//     const data = (loggingOptions ? loggingOptions : []).find(
//       option => option.value == item.COLUMN_NAME
//     );
//     return {
//       label: item.COMMENTS,
//       value: item.COLUMN_NAME,
//       unit: data ? data.unit : ""
//     };
//   });

//   const checkboxValue = localStorage.getItem("checkboxValue");
//   if (checkboxValue) {
//     const displayItem = checkboxValue.split(",");
//     const filterItem = displayItem.filter(item => {
//       return (
//         drillRes.map(item => item.value).includes(item) ||
//         loggingRes.map(item => item.value).includes(item)
//       );
//     });

//     if (!isEmpty(filterItem)) {
//       localStorage.setItem("checkboxValue", filterItem.join(","));
//     } else {
//       if (isArray(drillRes) && drillRes.length >= 3) {
//         localStorage.setItem(
//           "checkboxValue",
//           [drillRes[0], drillRes[1], drillRes[2]].join(",")
//         );
//       } else if (isArray(loggingRes) && loggingRes.length >= 3) {
//         localStorage.setItem(
//           "checkboxValue",
//           [loggingRes[0], loggingRes[1], loggingRes[2]].join(",")
//         );
//       }
//     }
//   }

//   return { drill: drillRes, logging: loggingRes };
// };
