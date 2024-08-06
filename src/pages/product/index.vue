<template>
	<div class="products">
		<div class="search gutter">
			<el-form
				:inline="true"
				:model="formInline"
				class="demo-form-inline"
				label-width="80"
			>
				<el-form-item label="产品id">
					<el-input
						v-model="formInline.item_id"
						placeholder="请输入产品id"
						clearable
					/>
				</el-form-item>
				<el-form-item label="店铺">
					<el-select v-model="formInline.shop_id" class="w190" clearable>
						<el-option
							v-for="item in shopSelectData"
							:label="item.value"
							:value="item.key"
							:key="item.key"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="分类">
					<el-select v-model="formInline.category_id" class="w190" clearable>
						<el-option
							v-for="item in categorySelectData"
							:label="item.value"
							:value="item.key"
							:key="item.key"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="等级">
					<el-select v-model="formInline.rule_grade" class="w190" clearable>
						<el-option
							v-for="item in ruleList"
							:label="item.value"
							:value="item.key"
							:key="item.key"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="款号">
					<el-input
						v-model="formInline.item_sku"
						placeholder="请输入款号"
						clearable
					/>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="formInline.item_status" class="w190" clearable>
						<el-option
							v-for="item in statusSelectData"
							:label="item.value"
							:value="item.key"
							:key="item.key"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="标签">
					<el-select
						v-model="formInline.tag_ids"
						class="w190"
						clearable
						multiple
						filterable
					>
						<el-option
							v-for="item in tagsList"
							:label="item.value"
							:value="item.key"
							:key="item.key"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-date-picker
						v-model="timeRange"
						type="datetimerange"
						value-format="YYYY-MM-DD HH:mm:ss"
						placeholder=""
						clearable
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onQuery">查询</el-button>
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table gutter">
			<el-table
				:data="tableData"
				ref="refTable"
				stripe
				highlight-current-row
				style="width: 100%"
				@row-click="onSelectChange"
				@selection-change="handleSelectionChange"
				@sort-change="onSortChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column
					prop="itemId"
					label="产品id"
					width="180"
					sortable="custom"
				/>
				<el-table-column prop="itemName" label="产品名称" width="180" />
				<el-table-column prop="categoryName" label="分类名称" />
				<el-table-column prop="mainImgUrl" label="标签" width="180" center>
					<template #default="scope">
						<el-tag
							class="tag-item"
							type="primary"
							v-for="item in scope.row.tagNameList"
							:key="item"
							>{{ item }}</el-tag
						>
					</template>
				</el-table-column>
				<el-table-column prop="itemSku" label="款号" />
				<el-table-column prop="mainImgUrl" label="图片" width="150" center>
					<template #default="scope">
						<el-image
							style="width: 100px"
							@click.stop="chooseImage"
							:src="scope.row.mainImgUrl"
							:preview-src-list="[scope.row.mainImgUrl]"
							:hide-on-click-modal="true"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="shopName" label="店铺名称" />
				<el-table-column prop="salesVolume" label="总销量" sortable="custom" />
				<el-table-column prop="grade" label="等级" sortable="custom" />
				<el-table-column prop="createTime" label="创建时间" sortable="custom" />
				<el-table-column prop="status" label="状态" />
			</el-table>
		</div>
		<div class="action">
			<div class="left">
				<el-button>导出</el-button>
				<el-button type="primary" :disabled="refreshing" @click="sameLevel"
					>同步等级</el-button
				>
				<el-button type="primary" @click="onRefresh">刷新</el-button>
			</div>
			<div class="right">
				<el-pagination
					v-model:current-page="currentPage"
					:page-sizes="[10, 30, 50, 100]"
					:background="true"
					layout="sizes, total, prev, pager, next"
					:total="totalPage"
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
				/>
			</div>
		</div>
		<el-drawer v-model="dialogVisible" title="产品详情" size="100%" center>
			<detail :ItemId="itemId" :close="dialogVisible" />
		</el-drawer>
		<TimeSelect
			:show="showTimeSelect"
			@confirm="onConfirmTimeRefresh"
			@cancel="showTimeSelect = false"
		/>
	</div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Detail from "./detail.vue";
import TimeSelect from "@/pages/product/components/TimeSelect.vue";
import { ElMessage } from "element-plus";
import {
	getShopSelect,
	refreshLevel,
	getCategorySelect,
	refreshProducts,
	getStatusSelect,
	getProductList,
} from "@/network/api";
import {
	getProductGradeSelect,
	getProductTagSelect,
} from "@/network/selectApi";

const formInline = ref({});
const currentPage = ref(1);
const totalPage = ref(0);
const dialogVisible = ref(false);
const itemId = ref("");
const timeRange = ref([]);
const params = reactive({
	size: 10,
	orderBy_name: "",
});

const tableData = ref([]);
const shopSelectData = ref([]);
const categorySelectData = ref([]);
const statusSelectData = ref([]);
const multipleSelection = ref([]);

const refTable = ref(null);
const refreshing = ref(false);
const ruleList = ref([]);
const tagsList = ref([]);

// 刷新
const showTimeSelect = ref(false);

function onQuery() {
	currentPage.value = 1;
	if (timeRange.value && timeRange.value.length) {
		params.start_time = timeRange.value[0];
		params.end_time = timeRange.value[1];
	} else {
		delete params.start_time;
		delete params.end_time;
	}
	getList();
}

function reset() {
	formInline.value = {};
	timeRange.value = [];
	onQuery();
}

function handleCurrentChange(val) {
	currentPage.value = val;
	getList();
}

function handleSizeChange(val) {
	params.size = val;
	currentPage.value = 1;
	getList();
}

async function getList() {
	const p = {
		current: currentPage.value,
		...formInline.value,
		...params,
	};
	const res = await getProductList(p);
	tableData.value = res?.recordList ?? [];
	totalPage.value = res?.count ?? 0;
	if (refTable.value) {
		refTable.value.setScrollTop(0);
	}
}

function handleSelectionChange(val) {
	multipleSelection.value = val;
}

async function onRefresh() {
	if (!multipleSelection.value.length) {
		showTimeSelect.value = true;
		return;
	}
	if (multipleSelection.value.length > 10) {
		ElMessage({
			message: "单次刷新最多支持10条数据",
			type: "warning",
		});
		return;
	}
	const ids = multipleSelection.value.map((item) => item.id);
	const p = {
		ids,
		by: "id",
	};
	refreshData(p);
}

async function onConfirmTimeRefresh(timeRange) {
	const p = {
		...timeRange,
		by: "time",
	};
	showTimeSelect.value = false;
	await refreshData(p);
}

async function refreshData(params) {
	await refreshProducts(params);
	getList();
}

async function sameLevel() {
	refreshing.value = true;
	try {
		const p = { ...params };
		delete p.size;
		delete p?.current;
		await refreshLevel(p);
		onQuery();
	} finally {
		refreshing.value = false;
	}
}

async function onSortChange(data) {
	const obj = {
		salesVolume: "salesVolume",
		itemId: "s.item_id",
		createTime: "s.create_time",
		grade: "grade",
	};
	const key = obj[data.prop];
	const rule =
		data.order == "ascending"
			? "asc"
			: data.order == "descending"
			? "desc"
			: "";
	params.orderBy_name = rule ? key + " " + rule : "";
	onQuery();
}

async function onSelectChange(data, column) {
	if (!column) {
		return;
	}
	itemId.value = data.itemId;
	dialogVisible.value = true;
}

async function init() {
	getList();
	shopSelectData.value = await getShopSelect();
	categorySelectData.value = await getCategorySelect();
	statusSelectData.value = await getStatusSelect();
	ruleList.value = await getProductGradeSelect();
	tagsList.value = await getProductTagSelect();
}

function chooseImage() {
	return;
}

init();
</script>

<style lang="scss" scoped>
.products {
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
			.el-table__cell {
				z-index: auto;
			}
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
	.img {
		&:hover {
			transform: scale(1.2);
			z-index: 999;
		}
	}
	.tag-item {
		margin: 0 5px 5px 0;
	}
}
</style>
