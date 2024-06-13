<template>
  <div class="levelList">
    <div class="search gutter">
      <el-form :inline="true"
        :model="formInline"
        class="demo-form-inline"
        label-width="80">
        <el-form-item label="规则名称">
          <el-input v-model="formInline.rule_name"
            placeholder="请输入规则名称"
            clearable />
        </el-form-item>
        <el-form-item label="等级">
          <el-input v-model="formInline.rule_grade"
            placeholder="请输入等级"
            clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="onQuery">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table gutter">
      <el-table :data="tableData"
        ref="refTable"
        stripe
        highlight-current-row
        style="width: 100%"
        @row-click="onSelectChange"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"
          width="55" />
        <el-table-column prop="name"
          label="规则名称" />
        <el-table-column prop="grade"
          label="等级" />
      </el-table>
    </div>
    <div class="action">
      <div class="left">
        <el-button type="primary"
          @click="onClickAdd">新增</el-button>
        <el-button type="danger"
          :disabled='!multipleSelection.length'
          @click="onDelete">删除</el-button>
      </div>
      <div class="right">
        <el-pagination v-model:current-page="currentPage"
          :page-size="10"
          :background="true"
          layout="total, prev, pager, next"
          :total="totalPage"
          @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog v-model="dialogVisible"
      :title="title"
      top="40px"
      width="800"
      center>
      <div class="dialogContent">
        <el-form :model="detailData"
          class="demo-form-inline"
          label-width="100">
          <div class="rule-item">
            <el-form-item label="规则名称"
              required>
              <el-input v-model="detailData.name"
                placeholder="请输入规则名称"
                clearable />
            </el-form-item>
            <el-form-item label="等级"
              required>
              <el-input v-model="detailData.grade"
                placeholder="请输入等级"
                clearable />
            </el-form-item>
          </div>
          <el-form-item label="规则条件">
            <el-radio-group v-model="detailData.allOrNot">
              <el-radio :value="true"
                size="large">全部满足</el-radio>
              <el-radio :value="false"
                size="large">任意一个</el-radio>
            </el-radio-group>
          </el-form-item>
          <div>
            <h3>具体规则</h3>
            <div class="rule-block">
              <div class="rule-item">
                <el-form-item label="产品id">
                  <el-input v-model="rules.itemId.value"
                    clearable />
                </el-form-item>
                <el-form-item label="款号">
                  <el-input v-model="rules.itemSku.value"
                    clearable />
                </el-form-item>
              </div>
              <div class="rule-item">
                <el-form-item label="分类">
                  <el-select v-model="rules.categoryId.value"
                    class="w190"
                    clearable>
                    <el-option v-for="item in categorySelectData"
                      :label="item.value"
                      :value="item.key"
                      :key="item.key" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select v-model="rules.status.value"
                    class="w190"
                    clearable>
                    <el-option v-for="item in statusSelectData"
                      :label="item.value"
                      :value="item.key"
                      :key="item.key" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="rule-item">
                <el-form-item label="创建时间">
                  <el-date-picker v-model="rules.createTime.startTime"
                    type="datetime"
                    value-format="YYYY-MM-DD hh:mm:ss"
                    placeholder="请选择开始时间"
                    style="margin-right: 30px" />
                  <el-date-picker v-model="rules.createTime.endTime"
                    type="datetime"
                    value-format="YYYY-MM-DD hh:mm:ss"
                    placeholder="请选择结束时间" />
                </el-form-item>
              </div>
              <div class="rule-item">
                <el-form-item label="价格">
                  <el-input-number v-model="rules.price.minPrice"
                    clearable
                    class="w190 gutter-right"
                    placeholder="请输入最小价格"
                    :precision="2"
                    :min="0" />
                  <el-input-number v-model="rules.price.maxPrice"
                    clearable
                    class="w190"
                    :precision="2"
                    :min="0"
                    placeholder="请输入最大价格" />
                </el-form-item>
              </div>
              <div class="rule-item">
                <el-form-item label="具体某天销量">
                  <el-date-picker v-model="rules.salesVolumeOneDays.date"
                    type="datetime"
                    value-format="YYYY-MM-DD hh:mm:ss"
                    placeholder="请选择日期时间"
                    style="margin-right: 30px" />
                  <el-input-number v-model="rules.salesVolumeOneDays.value"
                    clearable
                    class="w190"
                    :min="0"
                    placeholder="请输入当天销量"
                    style="margin-right: 30px" />
                  <el-select class="w190"
                    placeholder="请输入类型"
                    v-model="rules.salesVolumeOneDays.type">
                    <el-option v-for="item in ruleTypes"
                      :label="item.text"
                      :value="item.value"
                      :key="item.value" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="rule-item">
                <el-form-item label="7天销量">
                  <el-input-number v-model="rules.salesVolume7days.value"
                    clearable
                    class="w190"
                    :min="0"
                    placeholder="请输入销量"
                    style="margin-right: 30px" />
                  <el-select class="w190"
                    placeholder="请输入类型"
                    v-model="rules.salesVolume7days.type">
                    <el-option v-for="item in ruleTypes"
                      :label="item.text"
                      :value="item.value"
                      :key="item.value" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="rule-item">
                <el-form-item label="30天销量">
                  <el-input-number v-model="rules.salesVolume30days.value"
                    clearable
                    class="w190"
                    :min="0"
                    placeholder="请输入当天销量"
                    style="margin-right: 30px" />
                  <el-select class="w190"
                    placeholder="请输入类型"
                    v-model="rules.salesVolume30days.type">
                    <el-option v-for="item in ruleTypes"
                      :label="item.text"
                      :value="item.value"
                      :key="item.value" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="rule-item">
                <el-form-item label="总销量">
                  <el-input-number v-model="rules.salesVolume.value"
                    clearable
                    class="w190"
                    :min="0"
                    placeholder="请输入当天销量"
                    style="margin-right: 30px" />
                  <el-select class="w190"
                    placeholder="请输入类型"
                    v-model="rules.salesVolume.type">
                    <el-option v-for="item in ruleTypes"
                      :label="item.text"
                      :value="item.value"
                      :key="item.value" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-action">
          <el-button type="primary"
            @click="onConfirm">确认</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCategorySelect, getStatusSelect, getLevelList, getLevelDetail, updateLevel, deleteLevel } from "@/network/api"

const formInline = ref({})
const currentPage = ref(1);
const totalPage = ref(0)

const tableData = ref([])
const categorySelectData = ref([])
const statusSelectData = ref([])
const refTable = ref(null)
const multipleSelection = ref([])
const dialogVisible = ref(false)
const detailData = ref({
  allOrNot: true
})
const rules = ref()
const title = ref("新增等级")

const params = ref({
  size: 10,
})

const ruleTypes = [
  { text: "等于", value: "=" },
  { text: "小于", value: "<" },
  { text: "大于", value: ">" },
  { text: "小于等于", value: "<=" },
  { text: "大于等于", value: ">=" },
]

function onQuery() {
  currentPage.value = 1;
  getList();
}

function reset() {
  formInline.value = {}
  onQuery()
}

function handleSelectionChange(val) {
  multipleSelection.value = val
}

async function onDelete() {
  ElMessageBox.confirm(
    '确认删除?',
    '提示',
  )
    .then(async () => {
      const ids = multipleSelection.value.map(item => item.id)
      const res = await deleteLevel({ idList: ids })
      ElMessage({
        message: res?.message ?? "操作成功",
        type: 'success',
      })
      getList();
    })
    .catch(() => {
    })
}

async function getList() {
  const res = await getLevelList({
    current: currentPage.value,
    ...formInline.value,
    ...params.value
  })
  tableData.value = res?.recordList ?? [];
  totalPage.value = res?.count ?? 0;
  if (refTable.value) {
    refTable.value.setScrollTop(0)
  }
}

function handleCurrentChange(val) {
  currentPage.value = val;
  getList()
}

function onClickAdd() {
  title.value = "新增等级";
  initData();
  dialogVisible.value = true;
}

async function onSelectChange(data) {
  initData();
  title.value = "编辑等级"
  const res = await getLevelDetail({ rule_id: data.id })
  detailData.value = res;
  replaceRulesValues(res.rule);
  dialogVisible.value = true;
}

async function onConfirm() {
  if (!detailData.value.name) {
    ElMessage({
      message: "请输入规则名称",
      type: 'warning',
    })
    return;
  }
  if (!detailData.value.grade) {
    ElMessage({
      message: "请输入等级",
      type: 'warning',
    })
    return;
  }
  const processedRule = processBeforeUpload();
  await updateLevel({
    ...detailData.value,
    rule: {
      ...processedRule
    }
  })
  ElMessage({
    message: "操作成功",
    type: 'success',
  })
  dialogVisible.value = false;
  getList();
}

function initData() {
  rules.value = {
    itemId: { value: "" },
    itemSku: { value: "" },
    categoryId: { value: "" },
    status: { value: "" },
    createTime: {
      startTime: "",
      endTime: "",
    },
    price: {
      minPrice: undefined,
      maxPrice: undefined,
    },
    salesVolume: {
      value: undefined,
      type: "=",
    },
    salesVolume7days: {
      value: undefined,
      type: "=",
    },
    salesVolume30days: {
      value: undefined,
      type: "=",
    },
    salesVolumeOneDays: {
      value: undefined,
      type: "=",
      date: ""
    },
  }
  detailData.value = {
    allOrNot: true
  };
}

// 详情数据处理
function replaceRulesValues(ruleRequest) {
  for (const key in ruleRequest) {
    if (key == 'createTime') {
      if (ruleRequest[key].startTime && ruleRequest[key].endTime) {
        rules.value.createTime.startTime = ruleRequest[key].startTime
        rules.value.createTime.endTime = ruleRequest[key].endTime
      }
    } else if (key == 'price') {
      if (ruleRequest[key].minPrice && ruleRequest[key].maxPrice) {
        rules.value.price.minPrice = ruleRequest[key].minPrice
        rules.value.price.maxPrice = ruleRequest[key].maxPrice
      }
    } else {
      const item = ruleRequest[key]
      if (item.value) {
        rules.value[key].value = item.value;
      }
      if (item.type) {
        rules.value[key].type = item.type;
      }
      if (item.date) {
        rules.value[key].date = item.date;
      }
    }
  }
}

// 提交数据处理
function processBeforeUpload() {
  const rule = {};
  for (const key in rules.value) {
    const item = rules.value[key];
    let obj = {};
    if (key === 'createTime') {
      if (item.startTime) obj.startTime = item.startTime;
      if (item.endTime) obj.endTime = item.endTime;
    } else if (key === 'price') {
      if (item.minPrice) obj.minPrice = item.minPrice;
      if (item.maxPrice) obj.maxPrice = item.maxPrice;
    }

    if (item.value) obj.value = item.value;
    if (item.value && item.type) obj.type = item.type;
    if (item.date) obj.date = item.date;

    if (item.date && !item.value) {
      obj = {}
    }

    if (Object.keys(obj).length != 0) {
      rule[key] = obj;
    }
  }
  return rule;
}

async function init() {
  getList()
  categorySelectData.value = await getCategorySelect();
  statusSelectData.value = await getStatusSelect();
}
init()
</script>
<style scoped lang="scss">
.levelList {
  .w190 {
    width: 190px;
  }
  .gutter {
    margin-bottom: 20px;
  }
  .action {
    display: flex;
    justify-content: space-between;
  }
  .rule-item {
    display: flex;
  }
  .gutter-right {
    margin-right: 30px !important;
  }
  .dialogContent {
    height: 500px;
    overflow-y: scroll;
  }
}
</style>
