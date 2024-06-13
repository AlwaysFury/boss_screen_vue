<template>
  <div class="detail">
    <div class="form">
      <el-form :inline="true"
        :model="data"
        :readonly=true
        :label-width="100">
        <el-form-item label="产品 id">
          <span class="form-item-value">{{data.itemId}}</span>
        </el-form-item>
        <el-form-item label="产品名称">
          <span class="form-item-value">{{data.itemName}}</span>
        </el-form-item>
        <el-form-item label="所属店铺">
          <span class="form-item-value">{{data.shopName}}</span>
        </el-form-item>
        <el-form-item label="产品等级">
          <span class="form-item-value">{{data.grade}}</span>
        </el-form-item>
        <el-form-item label="分类">
          <span class="form-item-value">{{data.categoryName}}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span class="form-item-value">{{data.createTime}}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span class="form-item-value">{{data.status}}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData"
        stripe
        style="width: 100%"
        :span-method="objectSpanMethod"
        ref='refTable'>
        <el-table-column prop="imageUrl"
          label="图片">
          <template #default="scope">
            <el-image style="width: 100px;"
              :src="scope.row.imageUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="itemId"
          label="所属产品 id" />
        <el-table-column prop="modelId"
          label="model id" />
        <el-table-column prop="modelName"
          label="model 名称" />
        <el-table-column prop="modelSku"
          label="model sku" />
        <el-table-column prop="currentPrice"
          label="当前价格" />
        <el-table-column prop="originalPrice"
          label="原始价格" />
        <el-table-column prop="stock"
          label="库存" />
        <el-table-column prop="salesVolume"
          label="销量" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from "vue"

const props = defineProps(['data'])

const refTable = ref(null)

const data = ref({})
const tableData = ref([])

watch(() => props.data, () => {
  data.value = props?.data ?? {};
  tableData.value = props?.data?.modelVOList ?? []
  nextTick(() => {
    if (refTable.value) {
      refTable.value.setScrollTop(0)
    }
  })
}, {
  immediate: true,
  deep: true
})

const mergeRows = computed(() => {
  const mergingRows = []
  let mergingPos = 0
  tableData.value = tableData.value.sort((a, b) => a['name'].localeCompare(b['name']));
  for (let i = 0; i < tableData.value.length; i++) { // tabledata 表格数据源
    if (i === 0) {
      mergingRows.push(1)
      mergingPos = 0
    } else {
      if (tableData.value[i].name === tableData.value[i - 1].name) {
        // 哪些数据是要合并的 合并的条件是什么 此处合并条件为name 相同则进行合并
        mergingRows[mergingPos] += 1
        mergingRows.push(0)
      } else {
        mergingRows.push(1)
        mergingPos = i
      }
    }
  }
  return mergingRows
})

function objectSpanMethod({ row, column, rowIndex, columnIndex }) {
  if (columnIndex === 0) { // 只合并第一列
    const _row = mergeRows.value[rowIndex]
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col
    }
  }
}
</script>

<style scoped lang='scss'>
.detail {
  width: 100%;
  height: 600px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .form {
    margin-bottom: 20px;
  }
  .table {
    flex: 1;
    overflow: auto;
    :deep(.el-table) {
      height: 100%;
    }
  }
  .form-item-value {
    padding: 0 5px;
    background-color: #f7f7f7;
  }
}
</style>