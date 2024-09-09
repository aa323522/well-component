/**
 * Typescript常量声明
 * const声明一个只读的常量，大写，具体使用含义单词拼接
 * 后续可以考虑拆分为多个文件及模块 HTTP/NAV/ENUM/LABEL/ERROR
 * */

// *枚举,常量文字都放这里
// export const HTTP_STATUS_MSG_404 = "页面走丢了";
export const HTTP_STATUS_MSG_401 = "token过期，请重新登录";
export const HTTP_STATUS_MSG_5XX = "网络错误，请稍后重试";
export const HTTP_STATUS_TITLE_ERROR = "请求错误";
export const HTTP_STATUS_TITLE_5XX = "服务器错误";

// 导航

export const ACCESS_SETTING = "权限管理";
export const USER_MANAGE = "用户管理";
export const ROLE_MANAGE = "角色管理";

export const WORKCODE_LENGTH = 6;
export const PAGINATION_SIZE_ENUM = [20, 50, 100, 200];
export const ENUM_LEVELS = [
  "1",
  "1.1",
  "1.2",
  "1.3",
  "2.1",
  "2.2",
  "2.3",
  "3.1",
  "3.2",
  "3.3",
  "4.1",
  "4.2",
  "4.3",
  "5.1",
  "5.2",
  "5.3",
  "6.1",
  "6.2",
  "6.3",
  "7",
];
export const AVAILABILITY_ENUM = {
  "0": "启用",
  "1": "禁用",
};
// 数据范围枚举, 0-所有, 1- 根据权限
export const DATA_SCOPE_ENUM = {
  ALL: 0,
  WITH_PERMISSION: 1,
};

export const LOGOUT = "退出";
export const FORM_ROLE_NAME = "角色名称";

export const BTN_CANCLE = "取 消";
export const BTN_CONFIRM = "确 定";
export const ROLE_ADD = "添加角色";
export const ROLE_MODIFY = "修改角色";

export const PERMISSIONS_ENUM = {
  ROLE_MANAGER: 1001, //角色管理
  ADMIN_MANAGER: 1002, //管理员管理
  LEVEL_PERMISSION: 2201, //职级权限
};
export const FORM_ENTERPRISE_EMAIL = "企业邮箱";
export const USER_ADD = "添加用户";
export const USER_MODIFY = "修改用户";
export const FORM_NAME = "姓名";
export const FORM_ROLE = "角色";
export const FORM_DEPARTMENT = "部门";

export const DRAG_FILE = "将文件拖到此处，或";
export const CLICK_TO_UPLOAD = "点击上传";
export const DOWNLOAD_EXCEL_TEMPLATE = "EXCEL表格模板下载";
export const LEVEL = "职级";
export const EMPLYEE_TYPE = "员工类别";
export const REMARK = "备注";
export const WORKCODE = "员工编号";
export const ABSENCE_REASON = "缺席原因";
export const CREATOR = "创建人";
export const SERIAL_NUMBER = "编号";
export const ACTIVITY_TYPE = "活动类型";
export const ACTIVITY_NAME = "活动名称";
export const ACTIVITY_LOCATION = "活动地点";
export const MANAGER = "管理人";
