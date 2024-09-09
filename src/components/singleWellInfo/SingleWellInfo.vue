<template>
  <div class="singleWellInfo flex flex-column h-full">
    <div class="bgc h-full">
      <el-form ref="form" :model="formData" :inline="true" >
        <div class="flex p-8">
          <div>
            <el-form-item label="区块:">
              <el-select
                v-model="formData.area"
                :popper-append-to-body="false"
                placeholder="请选择"
                class="search-select"
                popper-class="well-select"
                width="198"
                @change="onChange"
                >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="井号:">
              <el-select
                v-model="formData.searchValue"
                :popper-append-to-body="false"
                placeholder="请选择"
                class="search-select"
                popper-class="well-select"
                width="198"
                @change="onChange1"
                >
                <el-option
                  v-for="item in options1"
                  :key="item.id"
                  :label="item.well_name"
                  :value="item.well_name">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-button class="find-btn" @click="onSearch">查询</el-button>
       </div>
      </el-form>
      <div class="info flex mx-8 mt-2">
        <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="String(chunkData.lat)"  placement="top">
          <div class="mr-8 oneline">经度：{{chunkData.lon}}</div>
        </el-tooltip>
        <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="String(chunkData.lon)"  placement="top">
          <div class="oneline">纬度：{{chunkData.lat}}</div>
        </el-tooltip>
      </div>
      <div class="info flex mx-8 mt-2">
        <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="chunkData.conditions"  placement="top">
          <div class="mr-8 oneline">工况：{{chunkData.conditions}}</div>
        </el-tooltip>
      </div>
      <div class="info flex mx-8 mt-2">
        <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="chunkData.well_type"  placement="top">
          <div class="mr-8 oneline">井型：{{chunkData.well_type}}</div>
        </el-tooltip>
      </div>
    </div>
    <div class="bgc h-full mt-2">
      <div class="info-tab mx-8 mt-2">
        <span>井身结构</span>
        <span>钻具组合</span>
      </div>
      <img src="../../assets/info.png" alt="">
    </div>
  </div>
</template>


<script>
export default {
name: "SingleWellInfo",
 props: {
  chunkData: {
    default: {},
    type: Object,
    required: true
  },
  options: {
    default: [
      {
        id:'',
        name:''
      }
    ],
    type: Array,
    required: true
  },
  options1: {
    default: [
      {
        id:'',
        name:''
      }
    ],
    type: Array,
    required: true
  },
  formData:{
    default:
      {
        area:'',//区块选择
        searchValue:'',//井名
      }
    ,
    type: Object,
    required: true
  }
  },
  data() {
    return {

    };
  },
  methods: {
    onChange(){
      this.$emit('onChange');
    },
    onChange1(){
      this.$emit('onChange1');
    },
    onSearch(){
      this.$emit('onSearch', this.formData);
    },
  }
};
</script>

<style lang="less">
@import "../../style/SingleWellInfo.less";
</style>
