// 产品表现详细信息
<template>
  <div>
    <el-table :data="data"
      stripe
      style="width: 100%">
      <el-table-column prop="createTime"
        label="时间"
        width="160" />
      <el-table-column prop="productCount"
        label="件数（已确定订单）" />
      <el-table-column prop="confirmOrderRate"
        label="转化率（已确定订单）" />
      <el-table-column prop="addCartRate"
        label="转化率 (加入购物车率)" />
      <el-table-column prop="visitorCount"
        label="访客数"
        width="100" />
      <el-table-column prop="likes"
        label="点赞数"
        width="100" />
    </el-table>
  </div>
</template>

<script setup>
const props = defineProps(['data'])
</script>

<style scoped>
</style>