<template>
	<div class="model">
		<div class="search gutter">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="款号">
					<el-select
						v-model="formInline.sku_id"
						filterable
						class="w190"
						clearable
					>
						<el-option
							v-for="item in skuList"
							:label="item.name"
							:value="item.id"
							:key="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="标签">
					<el-select
						v-model="formInline.tag_ids"
						filterable
						multiple
						class="w190"
						clearable
						remote
						:remote-method="remoteMethod"
					>
						<el-option
							v-for="item in tagSelectData"
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
				<el-form-item label="图片名称">
					<el-input
						v-model="formInline.photo_name"
						placeholder="请输入图片名称"
						clearable
					/>
				</el-form-item>
				<el-form-item label="最小销量">
					<el-input-number v-model="formInline.min_value" :min="0" />
				</el-form-item>
				<el-form-item label="最大销量">
					<el-input-number v-model="formInline.max_value" :min="0" />
				</el-form-item>
				<!-- <el-form-item label="时间">
					<el-date-picker
						v-model="timeRange"
						type="datetimerange"
						value-format="YYYY-MM-DD HH:mm:ss"
						clearable
					/>
				</el-form-item> -->
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
				row-key="id"
				@selection-change="handleSelectionChange"
				@sort-change="onSortChange"
			>
				<el-table-column
					type="selection"
					width="55"
					:reserve-selection="true"
				/>
				<el-table-column prop="photoSrc" label="图案">
					<template #default="scope">
						<el-image
							style="width: 100px"
							@click.stop="chooseImage"
							:src="scope.row.photoSrc"
							:preview-src-list="[scope.row.photoSrc]"
							:hide-on-click-modal="true"
						/>
						<!-- <el-image style="width: 100px;"
              :src="scope.row.photoSrc" /> -->
					</template>
				</el-table-column>
				<el-table-column prop="skuName" label="款号" />
				<el-table-column prop="tagNameList" label="标签">
					<template #default="scope">
						<div v-if="scope.row.tagNameList?.length > 0">
							<el-tag
								v-for="tag in scope.row.tagNameList"
								class="tag-item"
								:key="tag"
								type="primary"
							>
								{{ tag }}
							</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="salesVolume" label="销量" />
				<el-table-column prop="grade" label="等级" sortable="custom" />
				<el-table-column prop="action" label="操作">
					<template #default="scope">
						<div style="margin-bottom: 10px">
							<el-button type="primary" @click="onEdit(scope.row)"
								>编辑</el-button
							>
						</div>
						<div>
							<el-button type="info" @click="showDetail(scope.row)"
								>查看详情</el-button
							>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="action">
			<div class="left">
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
		<el-dialog
			v-model="dialogVisible"
			:title="title"
			width="800"
			:close-on-click-modal="false"
			center
		>
			<el-form :model="detailData" v-loading="uploading">
				<el-row>
					<el-col :span="8">
						<el-form-item label="图片" label-width="100" required>
							<el-upload
								v-model:file-list="fileList"
								:class="{ disabled: fileList.length > 0 }"
								list-type="picture-card"
								:limit="1"
								:http-request="handleImgUpload"
								:on-remove="handleRemove"
								:on-success="handleUploadSuccess"
								:on-preview="handlePictureCardPreview"
								disabled
							>
								<!-- :disabled="dialogType == 'detail'" -->
								<el-icon v-if="fileList.length == 0">
									<Plus />
								</el-icon>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<!-- <el-form-item label="图片名称" label-width="100">
							<span class="form-item-value">{{ detailData.photoName }}</span>
						</el-form-item> -->
						<el-form-item label="款号" label-width="100">
							<span class="form-item-value">{{ detailData.skuName }}</span>
						</el-form-item>
						<el-form-item
							label="等级"
							label-width="100"
							v-if="dialogType == 'detail'"
						>
							<span class="form-item-value">{{ detailData.grade }}</span>
						</el-form-item>
						<el-form-item label="关联款号" label-width="100">
							<el-select
								v-model="relevanceIds"
								clearable
								multiple
								filterable
								:disabled="dialogType === 'detail'"
							>
								<el-option
									v-for="item in skuList"
									:label="item.name"
									:value="item.name"
									:key="item.id"
								/>
							</el-select>
						</el-form-item>
						<el-form-item label="标签" label-width="100">
							<el-tag
								v-for="(tag, index) in detailData.tagList"
								class="tag-item"
								:key="tag"
								type="primary"
								:closable="dialogType != 'detail' && tag.tagType != 'AUTO'"
								:disable-transitions="false"
								@close="handleRemoveTag(index)"
							>
								{{ tag.tagName }}
							</el-tag>

							<el-button
								class="button-new-tag"
								size="small"
								v-if="dialogType != 'detail'"
								@click="showTagDialog = true"
							>
								新增
							</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<!-- <el-col :span="6">
						<el-form-item label="创建时间">
							<span class="form-item-value">{{ detailData.createTime }}</span>
						</el-form-item>
					</el-col> -->
				</el-row>
			</el-form>
			<template v-if="dialogType == 'detail'">
				<el-divider />
				<h3>关联款号及数量</h3>
				<el-table :data="linkSkuData" stripe border style="width: 100%">
					<el-table-column prop="name" label="款号" />
					<el-table-column prop="saleVolume" label="销量" />
					<el-table-column prop="itemIds" label="所在链接" />
					<el-table-column prop="shopNames" label="所在店铺" />
				</el-table>
			</template>
			<template #footer>
				<div class="dialog-action">
					<el-button type="primary" :disabled="uploading" @click="onSaveData"
						>确认</el-button
					>
					<el-button @click="dialogVisible = false">取消</el-button>
				</div>
			</template>
		</el-dialog>
		<AddTag
			:showTagDialog="showTagDialog"
			type="photo"
			@confirm="onConfirmTag"
			@close="showTagDialog = false"
		/>
		<el-dialog v-model="previewDialogVisible" :fullscreen="true">
			<img
				w-full
				style="max-width: 100%"
				:src="dialogImageUrl"
				alt="Preview Image"
			/>
		</el-dialog>
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
				<el-button type="primary" size="small" @click="onAddButchTag"
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
		<el-dialog
			v-model="showUploadDialog"
			title="上传"
			width="500"
			:close-on-click-modal="false"
			center
		>
			<UploadField type="photo" />
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AddTag from "@/pages/product/components/AddTag.vue";
import UploadField from "@/pages/product/components/UploadField.vue";
import {
	getModelList,
	getPatternList,
	getPatternDetail,
	refreshPhoto,
	getLinkSku,
	deletePattern,
	updatePattern,
	getUploadId,
	batchSaveTag,
} from "@/network/api";
import { getPhotoGradeSelect, getPhotoTagSelect } from "@/network/selectApi";
import { uploadFile } from "@/workers/main.js";

const formInline = ref({});
const currentPage = ref(1);
const totalPage = ref(0);
const multipleTableRef = ref();
const multipleSelection = ref([]);
// const timeRange = ref([]);
const title = ref("新增图案");
const dialogVisible = ref(false);
const previewDialogVisible = ref(false);
const refreshing = ref(false);
const detailData = ref({});
const dialogImageUrl = ref("");

const params = ref({
	size: 10,
});

const skuList = ref([]);
const tableData = ref([]);
const linkSkuData = ref([]);
const ruleList = ref([]);
// 标签选择数据
const tagSelectData = ref([]);

// 图案编辑弹窗相关
const fileList = ref([]);
const dialogType = ref("add");
const relevanceIds = ref([]);

// 标签对话框相关
const showTagDialog = ref(false);
const uploading = ref(false);
const tagEditType = ref("1"); // 1: 单个编辑 2: 批量编辑
const butchTagDialogVisible = ref(false);
const butchTags = ref([]);
const showUploadDialog = ref(false); // 上传弹窗

watch(
	() => dialogVisible.value,
	() => {
		if (!dialogVisible.value) {
			detailData.value = {
				tagList: [],
			};
			fileList.value = [];
			relevanceIds.value = [];
		}
	}
);

// function onClickAdd() {
// 	dialogType.value = "add";
// 	title.value = "新增图案";
// 	detailData.value = {
// 		tagList: [],
// 	};
// 	linkSkuData.value = [];
// 	dialogVisible.value = true;
// }

async function onEdit(value) {
	dialogType.value = "edit";
	title.value = "图案详情编辑";
	loadDetail(value);
}

async function showDetail(value) {
	dialogType.value = "detail";
	title.value = "图案详情";
	loadDetail(value);
}

async function loadDetail(value) {
	dialogVisible.value = true;
	tagEditType.value = "1";
	detailData.value = await getPatternDetail({ sku_id: value.id });
	relevanceIds.value = (detailData.value?.relevanceSku ?? []).map(
		(item) => item.name
	);
	if (detailData.value.photoSrc) {
		fileList.value = [
			{
				url: detailData.value?.photoSrc,
			},
		];
	}
	if (dialogType.value === "detail") {
		const res = await getLinkSku({ sku_id: detailData.value.id });
		linkSkuData.value = res.sort((a, b) => b.top - a.top);
	}
}

// 保存
async function onSaveData() {
	if (!detailData.value.photoSrc) {
		ElMessage({
			message: "请上传图片",
			type: "warning",
		});
		return;
	}
	try {
		const p = { ...detailData.value, relevanceSkuNames: relevanceIds.value };
		if (detailData.value?.tagList.length > 0) {
			p.tagNameList = detailData.value.tagList.map((item) => item.tagName);
		}
		const res = await updatePattern(p);
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
	// if (timeRange.value && timeRange.value.length) {
	// 	params.value.start_time = timeRange.value[0];
	// 	params.value.end_time = timeRange.value[1];
	// } else {
	// 	delete params.value.start_time;
	// 	delete params.value.end_time;
	// }
	getList();
}

function reset() {
	formInline.value = {};
	// timeRange.value = [];
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
	const res = await getPatternList({
		current: currentPage.value,
		...formInline.value,
		...params.value,
	});
	tableData.value = res?.recordList ?? [];
	totalPage.value = res?.count ?? 0;
}

// 获取款号数据
async function getSkuList() {
	const res = await getModelList();
	skuList.value = res?.recordList ?? [];
}

function handleSelectionChange(val) {
	multipleSelection.value = val;
}

// 删除前提示
async function onHandleAction() {
	await ElMessageBox.confirm("确认删除?", "提示");
	ElMessageBox.confirm("是否删除款号和关联款号?", "Warning", {
		confirmButtonText: "是",
		cancelButtonText: "否",
		type: "warning",
	})
		.then(() => {
			handleDelete(true);
		})
		.catch(() => {
			handleDelete(false);
		});
}

async function handleDelete(isDelete) {
	const ids = multipleSelection.value.map((item) => item.id);
	const res = await deletePattern({ idList: ids, isDelete });
	ElMessage({
		message: res?.message ?? "操作成功",
		type: "success",
	});
	getList();
}

async function onSortChange(data) {
	const obj = {
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
	params.value.orderBy_name = rule ? key + " " + rule : "";
	onQuery();
}

async function init() {
	getList();
	getSkuList();
	ruleList.value = await getPhotoGradeSelect();
}

// 图片编辑对话框相关
async function handleImgUpload(file) {
	// uploading.value = true;
	const fileName = file.file.name;
	try {
		const { uploadId, src } = await getUploadId({ fileName });
		uploadFile(file.file, uploadId);
		detailData.value.photoName = fileName;
		detailData.value.photoSrc = src;
		fileList.value = [
			{
				name: fileName,
				url: src,
			},
		];
	} catch (e) {
		ElMessage({
			message: "图片上传异常，请重试",
			type: "warning",
		});
		fileList.value = [];
	} finally {
		uploading.value = false;
	}
}

async function handleRemove() {
	detailData.value.photoSrc = "";
}

async function handleUploadSuccess(response, uploadFile, uploadFiles) {
	fileList.value = uploadFiles;
}

// 标签弹窗相关
function onConfirmTag(data) {
	const tag = data.type == "1" ? data.tagName : data.customTag;
	if (tagEditType.value == "1") {
		if (!detailData.value.tagList) {
			detailData.value.tagList = [];
		}
		const nameLists = detailData.value.tagList.map((item) => item.tagName);
		if (!nameLists.includes(tag)) {
			detailData.value.tagList.push({ tagName: tag });
		}
	} else {
		// 批量编辑
		if (!butchTags.value.includes(tag)) {
			butchTags.value.push(tag);
		}
	}
	showTagDialog.value = false;
}

async function handleRemoveTag(idx) {
	detailData.value.tagList.splice(idx, 1);
}

function handlePictureCardPreview(uploadFile) {
	dialogImageUrl.value = uploadFile.url;
	previewDialogVisible.value = true;
}

// 同步等级
async function sameLevel() {
	refreshing.value = true;
	try {
		const p = { ...params.value };
		delete p.size;
		delete p?.current;
		await refreshPhoto(p);
		onQuery();
	} finally {
		refreshing.value = false;
	}
}

// 避免触发详情
function chooseImage() {
	return;
}

function openPage() {
	const url = `${process.env.BASE_URL}aliyunOSS/index.html`;
	window.open(url, "_blank"); // 在新标签页中打开
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
		skuNames: multipleSelection.value.map((item) => item.skuName),
		tagNameList: [],
	};
	await batchSaveTag(p);
	onQuery();
}

function onAddButchTag() {
	tagEditType.value = "2";
	showTagDialog.value = true;
}

async function onSaveButchTag() {
	const p = {
		type: "save",
		skuNames: multipleSelection.value.map((item) => item.skuName),
		tagNameList: butchTags.value,
	};
	await batchSaveTag(p);
	butchTagDialogVisible.value = false;
	onQuery();
}

// 远程搜索
async function remoteMethod(tag_name) {
	if (!tag_name) {
		tagSelectData.value = [];
	} else {
		tagSelectData.value = await getPhotoTagSelect({ tag_name });
	}
}

init();
</script>

<style lang="scss" scoped>
.model {
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
	.w_full {
		width: 100% !important;
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
	.tag-item {
		margin-right: 10px;
	}
	.form-item-value {
		padding: 0 5px;
		background-color: #f7f7f7;
	}
	:deep(.disabled) {
		// .el-upload-list__item-preview {
		//   display: none !important;
		// }
		// .el-upload-list__item-delete {
		//   margin-left: 0;
		// }
		.el-upload--picture-card {
			display: none !important;
		}
	}
	:deep(.el-table) {
		height: 100%;
		.el-table__cell {
			z-index: auto;
		}
	}
}
</style>
