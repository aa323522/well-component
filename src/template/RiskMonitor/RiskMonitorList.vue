<template>
  <div class="data-page pt-20 px-4 pb-4">
    <div class="data-left">
      <div class="data-top">
        <div class="section-content">
          <RightTitle :title="'项目总览'">
            <div class="bar-top">
              <div style="color: #ffffff">井号：</div>
              <el-input
                style="width: 180px"
                placeholder="请输入"
                v-model="tableForm.number"
              >
                <el-button
                  slot="append"
                  style="
                    width: 50px;
                    height: 30px;
                    line-height: 30px;
                    padding: 0;
                    border-radius: 5px;
                    background-color: #e1efff;
                    color: #2553d1;
                  "
                  @click="getTableList"
                  type="primary"
                  >搜索</el-button
                >
              </el-input>
            </div>
          </RightTitle>
          <content-frame>
            <el-table
              :data="tableData"
              style="width: 100%;"
              height="410"
              :header-cell-style="tableHeaderStyle"
              :stripe="false"
              @row-click="handleRowClick"
              :row-style="{
                cursor: 'pointer',
                color: '#ffffff',
                background: '#093A6F',
                borderBottom: '1px solid rgba(51,51,51,0.3)'
              }"
            >
              <el-table-column
                prop="name"
                label="序号"
                sortable
                :align="'center'"
                width="80"
                type="index"
              ></el-table-column>
              <el-table-column sortable label="井号" :align="'center'">
                <template slot-scope="scope">
                  {{ scope.row.number }}
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="status"
                label="消息状态"
                :align="'center'"
                :render-header="renderHeader"
              >
                <template slot-scope="scope">
                  <img :src="showPic(scope.row.status)" class="img-bcg" />
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="risk"
                label="风险情况"
                :align="'center'"
                :render-header="renderHeader"
              >
                <template slot-scope="scope">
                  <span
                    :style="
                      `color: ${
                        scope.row.risk == 'flow'
                          ? '#A48DFF'
                          : scope.row.risk == 'leak'
                          ? '#FD866B'
                          : '#FFBB0E'
                      }`
                    "
                  >
                    {{ rislObj[scope.row.risk] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="permissions"
                label="警报情况"
                :align="'center'"
                :render-header="renderHeader"
              >
                <template slot-scope="scope">
                  <el-popover
                    v-if="scope.row.risk_log && scope.row.risk_log.length"
                    trigger="hover"
                    placement="top"
                    popper-class="warningAlert"
                  >
                    <template v-for="(item, index) in scope.row.risk_log">
                      <p :key="item.warn_time + index + 'permissions'">
                        {{ rislObj[item.risk] }}{{ index + 1 }}：{{
                          item.warn_time
                        }}~ {{ item.stop_time }}
                      </p>
                    </template>

                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium"
                        >{{ scope.row.warn_number + "次" }}
                      </el-tag>
                    </div>
                  </el-popover>
                  <el-tag size="medium" v-else
                    >{{ scope.row.warn_number + "次" }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="warn_time"
                label="警报时间"
                :align="'center'"
                width="180"
                :render-header="renderHeader"
              >
                <template slot-scope="scope">
                  <el-popover
                    v-if="scope.row.risk_log && scope.row.risk_log.length"
                    trigger="hover"
                    placement="top"
                  >
                    <template v-for="(item, index) in scope.row.risk_log">
                      <p :key="item.warn_time + index + 'warn_time'">
                        {{ rislObj[item.risk] }}{{ index + 1 }}：{{
                          item.warn_time
                        }}~ {{ item.stop_time }}
                      </p>
                    </template>

                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.warn_time }} </el-tag>
                    </div>
                  </el-popover>
                  <el-tag v-else-if="scope.row.warn_time" size="medium"
                    >{{ scope.row.warn_time }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="solve"
                label="是否处理"
                :align="'center'"
                :render-header="renderHeader"
              >
                <template slot-scope="scope">
                  {{ scope.row.solve }}
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="depth"
                label="井深"
                :align="'center'"
                :render-header="renderHeader"
              ></el-table-column>
              <el-table-column
                sortable
                prop="location"
                label="钻头位置"
                :align="'center'"
                :render-header="renderHeader"
              ></el-table-column>
              <!--              :formatter="workFormatter"-->
              <el-table-column
                prop="work"
                label="工况"
                :align="'center'"
              ></el-table-column>
              <el-table-column label="收藏" :align="'center'">
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.skr === 'n'"
                    icon="el-icon-star-off"
                    circle
                    @click.stop="modify(scope.row.id, 'star')"
                  ></el-button>
                  <el-button
                    class="hasSkr"
                    v-else
                    icon="el-icon-star-on"
                    circle
                    @click.stop="modify(scope.row.id, 'unStar')"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <br />
            <el-row type="flex" justify="center">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total"
              ></el-pagination>
            </el-row>
          </content-frame>
        </div>
      </div>
      <div class="data-bottom">
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div class="section-content h-full">
          <div class="h-full flex flex-column">
            <RightTitle :title="'宝石风险统计'">
              <div class="search-bar">
                <div class="bar-type">
                  <span
                    :class="`${this.weekOrMonth ? 'active' : ''}`"
                    @click="handleGetWeekBarData"
                    >周</span
                  >
                  <span
                    :class="`${!this.weekOrMonth ? 'active' : ''}`"
                    @click="handleGetMonthBarData"
                    >月</span
                  >
                </div>
                <el-date-picker
                  v-show="this.weekOrMonth"
                  v-model="date_value"
                  type="week"
                  :picker-options="pickerOptions"
                  style="width: 250px"
                  @change="getBarDataByDate"
                  :format="`${startDate} 至 ${endDate}`"
                  :placeholder="
                    `${startDate || '开始日期'} 至 ${endDate || '结束日期'}`
                  "
                >
                </el-date-picker>
                <el-date-picker
                  v-show="!this.weekOrMonth"
                  v-model="month_value"
                  type="monthrange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  @change="getBarDataByDate"
                  :picker-options="pickerOptions2"
                >
                </el-date-picker>
              </div>
            </RightTitle>
            <div class="flex-1" style="min-height: 200px; height: 0">
              <div ref="bar-002" style="height: 200px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-right">
      <div class="right-top">
        <RightTitle :title="'实时预警数量'" />
        <div style="width: 100%; height: 100%">
          <div class="circle-style">
            <el-tooltip
              placement="right"
              effect="light"
              :disabled="!(real_time.flow.list && real_time.flow.list.length)"
            >
              <div slot="content">
                <div>溢流预警：</div>
                <div v-for="item in real_time.flow.list" :key="item.number">
                  {{ item.number }}
                </div>
              </div>
              <div class="single-yuan">
                <div
                  class="outside_circle"
                  style="border-color: rgba(164, 141, 255, 0.6)"
                >
                  <div
                    class="inside_circle"
                    style="
                      border-color: rgba(164, 141, 255, 0.3);
                      border-width: 3px;
                    "
                  ></div>
                </div>

                <el-progress
                  style="position: absolute; top: 10px"
                  type="circle"
                  :percentage="real_time.flow.total"
                  :width="140"
                  :stroke-width="10"
                  stroke-linecap="round"
                  :format="format"
                  define-back-color="rgba(255, 255, 255, 1)"
                  color="rgba(164, 141, 255, 1)"
                  text-color="rgba(164, 141, 255, 1)"
                >
                </el-progress>
                <div class="title-cicle">溢流</div>
              </div>
            </el-tooltip>
            <el-tooltip
              placement="right"
              effect="light"
              :disabled="!(real_time.leak.list && real_time.leak.list.length)"
            >
              <div slot="content">
                <div>井漏预警：</div>
                <div v-for="item in real_time.leak.list" :key="item.number">
                  {{ item.number }}
                </div>
              </div>
              <div class="single-yuan">
                <div
                  class="outside_circle"
                  style="border-color: rgba(253, 134, 107, 0.6)"
                >
                  <div
                    class="inside_circle"
                    style="
                      border-color: rgba(253, 134, 107, 0.3);
                      border-width: 3px;
                    "
                  ></div>
                </div>
                <el-progress
                  style="position: absolute; top: 10px"
                  type="circle"
                  :percentage="real_time.leak.total"
                  :width="140"
                  :stroke-width="10"
                  stroke-linecap="round"
                  :format="format"
                  define-back-color="rgba(255, 255, 255, 1)"
                  color="rgba(253, 134, 107, 1)"
                  text-color="rgba(253, 134, 107, 1)"
                >
                </el-progress>
                <div class="title-cicle">井漏</div>
              </div>
            </el-tooltip>
          </div>
          <div class="circle-style">
            <el-tooltip
              placement="right"
              effect="light"
              :disabled="!(real_time.stick.list && real_time.stick.list.length)"
            >
              <div slot="content">
                <div>卡钻预警：</div>
                <div v-for="item in real_time.stick.list" :key="item.number">
                  {{ item.number }}
                </div>
              </div>
              <div class="single-yuan">
                <div
                  class="outside_circle"
                  style="border-color: rgba(85, 173, 255, 0.6)"
                >
                  <div
                    class="inside_circle"
                    style="
                      border-color: rgba(85, 173, 255, 0.3);
                      border-width: 3px;
                    "
                  ></div>
                </div>
                <el-progress
                  style="position: absolute; top: 10px"
                  type="circle"
                  :percentage="real_time.stick.total"
                  :width="140"
                  :stroke-width="10"
                  stroke-linecap="round"
                  :format="format"
                  define-back-color="rgba(255, 255, 255, 1)"
                  color="rgba(85, 173, 255, 1)"
                  text-color="rgba(85, 173, 255, 1)"
                >
                </el-progress>
                <div class="title-cicle">卡钻</div>
              </div>
            </el-tooltip>
            <el-tooltip
              placement="right"
              effect="light"
              :disabled="!(real_time.hzs.list && real_time.hzs.list.length)"
            >
              <div slot="content">
                <div>硫化氢预警：</div>
                <div v-for="item in real_time.hzs.list" :key="item.number">
                  {{ item.number }}
                </div>
              </div>
              <div class="single-yuan">
                <div
                  class="outside_circle"
                  style="border-color: rgba(255, 187, 14, 0.6)"
                >
                  <div
                    class="inside_circle"
                    style="
                      border-color: rgba(255, 187, 14, 0.3);
                      border-width: 3px;
                    "
                  ></div>
                </div>
                <el-progress
                  style="position: absolute; top: 10px"
                  type="circle"
                  :percentage="real_time.hzs.total"
                  :width="140"
                  :stroke-width="10"
                  stroke-linecap="round"
                  :format="format"
                  define-back-color="rgba(255, 255, 255, 1)"
                  color="rgba(255, 187, 14, 1)"
                  text-color="rgba(255, 187, 14, 1)"
                >
                </el-progress>
                <div class="title-cicle">硫化氢</div>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>

      <div class="right-bottom">
        <!-- 这是饼状图 -->
        <RightTitle title="本年事故发生占比" />
        <div ref="bing-chart" class="bing-chart" style="height: 240px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { PAGINATION_SIZE_ENUM, PERMISSIONS_ENUM } from "@/utils/TEXT";
// import {
//   getOverViewTableList,
//   getStatsWeek,
//   getStatsMonth,
//   getRealTimeData,
//   getYearDataRate,
//   setDataStart,
//   getDateRange
// } from "@/api/riskMonitorApi";
// import * as echarts from 'echarts/lib/echarts.js';
import * as echarts from "echarts/lib/echarts";
//import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/line";
import "echarts/lib/chart/lines";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/grid";
import RightTitle from "@/components/RightTitle/RightTitle.vue";
import { chartBarOption } from "@/utils/echartsOption";
import dayjs from "dayjs";
export default {
  data() {
    return {
      date_value: null,
      month_value: null,
      startDate: "",
      endDate: "",
      options: [
        //全部（默认）溢流 井漏 卡钻 硫化氢
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "溢流"
        },
        {
          value: "2",
          label: "井漏"
        },
        {
          value: "3",
          label: "卡钻"
        },
        {
          value: "4",
          label: "硫化氢"
        }
      ],
      valueLeft: "",
      data: {},
      height: 300,
      myChart: null,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      showDialog: false,
      actionType: "add",
      selectedRole: "",
      filterForm: {
        name: ""
      },
      constants: Object.freeze({
        PAGINATION_SIZE_ENUM
      }),
      tableData: [
        {
          index: 1,
          number: "DF10-1-1", // 井号
          status: "red",
          risk: "flow",
          warn_number: 3,
          warn_time: "2023-04-09 22:35:35",
          solve: "n",
          depth: 7000,
          location: 6021,
          work: "drilling",
          skr: "y"
        }
      ],
      permissions: [],
      columns: Object.freeze([
        {
          prop: "creator",
          label: "测井数据",
          width: 100
        },
        {
          prop: "creator",
          label: "钻头数据",
          width: 100
        }
      ]),
      tableHeaderStyle: {
        backgroundColor: "#093A6F",
        fontSize: "16px",
        color: "#ffffff"
      },
      rislObj: {
        flow: "溢流",
        leak: "井漏",
        stick: "卡钻",
        hzs: "硫化氢"
      },
      tableForm: {
        number: ""
      },
      weekOrMonth: true,
      real_time: {
        flow: 20,
        leak: 20,
        stick: 20,
        hzs: 20
      },
      timeOptionRange: "",
      pickerOptions: {
        // onPick: (time) => {
        //   // 选择开始时间未选择结束时间
        //   if (time.minDate && !time.maxDate) {
        //     this.timeOptionRange = time.minDate;
        //   }
        //   if (time.maxDate) {
        //     this.timeOptionRange = null;
        //   }
        // },
        firstDayOfWeek: 1,
        disabledDate: this.disabledDateOne
      },
      pickerOptions2: {
        onPick: ({ maxDate, minDate }) => {
          this.pickDate = minDate.getTime();
          if (maxDate) {
            this.pickDate = "";
          }
        },
        disabledDate: this.disabledDateTwo
      },
      date_range: {
        min: "",
        max: ""
      }
    };
  },
  computed: {
    cls() {
      return {
        height: `${this.height}px`
      };
    }
  },
  watch: {
    data: {
      handler: function(v) {
        this.myChart && this.paintChart(v);
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.myChart2 = echarts.init(this.$refs["bar-002"]);
    this.myChartBing = echarts.init(this.$refs["bing-chart"]);
    this.setDateRange();
    this.getTableList();

    this.getRealTimeChartData();
    this.getFullYearRateData();
  },
  methods: {
    disabledDateOne(time) {
      if (this.date_range.min && this.date_range.max) {
        return (
          time.getTime() <
            dayjs(this.date_range.min)
              .startOf("week")
              .add(1, "day")
              .valueOf() ||
          time.getTime() >
            dayjs(this.date_range.max)
              .endOf("week")
              .add(1, "day")
              .valueOf()
        );
      } else {
        return false;
      }
    },
    disabledDateTwo(time) {
      let choiceDateTime = new Date(this.pickDate).getTime();
      const minTime = new Date(choiceDateTime).setMonth(
        new Date(choiceDateTime).getMonth() - 6
      );
      const maxTime = new Date(choiceDateTime).setMonth(
        new Date(choiceDateTime).getMonth() + 6
      );
      const min = minTime;
      const max = maxTime;
      if (this.pickDate) {
        return (
          time.getTime() < min ||
          time.getTime() > max ||
          time.getTime() <
            dayjs(this.date_range.min)
              .startOf("month")
              .valueOf() ||
          time.getTime() >
            dayjs(this.date_range.max)
              .endOf("month")
              .valueOf()
        );
      } else {
        return (
          time.getTime() <
            dayjs(this.date_range.min)
              .startOf("month")
              .valueOf() ||
          time.getTime() >
            dayjs(this.date_range.max)
              .endOf("month")
              .valueOf()
        );
      }
    },
    getTableList() {
      let param = {
        number: this.tableForm.number,
        limit: this.pageSize,
        page: "1"
      };
      getOverViewTableList(param).then(res => {
        if (res.code === 0) {
          this.tableData = res.obj.list;
          this.total = res.obj.total;
          this.pageSize = res.obj.limit;
          this.currentPage = res.obj.page;
        }
      });
    },
    getBarDataByDate() {
      if (this.weekOrMonth) {
        this.startDate = dayjs(this.date_value)
          .subtract(1, "day")
          .format("YYYY-MM-DD");
        this.endDate = dayjs(this.date_value)
          .add(5, "day")
          .format("YYYY-MM-DD");
        getStatsWeek({
          start_date: this.startDate || this.getDate().startTime,
          end_date: this.endDate || this.getDate().endTime
        }).then(res => {
          if (res.code === 0) {
            this.paintChart2(res.obj.list.slice(1));
          }
        });
      } else {
        getStatsMonth({
          start_date: dayjs(this.month_value[0]).format("YYYY-MM-DD"),
          end_date: dayjs(this.month_value[1])
            .endOf("month")
            .format("YYYY-MM-DD")
          // start_date: '2023-07-01',
          // end_date: '2023-07-31',
        }).then(res => {
          if (res.code === 0) {
            let data = res.obj.list;
            this.paintChart2(data.slice(1));
          }
        });
      }
    },
    getChartBarData() {
      let data = [];
      if (this.weekOrMonth) {
        if (!(this.end_date && this.endDate)) {
          this.startDate = dayjs(this.date_range.max)
            .endOf("isoWeek")
            .subtract(6, "day")
            .format("YYYY-MM-DD");
          this.endDate = dayjs(this.date_range.max)
            .endOf("isoWeek")
            .format("YYYY-MM-DD");
        }
        getStatsWeek({
          start_date: this.startDate,
          end_date: this.endDate
        }).then(res => {
          if (res.code === 0) {
            data = res.obj.list;
            this.paintChart2(data.slice(1));
          }
        });
      } else {
        let start_date;
        let end_date;
        if (this.month_value && this.month_value.length) {
          start_date = dayjs(this.month_value[0])
            .startOf("month")
            .format("YYYY-MM-DD");
          end_date = dayjs(this.month_value[1])
            .endOf("month")
            .format("YYYY-MM-DD");
        } else {
          start_date = dayjs(this.date_range.max)
            .startOf("month")
            .format("YYYY-MM-DD");
          end_date = dayjs(this.date_range.max)
            .endOf("month")
            .format("YYYY-MM-DD");
          this.month_value = [start_date, end_date];
        }
        getStatsMonth({
          end_date: end_date,
          start_date: start_date
        }).then(res => {
          if (res.code === 0) {
            data = res.obj.list;
            this.paintChart2(data.slice(1));
          }
        });
      }
    },
    paintChart2(data) {
      if (data.length < 1) {
        this.myChart2.setOption(chartBarOption);
      } else {
        const barOptions = { ...chartBarOption };
        let xAxisData = [];
        let yAxisData = [[], [], [], []];
        data.length &&
          data.forEach(element => {
            element.forEach((item, index) => {
              if (!index) {
                xAxisData.push(item);
              }
              yAxisData[index - 1] && yAxisData[index - 1].push(item);
            });
          });
        barOptions.xAxis.data = xAxisData;
        barOptions.series = barOptions.series.map((item, i) => {
          if (yAxisData[i].length) {
            return {
              ...item,
              data: yAxisData[i] || 0
            };
          } else {
            return item;
          }
        });
        this.myChart2.setOption(barOptions);
      }
    },
    handleGetMonthBarData() {
      this.weekOrMonth = false;
      this.date_value = [];
      this.getChartBarData();
    },
    handleGetWeekBarData() {
      this.weekOrMonth = true;
      this.date_value = [];
      this.getChartBarData();
    },
    workFormatter(value) {
      const workObj = {
        drilling: "钻井",
        pull_out: "起钻",
        back_reaming: "倒划眼"
      };
      return workObj[value.work];
    },
    // 报警状态图片
    showPic(status) {
      switch (status) {
        case "red":
          return require("@/assets/redfire2.png");
        //  break;
        case "white":
          return require("@/assets/whitefire2.png");
        case "yellow":
          return require("@/assets/yellowfire2.png");
        default:
          return require("@/assets/whitefire2.png");
      }
    },
    // 实时预警数量
    getRealTimeChartData() {
      getRealTimeData().then(res => {
        if (res.code === 0) {
          this.real_time = res.obj;
        }
      });
    },
    // 本年度事故占比 echarts
    paintChart3(conf) {
      var datas = [
        [
          { name: "溢流", value: 3.5 },
          { name: "井漏", value: 2.8 },
          { name: "硫化氢", value: 1.4 },
          { name: "卡钻", value: 1.7 }
        ]
      ];
      if (conf) {
        datas = [...conf];
      }
      const colorList = ["#3aa1ff", "#36cbcb", "#4ecb73", "#fbd437"];
      const option = {
        color: ["#3aa1ff", "#36cbcb", "#4ecb73", "#fbd437"],
        grid: {
          left: 0,
          right: "10%"
        },
        legend: {
          show: true,
          top: "center",
          left: "80%",
          data: ["溢流", "井漏", "硫化氢", "卡钻"],
          itemWidth: 20,
          itemHeight: 20,
          padding: [0, 5],
          itemGap: 25,
          textStyle: {
            color: "#ffffff"
          },
          formatter: function(name) {
            return (
              name +
              "    " +
              datas.find(item => {
                return item.name == name;
              }).value
            );
          }
        },
        series: [
          // 主要展示层的
          {
            radius: ["10%", "90%"],
            center: ["50%", "50%"],
            type: "pie",
            itemStyle: {
              color: function(params) {
                return colorList[params.dataIndex];
              },
              borderColor: "#fff",
              borderWidth: 5,
              borderType: "solid"
            },
            labelLine: {
              show: true,
              length: 35,
              length2: 100,
              lineStyle: {
                color: "#ffffff"
              }
              // align: 'right',
              // color: "#000",
            },
            emphasis: {
              show: true
            },
            label: {
              position: "inner",
              formatter: function(params) {
                var str = "";
                switch (params.name) {
                  case "井漏":
                    str = "井漏" + "\n" + params.value + "次";
                    break;
                  case "硫化氢":
                    str = "硫化氢" + "\n" + params.value + "次";
                    break;
                  case "卡钻":
                    str = "卡钻" + "\n" + params.value + "次";
                    break;
                  case "溢流":
                    str = "溢流" + "\n" + params.value + "次";
                    break;
                }
                return str;
              },
              padding: [0, -90],
              height: 35,
              rich: {
                a: {
                  width: 38,
                  height: 38,
                  lineHeight: 50,
                  align: "left"
                },
                b: {
                  width: 29,
                  height: 45,
                  lineHeight: 50,
                  align: "left"
                },
                c: {
                  width: 34,
                  height: 33,
                  lineHeight: 50,
                  align: "left"
                },
                d: {
                  width: 34,
                  height: 44,
                  lineHeight: 50,
                  align: "left"
                },
                e: {
                  width: 38,
                  height: 30,
                  lineHeight: 50,
                  align: "left"
                },
                nameStyle: {
                  fontSize: 16,
                  color: "#555",
                  align: "left"
                },
                rate: {
                  fontSize: 20,
                  color: "#1ab4b8",
                  align: "left"
                }
              }
            },
            data: datas
          },
          // 边框的设置
          {
            radius: ["95%", "80%"],
            center: ["50%", "50%"],
            type: "pie",
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            animation: false,
            tooltip: {
              show: false
            },
            itemStyle: {
              color: "rgba(250,250,250,0.5)",
              borderWidth: 2
            },
            data: [
              {
                value: 1
              }
            ]
          }
        ],
        backgroundColor: "#093A6F"
      };
      this.myChartBing.setOption(option);
    },
    // 获取本年度事故占比数据
    getFullYearRateData() {
      getYearDataRate().then(res => {
        if (res.code === 0) {
          this.paintChart3(res.obj.list);
        }
      });
    },
    format(percentage) {
      // let tex = "溢流";
      // tex = "";
      //let tex = '2012MB';
      return "" + percentage;
    },
    paintChart(conf) {
      this.myChart.setOption({
        title: {
          text: conf.title || null,
          top: 20,
          left: 20,
          textStyle: {
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 400
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        legend: {
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: (conf.category || []).map(c => c.name)
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter:
            (conf.tooltipFormatter && conf.tooltipFormatter(conf.list)) || null
        },
        yAxis: {
          type: "category",
          data: (conf.list || []).map(v => v.category)
        },
        xAxis: {
          type: "value",
          show: false
        },
        series: (conf.category || []).map(v => {
          return {
            name: v.name,
            type: "bar",
            stack: "总量",
            itemStyle: {
              color: v.color || null
            },
            label: {
              normal: {
                show: true,
                formatter: v.labelFormatter || null
              }
            },
            barMinHeight: 10,
            data: (conf.list || []).map(l => l[v.key] || null)
          };
        }),
        backgroundColor: "#093A6F"
      });
    },
    handleCurrentChange(val) {
      let param = {
        number: this.tableForm.number,
        limit: this.pageSize,
        page: val
      };
      getOverViewTableList(param).then(res => {
        if (res.code === 0) {
          this.tableData = res.obj.list;
          this.total = res.obj.total;
          this.pageSize = res.obj.limit;
          this.currentPage = res.obj.page;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let param = {
        number: this.tableForm.number,
        limit: val,
        page: "1"
      };
      getOverViewTableList(param).then(res => {
        if (res.code === 0) {
          this.tableData = res.obj.list;
          this.total = res.obj.total;
          this.pageSize = res.obj.limit;
          this.currentPage = res.obj.page;
        }
      });
    },
    modify(id, way) {
      setDataStart({
        id: id,
        way: way
      }).then(res => {
        if (res.code === 0) {
          if (way === "star") {
            this.$message({
              message: "收藏成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "取消收藏成功",
              type: "success"
            });
          }
          this.getTableList();
        }
      });
    },
    handleRowClick(row) {
      this.$router.push("/sysOverview/result?name=" + row.number);
    },
    getDate() {
      const date = new Date();
      const week = date.getDay(); // 0-6，0 表示星期日，
      const offset = week === 0 ? -6 : 1; // 如果日期是星期日，-6，否则为 1
      const startTime = new Date(
        date.getTime() - (week - 1) * 24 * 60 * 60 * 1000
      );
      const endTime = new Date(
        date.getTime() + (7 - week) * 24 * 60 * 60 * 1000
      );
      return {
        startTime: startTime.toLocaleDateString().replaceAll("/", "-"),
        endTime: endTime.toLocaleDateString().replaceAll("/", "-")
      };
    },
    getCurrentMonthTime() {
      const date = new Date();
      // 设置为日期1号
      date.setDate(1);
      // 获取当前月份(date.getMonth()返回的是0-11)
      let month = parseInt(date.getMonth() + 1);
      // 获取当月第一天日期
      let startDay = date.getDate();
      // 获取当前月的最后一天。参数0代表上个月的最后一天
      const endOfMonth = new Date(date.getFullYear(), month, 0).getDate();
      // 设置日期为当前月的最后一天
      date.setDate(endOfMonth);
      // 获取当月最后一天日期
      let endDay = date.getDate();
      if (month < 10) month = "0" + month;
      if (startDay < 10) startDay = "0" + startDay;
      if (endDay < 10) endDay = "0" + endDay;
      const startTime = date.getFullYear() + "-" + month + "-" + startDay;
      const endTime = date.getFullYear() + "-" + month + "-" + endDay;
      return [startTime, endTime];
    },
    renderHeader(h, { column, $index }) {
      if (column.order === "ascending") {
        return (
          <div>
            <span>{column.label}</span>
            <i class="el-icon-arrow-up"></i>
          </div>
        );
      } else if (column.order === "descending") {
        return (
          <div>
            <span>{column.label}</span>
            <i class="el-icon-arrow-down"></i>
          </div>
        );
      } else {
        let imgUrl = require("../../assets/paixu.svg");
        return h("div", [
          h("span", column.label),
          h("img", {
            style: {
              width: "16px",
              verticalAlign: "middle"
            },
            attrs: {
              src: imgUrl
            }
          })
        ]);
      }
    },
    setDateRange() {
      getDateRange().then(res => {
        if (res.code === 0) {
          this.date_range.min = res.obj.min;
          this.date_range.max = res.obj.max;
          this.getChartBarData();
        }
      });
    }
  },
  components: {
    "content-frame": () =>
      import(
        /* webpackChunkName: "content_frame" */ "@/components/SectionContentFrame/SectionContentFrame.vue"
      ),
    RightTitle
  }
};
</script>

<style lang="less" scoped>
.data-left
  /deep/
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped
  td.el-table__cell {
  background: red !important;
}
.data-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  .data-left {
    display: flex;
    flex-direction: column;
    min-width: 1200px;
    width: 60%;
    grid-row-gap: 0.5rem;

    .data-top {
      border-radius: 0px 0px 0px 0px;
      opacity: 1;
      border: 1px solid rgba(255, 255, 255, 0.1);

      .bar-top {
        display: flex;
        height: 50px;
        // width: calc(100% - 250px);
        justify-content: end;
        align-items: center;
        flex: 1;
        margin-right: 20px;
      }
    }

    .data-bottom {
      flex: 1;
      min-height: 200px;
      height: 0;

      .section-content {
        padding-bottom: 0px;
        /* width: 1174px; */
        height: 100%;
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .data-text {
        margin-top: 20px;

        .btn-box {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 30px;
          padding-bottom: 30px;
        }
      }
    }
  }

  .data-right {
    flex: 1;
    display: flex;
    flex-direction: column;

    .right-top,
    .right-bottom {
      margin-left: 10px;
    }

    .right-top {
      background: #093a6f;
      min-height: 490px;
      height: 50%;
      margin-bottom: 23px;
    }

    .right-bottom {
      flex: 1;
    }
  }

  .img-bcg {
    width: 30px;
    height: 30px;
  }

  .jing-style {
    color: rgb(35, 145, 255);
    cursor: pointer;
  }

  .circle-style {
    display: flex;
    justify-content: space-around;
    padding-top: 22px;
    padding-bottom: 5px;
  }

  /deep/ .el-progress__text {
    white-space: pre; //使百分号与所添加文字换行
    font-weight: 600;
  }

  .single-yuan {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .title-time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 550;
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .echarts-box {
    display: flex;
    //justify-content: center;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 10px;
  }

  .date-box {
    margin-left: 30px;
  }

  .title-cicle {
    margin-top: 5px;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    top: 74px;
  }
}

::v-deep .el-table .sort-caret.ascending {
  border-bottom-color: #fff;
}

::v-deep .el-table .sort-caret.descending {
  border-top-color: #fff;
}

.search-bar {
  display: inline-flex;
  justify-content: end;
  align-items: center;
  /* flex: 1; */
  width: calc(100% - 154px);

  .bar-type {
    margin-right: 200px;
    height: 36px;
    width: 179px;
    line-height: 36px;

    span {
      margin-left: 0;
      height: 30px;
      width: 83px;
      // border-color: #2491ff;
      color: #b6b6b6;
      display: inline-block;
      // border: 1px solid #2491ff;
      text-align: center;
      margin-top: 3px;
      margin-left: 4px;
      line-height: 30px;
      cursor: pointer;
      border-radius: 5px;
    }

    .active {
      color: #fff;
      background-color: #3483e0;
    }
  }
}

.data-page ::v-deep .el-progress__text {
  font-size: 28px !important;
  position: absolute;
  top: 53px;
}

.hasSkr {
  ::v-deep .el-icon-star-on {
    font-size: 16px;
    color: orange;
  }
}

::v-deep .el-table th.el-table__cell.is-leaf,
.el-table td.el-table__cell {
  border-bottom: 1px solid #e8ecef;
}

::v-deep .el-table tr {
  color: #ffffff;
}

::v-deep .el-table .el-table__cell.gutter {
  width: 0;
}

::v-deep
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell {
  background: red;
}

::v-deep .el-input-group__append {
  border: 0;
  width: 20px;
  margin-right: 5px;
}

::v-deep .el-input-group--append {
  border: 1px solid #dcdfe6;
  border-radius: 8px;

  .el-input__inner {
    border: 0;
  }

  .el-input__inner:focus {
    border: 0;
  }
}

::v-deep .el-input-group--append:focus {
  border-color: #2391ff;
}

::v-deep .el-table .caret-wrapper {
  display: none;
}

.el-table th.el-table__cell.is-leaf,
::v-deep .el-table td.el-table__cell {
  border-bottom: 1px solid rgba(51, 51, 51, 0.2);
}

.outside_circle {
  height: 160px;
  width: 160px;
  border-radius: 80px;
  border: 1px solid red;

  .inside_circle {
    height: 100px;
    width: 100px;
    border-radius: 50px;
    border: 2px solid red;
    position: absolute;
    top: 27px;
    left: 27px;
  }
}

.bing-chart {
  width: 100%;
  height: 100%;
}
</style>
