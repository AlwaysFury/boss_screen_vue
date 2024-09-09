<template>
	<div class="detail">
		<div class="form">
			<el-form :model="detailData" :readonly="true" label-width="80">
				<el-row :gutter="20">
					<el-col :span="3">
						<el-form-item label="产品 id">
							<span class="form-item-value">{{ detailData.itemId }}</span>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item label="产品名称">
							<span class="form-item-value">{{ detailData.itemName }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="5">
						<el-form-item label="所属店铺">
							<span class="form-item-value">{{ detailData.shopName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="产品等级">
							<span class="form-item-value">{{ detailData.grade }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="分类">
							<span class="form-item-value">{{ detailData.categoryName }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="状态">
							<span class="form-item-value">{{ detailData.status }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="创建时间">
							<span class="form-item-value">{{ detailData.createTime }}</span>
						</el-form-item>
					</el-col> </el-row
				><el-form-item label="标签">
					<el-tag
						v-for="(tag, index) in tagList"
						class="tag-item"
						:key="tag"
						type="primary"
						:closable="action == '2' && tag.tagType !== 'AUTO'"
						:disable-transitions="false"
						@close="handleRemoveTag(index)"
					>
						{{ tag.tagName }}
					</el-tag>
					<el-button
						type="default"
						size="small"
						v-if="action == '1'"
						@click="handleEdit"
						>编辑</el-button
					>
					<block v-else>
						<el-button
							class="button-new-tag"
							size="small"
							@click="showTagDialog = true"
						>
							新增
						</el-button>
						<el-button type="primary" size="small" @click="onSaveTag">
							保存
						</el-button>
						<el-button type="default" size="small" @click="onCancel">
							取消
						</el-button>
					</block>
				</el-form-item>
			</el-form>
		</div>
		<el-divider />
		<!-- 额外信息 -->
		<div class="extro">
			<el-form :model="extraInfo" :readonly="true" label-width="80">
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="销售量">
							<span class="form-item-value">{{ extraInfo.sale }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="浏览量">
							<span class="form-item-value">{{ extraInfo.views }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="点赞数">
							<span class="form-item-value">{{ extraInfo.likes }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="评分">
							<span class="form-item-value">{{ extraInfo.ratingStar }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="评论数">
							<span class="form-item-value">{{ extraInfo.commentCount }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="等级">
							<span class="form-item-value">{{ extraInfo?.grade ?? "" }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="近3天销量">
							<span class="form-item-value">{{
								extraInfo.salesVolume3daysCount
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="近7天销量">
							<span class="form-item-value">{{
								extraInfo.salesVolume7daysCount
							}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="近15天销量">
							<span class="form-item-value">{{
								extraInfo.salesVolume15daysCount
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="近30天销量">
							<span class="form-item-value">{{
								extraInfo.salesVolume30daysCount
							}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="转化率(加入购物车)">
							<span class="form-item-value">{{ extraInfo.addCartRate }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="转化率(已下单)">
							<span class="form-item-value">{{ extraInfo.orderRate }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="件数">
					<span class="form-item-value">{{ extraInfo.productCount }}</span>
				</el-form-item>
				<div>
					<el-button @click="getdialogTableData(1)">查看商品表现详情</el-button>
					<el-button @click="getdialogTableData(2)">查看商品活动表现</el-button>
				</div>
			</el-form>
		</div>
		<el-divider />
		<h3>款式信息</h3>
		<div class="table">
			<el-table
				:data="tableData"
				stripe
				style="width: 100%"
				:span-method="objectSpanMethod"
				ref="refTable"
			>
				<el-table-column prop="imageUrl" label="图片">
					<template #default="scope">
						<el-image style="width: 100px" :src="scope.row.imageUrl" />
					</template>
				</el-table-column>
				<el-table-column prop="itemId" label="所属产品 id" />
				<el-table-column prop="modelId" label="model id" />
				<el-table-column prop="modelName" label="model 名称" />
				<el-table-column prop="modelSku" label="model sku" />
				<el-table-column prop="currentPrice" label="当前价格" />
				<el-table-column prop="originalPrice" label="原始价格" />
				<el-table-column prop="stock" label="库存" />
				<el-table-column prop="salesVolume" label="销量" />
			</el-table>
		</div>
		<AddTag
			:showTagDialog="showTagDialog"
			type="ITEM"
			@confirm="onConfirmTag"
			@close="showTagDialog = false"
		/>
		<el-dialog
			:title="dialogTitle"
			top="50px"
			width="1100"
			v-model="dialogVisible"
		>
			<ProductExpression v-if="dialogType == 1" :data="dialogTableData" />
			<ActiveDetail v-else :data="dialogTableData" />
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from "vue";
import AddTag from "@/pages/product/components/AddTag.vue";
import ProductExpression from "@/pages/product/components/ProductExpression.vue";
import ActiveDetail from "@/pages/product/components/ActiveDetail.vue";
import {
	getModel,
	getProductDetail,
	saveTagList,
	getExpressionDetail,
	getActiveDetail,
} from "@/network/api";

const props = defineProps(["ItemId", "close"]);

const refTable = ref(null);

const detailData = ref({});
const tableData = ref([]);
// 原始标签列表
const originTagList = ref([]);
const showTagDialog = ref(false);
const action = ref("1"); // 1、静态 2、编辑
// 产品表现详情/活动表现详情
const dialogTitle = ref("商品表现详细");
const dialogTableData = ref([]);
const dialogVisible = ref(false);
const dialogType = ref(1); // 1、产品表现 2、活动表现

watch(
	() => props.ItemId,
	() => {
		if (props.ItemId) {
			getDetailData();
			getModelData();
			nextTick(() => {
				if (refTable.value) {
					refTable.value.setScrollTop(0);
				}
			});
		}
	},
	{
		immediate: true,
		deep: true,
	}
);

watch(
	() => props.close,
	() => {
		action.value = "1";
	}
);

// 额外信息
const extraInfo = computed(() => {
	return detailData.value?.extraInfo ?? {};
});

// 标签信息
const tagList = computed(() => {
	return detailData.value?.tagList ?? [];
});

// 合并计算
const mergeRows = computed(() => {
	const mergingRows = [];
	let mergingPos = 0;
	tableData.value = tableData.value.sort((a, b) =>
		a["name"].localeCompare(b["name"])
	);
	for (let i = 0; i < tableData.value.length; i++) {
		// tabledata 表格数据源
		if (i === 0) {
			mergingRows.push(1);
			mergingPos = 0;
		} else {
			if (tableData.value[i].name === tableData.value[i - 1].name) {
				// 哪些数据是要合并的 合并的条件是什么 此处合并条件为name 相同则进行合并
				mergingRows[mergingPos] += 1;
				mergingRows.push(0);
			} else {
				mergingRows.push(1);
				mergingPos = i;
			}
		}
	}
	return mergingRows;
});

function objectSpanMethod({ row, column, rowIndex, columnIndex }) {
	if (columnIndex === 0) {
		// 只合并第一列
		const _row = mergeRows.value[rowIndex];
		const _col = _row > 0 ? 1 : 0;
		return {
			rowspan: _row,
			colspan: _col,
		};
	}
}

async function getModelData() {
	if (!props.ItemId) {
		return;
	}
	try {
		tableData.value = await getModel({
			item_id: props.ItemId,
		});
	} catch {
		tableData.value = [];
	}
}

async function getDetailData() {
	detailData.value = await getProductDetail({ item_id: props.ItemId });
}

function handleEdit() {
	originTagList.value = [...tagList.value];
	action.value = "2";
}

function onCancel() {
	detailData.value.tagList = [...originTagList.value];
	originTagList.value = [];
	action.value = "1";
}

function onConfirmTag(data) {
	const tag = data.type == "1" ? data.tagName : data.customTag;
	if (!detailData.value.tagList) {
		detailData.value.tagList = [];
	}
	const nameLists = detailData.value.tagList.map((item) => item.tagName);
	if (!nameLists.includes(tag)) {
		detailData.value.tagList.push({ tagName: tag });
	}
	showTagDialog.value = false;
}

async function onSaveTag() {
	await saveTagList({
		tagNameList: detailData.value.tagList.map((item) => item.tagName),
		id: props.ItemId,
	});
	originTagList.value = [];
	action.value = "1";
}

function handleRemoveTag(idx) {
	detailData.value.tagList.splice(idx, 1);
}

async function getdialogTableData(type) {
	dialogType.value = type;
	dialogTitle.value = type == 1 ? "商品表现详细" : "商品活动表现";
	const fn = type == 1 ? getExpressionDetail : getActiveDetail;
	dialogTableData.value = await fn({ item_id: props.ItemId });
	dialogVisible.value = true;
}
</script>

<style scoped lang="scss">
.detail {
	width: 100%;
	padding: 20px 0;
	display: flex;
	flex-direction: column;
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
	.tag-item {
		margin-right: 10px;
	}
}
</style>
