<template>
	<div class="detail">
		<div class="section form">
			<h3>基本信息</h3>
			<el-form :model="baseInfo" :readonly="true">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="订单号">
							<span class="form-item-value">{{ baseInfo.orderSn }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="创建时间">
							<span class="form-item-value">{{ baseInfo.createTime }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="支付时间">
							<span class="form-item-value">{{ baseInfo.payTime }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="所属店铺">
							<span class="form-item-value">{{ baseInfo.shopName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="买家id">
							<span class="form-item-value">{{ baseInfo.buyerUerId }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="买家名称">
							<span class="form-item-value">{{ baseInfo.buyerUserName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="状态">
							<span class="form-item-value">{{ baseInfo.status }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="是否为新品订单">
							<el-tag :type="baseInfo.new ? 'success' : 'info'">{{
								baseInfo.new ? "是" : "否"
							}}</el-tag>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="取消方">
							<span class="form-item-value">{{ baseInfo.cancelBy }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="买家取消原因">
							<span class="form-item-value">{{
								baseInfo.buyerCancelReason
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="取消原因">
							<span class="form-item-value">{{ baseInfo.cancelReason }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-divider />
			<h3>支付信息</h3>
			<el-form :model="baseInfo" :readonly="true">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="买家最终付款金额">
							<span class="form-item-value">{{
								baseInfo.buyerTotalAmount
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="买家最终支付运费">
							<span class="form-item-value">{{
								baseInfo.buyerPaidShippingFee
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="平台实际运费">
							<span class="form-item-value">{{
								baseInfo.actualShippingFee
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="平台最终金额">
							<span class="form-item-value">{{ baseInfo.escrowAmount }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="退款金额">
							<span class="form-item-value">{{
								baseInfo.sellerReturnRefund
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="Shopee回扣金额">
							<span class="form-item-value">{{ baseInfo.shopeeDiscount }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="卖家优惠券金额">
							<span class="form-item-value">{{
								baseInfo.voucherFromSeller
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="退货运费">
							<span class="form-item-value">{{
								baseInfo.reverseShippingFee
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="联盟营销方案佣金">
							<span class="form-item-value">{{
								baseInfo.orderAmsCommissionFee
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="佣金">
							<span class="form-item-value">{{ baseInfo.commissionFee }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="服务费">
							<span class="form-item-value">{{ baseInfo.serviceFee }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="交易手续费">
							<span class="form-item-value">{{
								baseInfo.sellerTransactionFee
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="汇率">
							<span class="form-item-value">{{ baseInfo.exchangeRate }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<el-divider />
		<div class="section table">
			<h3>订单货物</h3>
			<el-table :data="goods" stripe>
				<el-table-column prop="imageUrl" label="图片">
					<template #default="scope">
						<el-image style="width: 100px" :src="scope.row.imageUrl" />
					</template>
				</el-table-column>
				<el-table-column prop="itemName" label="链接名称" width="300" />
				<el-table-column prop="modelId" label="款式id" width="320">
					<template #default="scope">
						<div>
							<div>model id：{{ scope.row.modelId }}</div>
							<div>model名称：{{ scope.row.modelName }}</div>
							<div>modelsku：{{ scope.row.modelSku }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="count" label="数量" />
				<el-table-column prop="originalPrice" label="原始价格" />
				<el-table-column prop="sellingPrice" label="销售价格" />
				<el-table-column prop="sellerDiscount" label="卖家折扣" />
				<el-table-column prop="discountedPrice" label="折扣价格" />
				<el-table-column prop="cost" label="成本" />
				<el-table-column prop="profit" label="利润" />
				<el-table-column prop="profitRate" label="利润率" />
			</el-table>
			<el-divider />
			<h3>数量统计信息</h3>
			<el-table :data="clothesCountMap" stripe>
				<el-table-column prop="key" label="衣服类型" />
				<el-table-column prop="value" label="数量" />
			</el-table>
		</div>
		<el-divider />
		<div class="section">
			<h3>物流信息</h3>
			<el-form :model="logistics" :readonly="true">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="运单号">
							<span class="form-item-value">{{
								logistics.trackingNumber
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="运单状态">
							<span class="form-item-value">{{
								logistics.logisticsStatus
							}}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-timeline v-if="logistics?.logisticsData?.length">
				<el-timeline-item
					:timestamp="item.update_time"
					placement="top"
					v-for="item in logistics?.logisticsData ?? []"
					:key="item.update_time"
				>
					<el-card>
						<h4>{{ item.description }}</h4>
						<p>{{ item.logistics_status }}</p>
					</el-card>
				</el-timeline-item>
			</el-timeline>
			<el-empty v-else />
		</div>
		<el-divider />
		<div class="section">
			<h3>调整信息</h3>
			<el-table :data="adjustData?.data ?? []" stripe>
				<el-table-column prop="scenario" label="调整场景" />
				<el-table-column prop="amount" label="调整金额" />
				<el-table-column prop="cost_header" label="费用类型" />
				<el-table-column prop="currency" label="调整金额" />
				<el-table-column prop="remark" label="备注" />
			</el-table>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
	getOrderDetail,
	getOrderItem,
	getTrackingInfo,
	getPayoutInfo,
} from "@/network/api";

const props = defineProps(["orderSn"]);

// 基础信息
const baseInfo = ref({});
// 货物信息
const goods = ref([]);
// 货物统计
const clothesCountMap = ref([]);
// 物流信息
const logistics = ref({});
// 调整信息
const adjustData = ref({});

watch(
	() => props.orderSn,
	() => {
		getData();
	},
	{
		immediate: true,
		deep: true,
	}
);

async function getData() {
	if (!props.orderSn) {
		return;
	}
	const p = { order_sn: props.orderSn };
	baseInfo.value = await getOrderDetail(p);
	const res = await getOrderItem(p);
	goods.value = res?.order_item ?? [];
	clothesCountMap.value = res?.order_item_stat ?? [];
	const res2 = await getTrackingInfo(p);
	logistics.value = res2 ?? {};
	adjustData.value = await getPayoutInfo(p);
}
</script>

<style scoped lang="scss">
.detail {
	width: 100%;
	overflow: auto;
	.summary {
		margin: 20px 0;
	}
	.section {
		&:not(:last-child) {
			margin-bottom: 20px;
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
