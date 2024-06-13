<template>
  <div class="detail">
    <div class="section form">
      <el-form :inline="true"
        :model="formInline"
        :readonly=true
        :label-width="100">
        <el-form-item label="订单号">
          <span class="form-item-value">{{formInline.orderSn}}</span>
        </el-form-item>
        <el-form-item label="物流单号">
          <span class="form-item-value">{{formInline.trackingNumber}}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span class="form-item-value">{{formInline.createTime}}</span>
        </el-form-item>
        <el-form-item label="所属店铺">
          <span class="form-item-value">{{formInline.shopName}}</span>
        </el-form-item>
        <el-form-item label="买家id">
          <span class="form-item-value">{{formInline.buyerUerId}}</span>
        </el-form-item>
        <el-form-item label="买家名称">
          <span class="form-item-value">{{formInline.buyerUserName}}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span class="form-item-value">{{formInline.status}}</span>
        </el-form-item>
        <el-form-item label="取消通过">
          <span class="form-item-value">{{formInline.cancelBy}}</span>
        </el-form-item>
        <el-form-item label="买家取消">
          <span class="form-item-value">{{formInline.buyerCancelReason}}</span>
        </el-form-item>
        <el-form-item label="取消原因">
          <span class="form-item-value">{{formInline.cancelReason}}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="section table">
      <el-table :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column prop="imageUrl"
          label="图片">
          <template #default="scope">
            <el-image style="width: 100px;"
              :src="scope.row.imageUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="itemName"
          label="商品名称"
          width="300" />
        <el-table-column prop="modelId"
          label="规格"
          width="320">
          <template #default="scope">
            <div>
              <div>model id：{{scope.row.modelId}}</div>
              <div>model名称：{{scope.row.modelName}}</div>
              <div>modelsku：{{scope.row.modelSku}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="count"
          label="数量" />
        <el-table-column prop="originalPrice"
          label="原始价格" />
        <el-table-column prop="sellingPrice"
          label="销售价格" />
        <el-table-column prop="sellerDiscount"
          label="卖家折扣" />
        <el-table-column prop="discountedPrice"
          label="折扣价格" />
        <el-table-column prop="activityId"
          label="活动 id" />
        <el-table-column prop="activityType"
          label="活动类型" />
        <el-table-column prop="cost"
          label="成本" />
        <el-table-column prop="profit"
          label="利润" />
        <el-table-column prop="profitRate"
          label="利润率" />
      </el-table>
    </div>
    <div class="section">
      <el-form :inline="true"
        :model="formInline"
        class="demo-form-inline"
        label-width="auto">
        <el-form-item label="买家最终支付金额">
          <span class="form-item-value">{{formInline.buyerTotalAmount}}</span>
        </el-form-item>
        <el-form-item label="买家最终支付运费">
          <span class="form-item-value">{{formInline.buyerPaidShippingFee}}</span>
        </el-form-item>
        <el-form-item label="付款时间">
          <span class="form-item-value">{{formInline.payTime}}</span>
        </el-form-item>
        <el-form-item label="平台最终金额">
          <span class="form-item-value">{{formInline.escrowAmount}}</span>
        </el-form-item>
        <el-form-item label="平台实际运费">
          <span class="form-item-value">{{formInline.actualShippingFee}}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="section">
      <el-form :inline="true"
        :model="formInline"
        class="demo-form-inline"
        label-width="100">
        <el-form-item label="调整金额">
          <span class="form-item-value">{{formInline.adjustmentAmount}}</span>
        </el-form-item>
        <el-form-item label="调整原因">
          <span class="form-item-value">{{formInline.adjustmentReason}}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="section">
      <el-table :data="clothesCountMap"
        stripe>
        <el-table-column prop="key"
          label="衣服类型" />
        <el-table-column prop="value"
          label="数量" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps(['data'])

const formInline = ref({})
const tableData = ref([])
const clothesCountMap = ref([])
watch(() => props.data, () => {
  formInline.value = props?.data ?? {};
  tableData.value = props?.data?.orderEscrowItemVOList ?? []
  clothesCountMap.value = props?.data?.clothesCountMap ?? []
}, {
  immediate: true,
  deep: true
})
</script>

<style scoped lang='scss'>
.detail {
  padding: 20px 0;
  width: 100%;
  overflow: auto;
  .summary {
    margin: 20px 0;
  }
  .section {
    &:not(:last-child) {
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    :deep(.el-form-item__label) {
      display: flex;
      align-items: center;
      line-height: normal;
    }
  }
  .form-item-value {
    padding: 0 5px;
    background-color: #f7f7f7;
  }
}
</style>