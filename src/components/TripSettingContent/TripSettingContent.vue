<template>
  <div class="tripSettingContent w-full">
    <div>
      <div><span class="text-bold text-lg">大钩载荷标定</span></div>
      <div>
        <a-form :form="form" @submit="handleSubmit" layout="vertical">
          <div class="grid grid-cols-2 gap-x-4">
            <a-form-item label="标定工况">
              <a-select
                v-decorator="[
                  'calibrationCondition',
                  {
                    initialValue: 'up'
                  }
                ]"
                placeholder="Select a option and change input text above"
                @change="handleSelectChange"
              >
                <a-select-option value="up">
                  起钻
                </a-select-option>
                <a-select-option value="drill">
                  钻进
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="取值间隔">
              <a-select
                v-decorator="[
                  'valueInterval',
                  {
                    initialValue: '1'
                  }
                ]"
                placeholder="Select a option and change input text above"
                @change="handleSelectChange"
              >
                <a-select-option value="1">连续</a-select-option>
                <a-select-option value="2">
                  不连续
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="开始时间">
              <a-date-picker
                v-decorator="['startTime']"
                placeholder="请选择日期"
              />
            </a-form-item>
            <a-form-item label="结束时间">
              <a-date-picker
                v-decorator="['endTime']"
                placeholder="请选择日期"
              />
            </a-form-item>
          </div>
        </a-form>
        <div class="flex justify-around">
          <a-button type="primary">确定</a-button>
          <a-button>清除</a-button>
        </div>
      </div>
    </div>
    <a-divider />
    <div>
      <div><span class="text-bold text-lg">扭矩标定</span></div>
      <div>
        <a-form :form="form" @submit="handleSubmit" layout="vertical">
          <div class="grid grid-cols-2 gap-x-4">
            <a-form-item label="开始时间">
              <a-date-picker
                v-decorator="['startTime']"
                placeholder="请选择日期"
              />
            </a-form-item>
            <a-form-item label="结束时间">
              <a-date-picker
                v-decorator="['endTime']"
                placeholder="请选择日期"
              />
            </a-form-item>
          </div>
        </a-form>
        <div class="flex justify-around">
          <a-button type="primary">确定</a-button>
          <a-button>清除</a-button>
        </div>
      </div>
    </div>
    <a-divider />
    <div>
      <div><span class="text-bold text-lg">摩阻系数预测</span></div>
      <div>
        <a-form :form="form" @submit="handleSubmit" layout="vertical">
          <div class="grid grid-cols-2 gap-x-4">
            <div class="flex gap-x-2">
              <a-form-item label="起始长度">
                <a-input-number
                  v-decorator="['startTime', { initialValue: 2000 }]"
                />
                <span class="ml-2">m</span>
              </a-form-item>
            </div>
            <a-form-item label="预测间隔">
              <a-select
                v-decorator="[
                  'valueInterval',
                  {
                    initialValue: '1'
                  }
                ]"
                placeholder="Select a option and change input text above"
                @change="handleSelectChange"
              >
                <a-select-option value="1">每立柱</a-select-option>
                <a-select-option value="2">
                  ？？？
                </a-select-option>
              </a-select>
            </a-form-item>
            <div class="flex gap-x-2">
              <a-form-item label="预测长度">
                <a-input-number
                  v-decorator="['startTime', { initialValue: 90 }]"
                />
                <span class="ml-2">m</span>
              </a-form-item>
            </div>
            <a-form-item label="选择工况">
              <a-select
                v-decorator="[
                  'calibrationCondition',
                  {
                    initialValue: 'up'
                  }
                ]"
                placeholder="Select a option and change input text above"
                @change="handleSelectChange"
              >
                <a-select-option value="up">
                  起钻
                </a-select-option>
                <a-select-option value="drill">
                  钻进
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </a-form>
        <div class="flex justify-around">
          <a-button type="primary">确定</a-button>
          <a-button>清除</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TripSettingContent",
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    handleSelectChange(value) {
      this.form.setFieldsValue({
        note: `Hi, ${value === "male" ? "man" : "lady"}!`
      });
    }
  }
};
</script>

<style scope lang="less">
.ant-form-item {
  width: 100%;

  .ant-input-number {
    flex: 1;
  }
}
.ant-form-item-children {
  display: flex;
  width: 100%;
  .ant-calendar-picker {
    display: flex;
    width: 100%;

    div {
      width: 100%;
    }
  }
}
</style>
