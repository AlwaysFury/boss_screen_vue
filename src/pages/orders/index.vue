<template>
  <div class="order">
    <div class="search gutter">
      <el-form :inline="true"
        :model="formInline"
        class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="formInline.order_sn"
            placeholder="请输入订单号"
            clearable />
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="formInline.tracking_number"
            placeholder="请输入物流单号"
            clearable />
        </el-form-item>
        <el-form-item label="所属店铺">
          <el-select v-model="formInline.shopId"
            class="w190"
            clearable>
            <el-option v-for="item in shopSelectData"
              :label="item.value"
              :value="item.key"
              :key="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.order_status"
            class="w190"
            clearable>
            <el-option v-for="item in statusSelectData"
              :label="item.value"
              :value="item.key"
              :key="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
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
        ref="refTable"
        stripe
        highlight-current-row
        style="width: 100%"
        @row-click="onSelectChange"
        @sort-change="onSortChange">
        <el-table-column prop="orderSn"
          label="订单id"
          width="180" />
        <el-table-column prop="trackingNumber"
          label="物流单号"
          width="180" />
        <!-- <el-table-column prop="shopId"
          label="所属店铺" /> -->
        <el-table-column prop="shopName"
          label="所属店铺" />
        <el-table-column prop="createTime"
          label="创建时间"
          sortable='custom' />
        <el-table-column prop="status"
          label="状态" />
        <el-table-column prop="totalCount"
          label="衣服数量"
          sortable='custom' />
      </el-table>
    </div>
    <div class="action">
      <div class="left">
        <!-- <el-button>等级价格填入</el-button> -->
        <!-- <el-button>下架</el-button> -->
      </div>
      <div class="right">
        <el-pagination v-model:current-page="currentPage"
          :page-sizes="[10, 30, 50, 100]"
          :background="true"
          layout="sizes, total, prev, pager, next"
          :total="totalPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
    </div>
    <el-drawer v-model="dialogVisible"
      title="订单详情"
      size="100%"
      center>
      <detail :data="detailData" />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Detail from "./detail.vue"
import { getShopSelect, getOrderStatusSelect, getOrderList, getOrderDetail } from "@/network/api"

const formInline = ref({})
const currentPage = ref(1);
const totalPage = ref(3)
const dialogVisible = ref(false)
const timeRange = ref([])
const params = ref({
  size: 10,
  orderBy_name: "",
})
const detailData = ref({})

const tableData = ref([])
const shopSelectData = ref([])
const statusSelectData = ref([])
const refTable = ref(null)

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

function handleSizeChange(val) {
  params.value.size = val;
  currentPage.value = 1;
  getList()
}

async function getList() {
  const res = await getOrderList({
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

async function onSelectChange(data) {
  const res = await getOrderDetail({ order_sn: data.orderSn })
  detailData.value = res ?? {};
  dialogVisible.value = true;
}

async function onSortChange(data) {
  const key = data.prop == 'totalCount' ? 'totalCount ' : 's.create_time ';
  const rule = data.order == "ascending" ? "asc" : data.order == "descending" ? "desc" : "";
  params.value.orderBy_name = rule ? key + rule : "";
  onQuery()
}

async function init() {
  getList();
  shopSelectData.value = await getShopSelect();
  statusSelectData.value = await getOrderStatusSelect();
}
init()
</script>

<style lang='scss' scoped>
.order {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .table {
    flex: 1;
    overflow: auto;
    :deep(.el-table) {
      height: 100%;
    }
  }
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