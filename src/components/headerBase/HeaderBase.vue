<template>
  <div class="headerBase flex align-center">
    <div class="nav-icon pointer flex align-center" @click="handleChangeNav(0)">
      <img src="../../assets/nav.png" alt="" /><span>智能钻井导航系统（IDNS1.0)</span>
    </div>
    <div class="nav-title-box flex align-center">
      <div
        v-for="(item, index) in navList"
        :key="index"
        :class="activeIndex == index ? 'active-nav-title' : ''"
        class="nav-title pointer"
        @click="handleChangeNav(index)"
      >
        <div class="flex align-center justify-center">
          <img
            src="../../assets/active-title-icon.png"
            alt=""
            class="active-icon"
          />
          {{ item.name }}
        </div>
      </div>
      
      <!-- <div><a-icon type="plus-circle" class="pointer" style="font-size: 30px;" @click="newFn"/></div> -->
    </div>

    <div class="absolute" style="right: 80px">
      <a-popconfirm
        ok-text="确定"
        cancel-text="取消"
        @confirm="confirm"
        placement="bottom"
      >
        <template slot="title">
          <div style="min-width: 150px;">
            <span style="color: white;">设置URL</span>
            <a-input v-model="urlValue" placeholder="http://localhost:10003"></a-input>
          </div>
        </template>

        <a-button type="primary">设置端口</a-button>
      </a-popconfirm>
    </div>
  </div>
</template>

<script>
import DownloadExcel from "vue-json-excel";
import {
  getDetectionURL,
  setDetectionURL,
} from "../../api/detectionAndImprovementApi.js";
import {
  getRiskURL,
  setRiskURL
} from "../../api/riskInfoApi.js";
import { Message } from "element-ui";

export default {
  name: "HeaderBase",
  props: {
    activeIndex: {
      type: Number,
      default: 0
    },
    isRunning: {
      default: false,
      type: Boolean
    },
    chartOriginData: {
      default: () => [],
      type: Array
    }
  },
  watch: {
    activeIndex: {
     async handler(newVal) {
        if (newVal === 0) {
          // this.urlValue = localStorage.getItem('detectionURL')
          this.$router.push({ path: "/" });
          const res = await getDetectionURL()
          if (res.data) {
            if (typeof res.data === 'string') {
              this.urlValue = res.data
            } else {
              this.urlValue = res.data.url
            }
          }
        } else if (newVal === 1) {
          // this.urlValue =localStorage.getItem('riskURL')
          this.$router.push("/riskMonitor");
          const res = await getRiskURL()
          if (res.data) {
            if (typeof res.data === 'string') {
              this.urlValue = res.data
            } else {
              this.urlValue = res.data.url
            }
          }

        }
      },
    }
  },
  components: {
    DownloadExcel
  },
  data() {
    return {
      urlValue: '',
      csvData: [],
      columns: [
        { title: "时间", key: "time" },
        { title: "砂堵风险", key: "pre_RESULT" },
        { title: "施工时间(s)", key: "serial_NUMBER" },
        { title: "砂量(m³)", key: "pumping_SAND_VOLUME" },
        { title: "排量(m³/min)", key: "total_PUMP_DISPL" },
        {
          title: "液量(m³)",
          key: "pumping_FLUID_VOLUME_TOTAL"
        },
        {
          title: "砂浓度(kg/m³)",
          key: "pumping_LIQUID_CONCENTRATION"
        },
        { title: "泵压(MPa)", key: "total_PUMP_PRESSURE" }
      ],
      searchValue: "",
      navList: [
        {
          name: "钻井监测与提速"
        },
        {
          name: "钻井风险监测"
        }
      ]
    };
  },
  methods: {
    newFn () {
      window.open('/')
    },
    async confirm() {
      if (this.activeIndex === 0) {
        // localStorage.setItem('detectionURL', this.urlValue)
        await setDetectionURL({
          url: this.urlValue
        })
      } else {
        // localStorage.setItem('riskURL', this.urlValue)
        await setRiskURL({
          url: this.urlValue
        })
      }
      Message({
        message: "设置成功",
        type: 'success',
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    handleChangeNav(index) {
      this.$emit("changeActiveIndex", index);
    },

    exportCsv(columns, dataList, fileName) {
      let title = columns.map(item => item.title);
      let keyArray = columns.map(item => item.key);
      let str = [];
      str.push(title.join(",") + "\n");
      for (let i = 0; i < dataList.length; i++) {
        const temp = [];
        for (let j = 0; j < keyArray.length; j++) {
          temp.push(dataList[i][keyArray[j]]);
        }
        str.push(temp.join(",") + "\n");
      }
      let uri =
        "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str.join(""));

      let downloadLink = document.createElement("a");
      downloadLink.href = uri;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
    handleExportCsv() {
      this.exportCsv(
        this.columns,
        this.csvData,
        `${this.dayjs().format("YYYY-MM-DD HH:mm:ss")} CSV导出.csv`
      );
    }
  }
};
</script>

<style lang="less">
@import "../../style/HeaderBase.less";

.detail {
  height: 40px;
  line-height: 40px;
  background-size: 120px 40px;
  background-position: center center;
  min-width: 120px;
  display: flex;
  justify-content: center;
}

.headerDropDown {
  .ant-dropdown-menu-item {
    font-size: 16px;
    svg {
      font-size: 16px;
    }
  }
}
</style>
