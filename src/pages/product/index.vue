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
					<el-select
						v-model="formInline.item_ids"
						class="w190"
						clearable
						multiple
						filterable
						remote
						:remote-method="remoteMethod1"
					>
						<el-option
							v-for="item in itemIdSelectData"
							:label="item.value"
							:value="item.key"
							:key="item.key"
						/>
					</el-select>
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
					<el-select
						v-model="formInline.item_skus"
						class="w190"
						clearable
						multiple
						filterable
						remote
						:remote-method="remoteMethod2"
					>
						<el-option
							v-for="item in styleNoSelectData"
							:label="item.value"
							:value="item.key"
							:key="item.key"
						/>
					</el-select>
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
						remote
						:remote-method="remoteMethod3"
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
				:row-key="(row) => row.id"
				@row-click="onSelectChange"
				@selection-change="handleSelectionChange"
				@sort-change="onSortChange"
			>
				<el-table-column
					type="selection"
					width="55"
					:reserve-selection="true"
				/>
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
				<el-button type="primary" @click="onRefresh">刷新</el-button>
				<el-button :disabled="!multipleSelection.length" @click="onExport"
					>导出</el-button
				>
				<el-button type="primary" :disabled="refreshing" @click="sameLevel"
					>同步等级</el-button
				>
				<el-button @click="showUploadDialog = true">导入标签</el-button>
				<el-button
					type="primary"
					:disabled="multipleSelection.length === 0"
					@click="onHandleAddTag"
					>批量新增标签</el-button
				>
				<el-button
					type="primary"
					:disabled="multipleSelection.length === 0"
					@click="onHandleClearTag"
					>批量清空标签</el-button
				>
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
		<el-dialog
			v-model="butchTagDialogVisible"
			title="批量标签处理"
			width="500"
			:close-on-click-modal="false"
			center
		>
			<div>
				标签：
				<el-tag
					style="margin-right: 10px"
					v-for="(tag, index) in butchTags"
					:key="tag"
					closable
					type="primary"
					@close="handleRemoveButchTag(index)"
				>
					{{ tag }}
				</el-tag>
				<el-button type="primary" size="small" @click="showTagDialog = true"
					>新增</el-button
				>
			</div>
			<template #footer>
				<div class="dialog-action">
					<el-button type="primary" @click="onSaveButchTag">确认</el-button>
					<el-button @click="butchTagDialogVisible = false">取消</el-button>
				</div>
			</template>
		</el-dialog>
		<AddTag
			:showTagDialog="showTagDialog"
			@confirm="onConfirmTag"
			@close="showTagDialog = false"
		/>
		<el-dialog
			v-model="showUploadDialog"
			title="上传"
			width="500"
			:close-on-click-modal="false"
			center
		>
			<UploadField />
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Detail from "./detail.vue";
import TimeSelect from "@/pages/product/components/TimeSelect.vue";
import AddTag from "@/pages/product/components/AddTag.vue";
import UploadField from "@/pages/product/components/UploadField.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	getShopSelect,
	refreshLevel,
	getCategorySelect,
	refreshProducts,
	getStatusSelect,
	getProductList,
	exportProduct,
	batchSaveProductTag,
} from "@/network/api";
import {
	getProductGradeSelect,
	getProductTagSelect,
	getProductIdSelect,
	getStyleNoSelect,
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
const itemIdSelectData = ref([]);
const styleNoSelectData = ref([]);
const multipleSelection = ref([]);

const refTable = ref(null);
const refreshing = ref(false);
const ruleList = ref([]);
const tagsList = ref([]);
const butchTagDialogVisible = ref(false);
const butchTags = ref([]); // 批量处理标签显示列表
const showTagDialog = ref(false); // 新增标签弹窗
const showUploadDialog = ref(false); // 上传弹窗

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

async function onExport() {
	exportProduct({ itemIds: multipleSelection.value.map((item) => item.id) });
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
}

function chooseImage() {
	return;
}

// 批量处理标签
async function handleRemoveButchTag(idx) {
	butchTags.value.splice(idx, 1);
}

// 批量新增标签
function onHandleAddTag() {
	butchTags.value = [];
	butchTagDialogVisible.value = true;
}

// 批量清空标签
async function onHandleClearTag() {
	await ElMessageBox.confirm("确认清空标签?", "提示");
	const p = {
		type: "delete",
		ids: multipleSelection.value.map((item) => item.id),
		tagNameList: [],
	};
	await batchSaveProductTag(p);
	onQuery();
}

// 标签弹窗相关
function onConfirmTag(data) {
	const tag = data.type == "1" ? data.tagName : data.customTag;

	if (!butchTags.value.includes(tag)) {
		butchTags.value.push(tag);
	}
	showTagDialog.value = false;
}

async function onSaveButchTag() {
	const p = {
		type: "save",
		ids: multipleSelection.value.map((item) => item.id),
		tagNameList: butchTags.value,
	};
	await batchSaveProductTag(p);
	butchTagDialogVisible.value = false;
	onQuery();
}

// 远程搜索
async function remoteMethod1(query) {
	if (query) {
		itemIdSelectData.value = await getProductIdSelect({ item_id: query });
	} else {
		itemIdSelectData.value = [];
	}
}

async function remoteMethod2(query) {
	if (query) {
		styleNoSelectData.value = await getStyleNoSelect({ sku_name: query });
	} else {
		styleNoSelectData.value = [];
	}
}

async function remoteMethod3(query) {
	if (query) {
		tagsList.value = await getProductTagSelect({ tag_name: query });
	} else {
		tagsList.value = [];
	}
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
