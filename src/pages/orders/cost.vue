<template>
	<div class="cost">
		<div class="search gutter">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="衣服种类">
					<el-select v-model="formInline.cost_type" class="w190" clearable>
						<el-option
							v-for="item in costSelectData"
							:label="item.value"
							:value="item.key"
							:key="item.key"
						/>
					</el-select>
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
				<!-- <el-table-column prop="name"
          label="产品名称" /> -->
				<el-table-column prop="type" label="衣服种类" />
				<el-table-column prop="price" label="成本" />
				<el-table-column prop="exchangeRate" label="汇率" />
				<el-table-column prop="startTime" label="开始时间" />
				<el-table-column prop="endTime" label="结束时间" />
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
		<el-dialog v-model="dialogVisible" :title="title" width="400" center>
			<costDetail
				:data="detailData"
				:costSelectData="costSelectData"
				@save="onSaveData"
			/>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import costDetail from "./costDetail.vue";
import {
	getCostTypeSelect,
	getCostList,
	deleteCost,
	updateCost,
} from "@/network/api";

const formInline = ref({});
const currentPage = ref(1);
const totalPage = ref(0);
const multipleTableRef = ref();
const multipleSelection = ref([]);
const timeRange = ref([]);
const title = ref("新增成本");
const dialogVisible = ref(false);
const detailData = ref({});
const costSelectData = ref([]);

const params = ref({
	size: 10,
});

const tableData = ref([]);

function onClickAdd() {
	title.value = "新增成本";
	detailData.value = {};
	dialogVisible.value = true;
}

function showDetail(value) {
	title.value = "修改成本";
	detailData.value = value;
	dialogVisible.value = true;
}

async function onSaveData(data) {
	try {
		const res = await updateCost(data);
		ElMessage({
			message: res?.message ?? "操作成功",
			type: "success",
		});
		detailData.value = {};
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
	const res = await getCostList({
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
	if (!multipleSelection.value.length) {
		ElMessage({
			message: "请选择需要操作的数据",
			type: "warning",
		});
		return;
	}
	const ids = multipleSelection.value.map((item) => item.id);
	const res = await deleteCost({ idList: ids });
	ElMessage({
		message: res?.message ?? "操作成功",
		type: "success",
	});
	getList();
}

async function init() {
	getList();
	costSelectData.value = await getCostTypeSelect();
}

init();
</script>

<<<<<<< HEAD
<style lang="scss" scoped>
.cost {
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
=======
<style lang='scss' scoped>
.cost {
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
>>>>>>> d212d9e1eb6b8a410a636f42203376b48577c6cf
