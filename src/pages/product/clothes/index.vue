<template>
	<div class="index">
		<div class="search gutter">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="衣服名称">
					<el-input
						v-model="formInline.clothesType_name"
						placeholder="请输入衣服名称"
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
				@row-click="onSelectChange"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="name" label="名称" />
				<el-table-column prop="code" label="编码" />
			</el-table>
		</div>
		<div class="action">
			<div class="left">
				<el-button type="primary" @click="onAdd">新增</el-button>
				<el-button
					type="danger"
					:disabled="!multipleSelection.length"
					@click="onDelete"
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
		<el-dialog
			v-model="dialogVisible"
			:title="title"
			width="500"
			:close-on-click-modal="false"
			center
		>
			<el-form :model="detailData" ref="editFormRef" :rules="rules">
				<el-form-item label="名称" label-width="100">
					<el-input
						v-model="detailData.name"
						placeholder="请输入名称"
						clearable
					/>
				</el-form-item>
				<el-form-item label="编码" label-width="100">
					<el-input
						v-model="detailData.code"
						placeholder="请输入编码"
						clearable
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-action">
					<el-button
						type="primary"
						:disabled="updating"
						@click="onSaveData(editFormRef)"
						>确认</el-button
					>
					<el-button @click="dialogVisible = false">取消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getClothingList, saveClothing, deleteClothing } from "@/network/api";

const formInline = ref({});
const currentPage = ref(1);
const totalPage = ref(0);
const multipleTableRef = ref();
const dialogVisible = ref(false);
const updating = ref(false);
const detailData = ref({});
const multipleSelection = ref([]);

const editFormRef = ref(null);
const rules = reactive({
	name: [{ required: true, message: "请输入名称", trigger: "blur" }],
	code: [{ required: true, message: "请输入编码", trigger: "blur" }],
});

const params = ref({
	size: 10,
});

const tableData = ref([]);

function onQuery() {
	currentPage.value = 1;
	getList();
}

function reset() {
	formInline.value = {};
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
	const res = await getClothingList({
		current: currentPage.value,
		...formInline.value,
		...params.value,
	});
	tableData.value = res?.recordList ?? [];
	totalPage.value = res?.count ?? 0;
}

function handleSelectionChange(value) {
	multipleSelection.value = value;
}

// 编辑
async function onSelectChange(data) {
	detailData.value = data;
	dialogVisible.value = true;
}

async function onSaveData(formEl) {
	if (!formEl) {
		return;
	}
	await formEl.validate();
	try {
		updating.value = true;
		await saveClothing(detailData.value);
		ElMessage({
			message: "修改成功",
			type: "success",
		});
		detailData.value = {};
		dialogVisible.value = false;
		getList();
	} finally {
		updating.value = false;
	}
}

async function onAdd() {
	detailData.value = {};
	dialogVisible.value = true;
}

async function onDelete() {
	ElMessageBox.confirm("确认删除?", "提示")
		.then(async () => {
			const ids = multipleSelection.value.map((item) => item.id);
			const res = await deleteClothing({ idList: ids });
			ElMessage({
				message: res?.message ?? "操作成功",
				type: "success",
			});
			getList();
		})
		.catch(() => {});
}

getList();
</script>

<style lang="scss" scoped>
.index {
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
}
</style>
