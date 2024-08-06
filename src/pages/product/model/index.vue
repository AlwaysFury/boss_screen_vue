<template>
	<div class="model">
		<div class="search gutter">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="款号">
					<el-input
						v-model="formInline.sku_name"
						placeholder="请输入款号"
						clearable
					/>
				</el-form-item>
				<el-form-item label="时间">
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
				ref="multipleTableRef"
				stripe
				style="width: 100%"
				@selection-change="handleSelectionChange"
				@row-click="showDetail"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="name" label="款号" />
				<el-table-column prop="count" label="关联款号数量" />
				<el-table-column prop="createTime" label="创建时间" />
			</el-table>
		</div>
		<div class="action">
			<div class="left">
				<el-button @click="onClickAdd">新增</el-button>
				<el-button :disabled="!multipleSelection.length" @click="onHandleAction"
					>删除</el-button
				>
			</div>
			<div class="right">
				<el-pagination
					v-model:current-page="currentPage"
					:page-sizes="[10, 30, 50, 100]"
					:page-size="10"
					:background="true"
					layout="sizes, total, prev, pager, next"
					:total="totalPage"
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
				/>
			</div>
		</div>
		<el-dialog v-model="dialogVisible" :title="title" width="800" center>
			<el-form :model="detailData" label-width="100">
				<el-form-item label="款号名称" required>
					<el-input
						v-model="detailData.name"
						placeholder="请输入款号名称"
						clearable
					/>
				</el-form-item>
				<el-form-item label="关联款号">
					<el-select v-model="skuIds" clearable multiple>
						<el-option
							v-for="item in tableData"
							:label="item.name"
							:value="item.id"
							:key="item.id"
						/>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="所属店铺"
          required>
          <el-select v-model="detailData.shopId"
            class="w190"
            clearable>
            <el-option v-for="item in shopSelectData"
              :label="item.value"
              :value="item.key"
              :key="item.key" />
          </el-select>
        </el-form-item> -->
			</el-form>
			<el-divider />
			<h3>统计信息</h3>
			<el-table :data="linkSkuData" stripe border style="width: 100%">
				<el-table-column prop="name" label="款号" />
				<el-table-column prop="saleVolume" label="销量" />
				<el-table-column prop="itemIds" label="所在链接" />
				<el-table-column prop="shopNames" label="所在店铺" />
			</el-table>
			<template #footer>
				<div class="dialog-action">
					<el-button type="primary" @click="onSaveData">确认</el-button>
					<el-button @click="dialogVisible = false">取消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	getShopSelect,
	getModelList,
	getModelDetail,
	getLinkSku,
	deleteModel,
	updateModel,
} from "@/network/api";

const formInline = ref({});
const currentPage = ref(1);
const totalPage = ref(0);
const multipleTableRef = ref();
const multipleSelection = ref([]);
// 店铺列表数据
const shopSelectData = ref([]);
const timeRange = ref([]);
const title = ref("新增款号");
const dialogVisible = ref(false);
const detailData = ref({});

const params = ref({
	size: 10,
});

const tableData = ref([]);
const linkSkuData = ref([]);

// 关联款号id
const skuIds = ref([]);

function onClickAdd() {
	title.value = "新增款号";
	detailData.value = {};
	skuIds.value = [];
	linkSkuData.value = [];
	dialogVisible.value = true;
}

async function showDetail(value) {
	title.value = "修改款号";
	detailData.value = await getModelDetail({ sku_id: value.id });
	skuIds.value = (detailData.value?.relevanceSku ?? []).map((item) => item.id);
	const res = await getLinkSku({ sku_id: value.id });
	linkSkuData.value = res.sort((a, b) => b.top - a.top);
	dialogVisible.value = true;
}

async function onSaveData() {
	if (!detailData.value.name) {
		ElMessage({
			message: "请输入款号名称",
			type: "warning",
		});
		return;
	}
	// if (!detailData.value.shopId) {
	//   ElMessage({
	//     message: "请选择所属店铺",
	//     type: 'warning',
	//   })
	//   return
	// }
	try {
		const res = await updateModel({
			...detailData.value,
			relevanceIds: skuIds.value,
		});
		ElMessage({
			message: res?.message ?? "操作成功",
			type: "success",
		});
		detailData.value = {};
		skuIds.value = [];
		dialogVisible.value = false;
		getList();
	} catch (error) {}
}

function onQuery() {
	currentPage.value = 1;
	if (timeRange.value && timeRange.value.length) {
		params.value.start_time = timeRange.value[0];
		params.value.end_time = timeRange.value[1];
	} else {
		delete params.value.start_time;
		delete params.value.end_time;
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
	params.value.size = val;
	currentPage.value = 1;
	getList();
}

async function getList() {
	const res = await getModelList({
		current: currentPage.value,
		...formInline.value,
		...params.value,
	});
	tableData.value = res?.recordList ?? [];
	totalPage.value = res?.count ?? 0;
}

function handleSelectionChange(val) {
	multipleSelection.value = val;
}

async function onHandleAction() {
	await ElMessageBox.confirm("确认删除?", "提示");
	const ids = multipleSelection.value.map((item) => item.id);
	const res = await deleteModel({ idList: ids });
	ElMessage({
		message: res?.message ?? "操作成功",
		type: "success",
	});
	getList();
}

async function init() {
	getList();
	shopSelectData.value = await getShopSelect();
}

init();
</script>

<style lang="scss" scoped>
.model {
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
