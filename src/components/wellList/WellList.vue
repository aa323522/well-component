<template>
  <div class="wellList w-full h-full bgc">
    <div class="search-box flex align-center">
      <el-form ref="form" :model="formData" :inline="true" >
        <el-form-item label="区块">
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
        <el-form-item label="井号">
          <div class="flex">
            <el-input v-model="formData.searchValue" placeholder="请输入" class="search-input"></el-input>
            <el-button class="find-btn" @click="onSearch">查询</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="list-contain">
      <div class="list-box">
        <div
          v-for="(item,index) in chunkData"
          :key="index"
          :class="isActive==index ? 'active': ''"
          class="list-content"
          @click="showEcharts(item,index)"
        >
          <div class="list-item flex pointer">
            <div class="list-item-left flex align-center justify-center">
              <div class="img-box flex align-center justify-center">
                <img src="../../assets/list-pic.png" alt="">
              </div>
            </div>
            <div class="list-item-right">
              <div class="name">
                <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="item.well_name"  placement="top"> 
                  <div class="title oneline">{{item.well_name}} </div>
                </el-tooltip>
                <span class="name-bgc"></span>
              </div>
              <div class="title-box oneline">
                <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="String(item.lat)"  placement="top"> 
                  <div class="title oneline">经度：{{item.lon}} </div>
                </el-tooltip>
              </div>
              <div class="title-box ">
                <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="String(item.lon)"  placement="top"> 
                  <div class="title oneline">纬度：{{item.lat}}</div>
                </el-tooltip>
              </div>
              <div class="title-box oneline">
                <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="item.conditions"  placement="top"> 
                  <div class="title oneline">工况：{{item.conditions}} </div>
                </el-tooltip>
              </div>
              <div class="title-box oneline">
                <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="item.well_type"  placement="top"> 
                  <div class="title oneline">井型：{{item.well_type}} </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WellList",
  props: {
    chunkData: {
      default: [],
      type: Array,
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
    formData:{
      default:
        {
          area:'',//区块选择
          searchValue:'',//搜索值
        }
      ,
      type: Object,
      required: true
    },
    isActive:{
      default:0,
      type: Number
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
    onSearch(){
      this.$emit('onSearch', this.formData);
    },
    showEcharts(val,index){
      this.$emit('show', val,index);
    }
  }
};
</script>

<style lang="less">
@import "../../style/WellList.less";
</style>
