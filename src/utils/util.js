/**
 * 时间戳
 * @param：{string}     timestamp       时间戳,必填
 * @returns：{string}
 */
const timestampToTime = timestamp => {
  if (timestamp == "" || timestamp == null || timestamp == "null") {
    return "";
  }
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  let h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  let m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
};
/**
 * 时间戳转yyyy-mm-dd
 * @param：{string}     timestamp       时间戳,必填
 * @returns：{string}
 */
const timestampToymd = timestamp => {
  if (timestamp == "" || timestamp == null || timestamp == "null") {
    return "";
  }
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + "-";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  return Y + M + D;
};

// 获取当前 年月日时分秒
export function getCurrentTime() {
  let date = new Date();
  let Y = date.getFullYear();
  let M = date.getMonth() + 1;
  let D = date.getDate();
  let H = date.getHours();
  let m = date.getMinutes() > 10 ? date.getMinutes() : "0" + date.getMinutes();
  let s = date.getSeconds();
  M = M < 10 ? "0" + M : M;
  D = D < 10 ? "0" + D : D;
  H = H < 10 ? "0" + H : H;
  s = s < 10 ? "0" + s : s;
  return Y + "年" + M + "月" + D + "日" + H + ":" + m + ":" + s;
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = callback => {
  function listen() {
    callback();
  }
  document.addEventListener("fullscreenchange", function() {
    listen();
  });
  document.addEventListener("mozfullscreenchange", function() {
    listen();
  });
  document.addEventListener("webkitfullscreenchange", function() {
    listen();
  });
  document.addEventListener("msfullscreenchange", function() {
    listen();
  });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  );
};

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};

/**
 * 动态插入css
 */

export const loadStyle = url => {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
};

/**
 * 处理请求返回
 * @param：{string}     self            当前操作,必填
 * @param：{string}     data            状态值,必填
 **/
function disposereq(self, data) {
  if (data.message.indexOf("401") != -1) {
    self.$message.info("token过期，请重新登录！");
    localStorage.removeItem("token");
    localStorage.removeItem("UserInfo");
    setTimeout(() => {
      self.$router.push({
        path: "/login"
      });
    }, 1000);
  }
}

const getQueryVariable = variable => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return false;
};

const formatDateBySplit = (date, str) => {
  /*
   * const t = formatDateBySplit(new Date(), "yyyy-MM-dd hh:mm:ss");
   * console.log("t", t); // 2022/10/31 18:52:25
   * */
  date = new Date(date);
  str = str ? str : "yyyy/MM/dd hh:mm:ss";
  if (/(y+)/.test(str)) {
    str = str.replace(
      RegExp.$1,
      String(date.getFullYear()).substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(str)) {
      let stry = String(o[k]);
      str = str.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? stry : ("00" + stry).substr(stry.length)
      );
    }
  }
  return str;
};

// // bus.js
// class Bus {
//   constructor() {
//     this.list = {}; // 收集订阅
//   }
//   // 订阅
//   $on(name, fn) {
//     this.list[name] = this.list[name] || [];
//     this.list[name].push(fn);
//   }
//   // 发布
//   $emit(name, data) {
//     if (this.list[name]) {
//       this.list[name].forEach(fn => {
//         fn(data);
//       });
//     }
//   }
//   // 取消订阅
//   $off(name) {
//     if (this.list[name]) {
//       delete this.list[name];
//     }
//   }
// }
// const Bus = new Bus();

export {
  timestampToTime,
  timestampToymd,
  disposereq,
  getQueryVariable,
  formatDateBySplit,
  Bus
};
