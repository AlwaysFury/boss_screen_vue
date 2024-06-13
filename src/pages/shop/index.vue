<template>
  <div class="shop">
    <div class="search gutter">
      <el-form :inline="true"
        :model="formInline"
        class="demo-form-inline">
        <el-form-item label="店铺id">
          <el-input v-model="formInline.shop_id"
            placeholder="请输入店铺id"
            clearable />
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-select v-model="formInline.shop_name"
            class="w190"
            clearable>
            <el-option v-for="item in shopSelectData"
              :label="item.value"
              :value="item.key"
              :key="item.key" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select v-model="formInline.status"
            class="w190"
            placeholder=""
            clearable>
            <el-option label="激活"
              value="1" />
            <el-option label="冻结"
              value="2" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="授权时间">
          <el-date-picker v-model="timeRange"
            type="datetimerange"
            value-format="YYYY-MM-DD hh:mm:ss"
            placeholder=""
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
        ref="multipleTableRef"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"
          width="55" />
        <el-table-column prop="shopId"
          label="店铺id" />
        <el-table-column prop="name"
          label="店铺名称"
          width="220">
          <template #default="scope">
            <el-input v-model="scope.row.name"
              @focus="onFocus(scope)"
              @blur="onUpdateShopName(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
          label="授权时间" />
        <el-table-column prop="accountId"
          label="所属账号 id" />
        <!-- <el-table-column prop="status"
          label="状态" /> -->
      </el-table>
    </div>
    <div class="action">
      <div class="left">
        <!-- <el-button :disabled="!multipleSelection.length"
          @click="onHandleAction('update', 1)">激活</el-button>
        <el-button :disabled="!multipleSelection.length"
          @click="onHandleAction('update', 2)">冻结</el-button> -->
        <el-button :disabled="!multipleSelection.length"
          @click="onHandleAction('update',  0)">删除</el-button>
        <el-button @click="onHandleAction('auth')">店铺授权</el-button>
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
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAuth, getShopList, updateShopStatus, getShopSelect, updateShopName } from "@/network/api"

const formInline = ref({})
const currentPage = ref(1);
const totalPage = ref(0)
const multipleTableRef = ref()
const multipleSelection = ref([])
const timeRange = ref([])

const shopSelectData = ref([])  // 单选框获取店铺
const editData = ref({});

const socket = ref(null)

const params = ref({
  size: 10,
})

const tableData = ref([])

function onQuery() {
  currentPage.value = 1;
  if (timeRange.value.length) {
    params.value.start_time = timeRange.value[0]
    params.value.end_time = timeRange.value[1]
  } else {
    delete params.value.start_time
    delete params.value.end_time
  }
  getList();
}

function reset() {
  formInline.value = {}
  timeRange.value = [];
  onQuery()
}

function handleCurrentChange(val) {
  currentPage.value = val;
  getList()
}

async function getList() {
  const res = await getShopList({
    current: currentPage.value,
    ...formInline.value,
    ...params.value
  })
  tableData.value = res?.recordList ?? [];
  totalPage.value = res?.count ?? 0;
}

function handleSelectionChange(val) {
  multipleSelection.value = val
}

function makeUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16);
  })
}

async function onHandleAction(type, status) {
  if (type == 'auth') {
    const res = await getAuth('shop', makeUuid());
    const userId = getURLParameter(res, 'userId')
    socket.value = new WebSocket(`ws://120.25.154.29:8992/websocket/${userId}`)
    window.open(res, "_blank")
    socket.value.addEventListener('open', (event) => {
    })
    socket.value.addEventListener('message', (event) => {
      if (event.data?.flag) {
        getList();
        socket.value = null;
      }
    })
  } else {
    if (!multipleSelection.value.length) {
      ElMessage({
        message: '请选择需要操作的数据',
        type: 'warning',
      })
      return;
    }
    const ids = multipleSelection.value.map(item => item.shopId)
    const res = await updateShopStatus({ shop_id: ids })
    ElMessage({
      message: res?.message ?? "操作成功",
      type: 'success',
    })
    getList();
  }
}

async function onFocus(scope) {
  editData.value = { name: scope.row.name, index: scope.$index }
}

async function onUpdateShopName(row) {
  if (row.name === editData.value?.name) {
    return;
  }
  ElMessageBox.confirm(
    '确认修改当前店铺名?',
    '提示',
  )
    .then(async () => {
      await updateShopName({ shopId: row.shopId, name: row.name })
      ElMessage({
        message: "操作成功",
        type: 'success',
      })
      getList();
    })
    .catch(() => {
      tableData.value[editData.value['index']].name = editData.value['name']
    })
}

function getURLParameter(url, parameterName) {
  // 创建一个新的URL对象
  const urlObj = new URL(url);
  // 使用URLSearchParams接口获取查询字符串参数
  const searchParams = new URLSearchParams(urlObj.search);
  // 返回指定参数的值，如果不存在则返回null
  return searchParams.get(parameterName);
}

async function init() {
  getList();
  shopSelectData.value = await getShopSelect();
}

init()

onBeforeUnmount(() => {
  socket.value = null;
})
</script>

<style lang='scss' scoped>
.shop {
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
}
</style>