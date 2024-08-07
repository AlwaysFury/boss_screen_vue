<template>
	<div class="levelList">
		<div class="search gutter">
			<el-form
				:inline="true"
				:model="formInline"
				class="demo-form-inline"
				label-width="80"
			>
				<el-form-item label="规则名称">
					<el-input
						v-model="formInline.rule_name"
						placeholder="请输入规则名称"
						clearable
					/>
				</el-form-item>
				<el-form-item label="等级">
					<el-input
						v-model="formInline.rule_grade"
						placeholder="请输入等级"
						clearable
					/>
				</el-form-item>
				<el-form-item label="类型">
					<el-select
						v-model="formInline.rule_type"
						class="w190"
						clearable
						filterable
						placeholder="请选择类型"
					>
						<el-option
							v-for="item in tagTypeList"
							:label="item.value"
							:value="item.key"
							:key="item.key"
						/>
					</el-select>
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
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="name" label="规则名称" />
				<el-table-column prop="grade" label="等级" />
				<el-table-column prop="type" label="类型" />
				<el-table-column prop="weight" label="权重" />
			</el-table>
		</div>
		<div class="action">
			<div class="left">
				<el-button type="primary" @click="onClickAdd">新增</el-button>
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
					:page-size="10"
					:background="true"
					layout="total, prev, pager, next"
					:total="totalPage"
					@current-change="handleCurrentChange"
				/>
			</div>
		</div>
		<el-dialog
			v-model="dialogVisible"
			:title="title"
			top="40px"
			width="800"
			center
		>
			<div class="dialogContent">
				<el-form :model="detailData" class="demo-form-inline" label-width="100">
					<el-row>
						<el-col :span="10">
							<el-form-item label="规则名称" required>
								<el-input
									v-model="detailData.name"
									placeholder="请输入规则名称"
									clearable
								/>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="等级" label-width="55" required>
								<el-input
									v-model="detailData.grade"
									placeholder="请输入等级"
									clearable
								/> </el-form-item
						></el-col>
					</el-row>
					<el-row>
						<el-col :span="10">
							<el-form-item label="规则类型" required>
								<el-radio-group v-model="detailData.type">
									<el-radio value="ITEM" size="large">链接</el-radio>
									<el-radio value="PHOTO" size="large">图案</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="权重" label-width="55" required>
								<el-input-number
									v-model="detailData.weight"
									:min="1"
									class="w190"
									placeholder="请输入权重"
									clearable
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<div>
						<el-form-item label="规则条件" required>
							<el-radio-group v-model="detailData.allOrNot">
								<el-radio :value="true" size="large">全部满足</el-radio>
								<el-radio :value="false" size="large">任意一个</el-radio>
							</el-radio-group>
						</el-form-item>
					</div>
					<div>
						<h3>具体规则</h3>
						<div class="rule-block">
							<el-row v-if="detailData.type == 'ITEM'">
								<el-col :span="10">
									<el-form-item label="链接id">
										<el-input v-model="rules.itemId.value" clearable />
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="分类id" label-width="55">
										<el-select
											v-model="rules.categoryId.value"
											class="w190"
											clearable
										>
											<el-option
												v-for="item in categorySelectData"
												:label="item.value"
												:value="item.key"
												:key="item.key"
											/>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="10" v-if="detailData.type == 'ITEM'">
									<el-form-item label="链接状态">
										<el-select
											v-model="rules.status.value"
											class="w190"
											clearable
										>
											<el-option
												v-for="item in statusSelectData"
												:label="item.value"
												:value="item.key"
												:key="item.key"
											/>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="10" v-if="detailData.type == 'PHOTO'">
									<el-form-item label="款号名称">
										<el-input v-model="rules.itemSku.value" clearable />
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="标签id" label-width="55">
										<el-select
											v-model="rules.tag.value"
											class="w190"
											clearable
											multiple
											filterable
										>
											<el-option
												v-for="item in tagSelectData"
												:label="item.value"
												:value="item.key"
												:key="item.key"
											/>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<div class="rule-item" v-if="detailData.type == 'ITEM'">
								<el-form-item label="价格">
									<el-input-number
										v-model="rules.price.minPrice"
										clearable
										class="w190 gutter-right"
										placeholder="请输入最小价格"
										:precision="2"
										:min="0"
										:max="rules.price.maxPrice"
									/>
									<el-input-number
										v-model="rules.price.maxPrice"
										clearable
										class="w190"
										:precision="2"
										:min="rules.price.minPrice || 0"
										placeholder="请输入最大价格"
									/>
								</el-form-item>
							</div>
							<div class="rule-item">
								<el-form-item label="创建时间">
									<el-date-picker
										v-model="rules.createTime.startTime"
										type="datetime"
										value-format="YYYY-MM-DD HH:mm:ss"
										placeholder="请选择开始时间"
										style="margin-right: 30px"
									/>
									<el-date-picker
										v-model="rules.createTime.endTime"
										type="datetime"
										value-format="YYYY-MM-DD HH:mm:ss"
										placeholder="请选择结束时间"
									/>
								</el-form-item>
							</div>
							<div class="rule-item">
								<el-form-item label="3天销量">
									<el-input-number
										v-model="rules.salesVolume3days.minValue"
										clearable
										class="w190 gutter-right"
										placeholder="请输入最小销量"
										:precision="2"
										:min="0"
										:max="rules.salesVolume3days.maxValue"
									/>
									<el-input-number
										v-model="rules.salesVolume3days.maxValue"
										clearable
										class="w190"
										:precision="2"
										:min="rules.salesVolume3days.minValue || 0"
										placeholder="请输入最大销量"
									/>
								</el-form-item>
							</div>
							<div class="rule-item">
								<el-form-item label="7天销量">
									<el-input-number
										v-model="rules.salesVolume7days.minValue"
										clearable
										class="w190 gutter-right"
										placeholder="请输入最小销量"
										:precision="2"
										:min="0"
										:max="rules.salesVolume7days.maxValue"
									/>
									<el-input-number
										v-model="rules.salesVolume7days.maxValue"
										clearable
										class="w190"
										:precision="2"
										:min="rules.salesVolume7days.minValue || 0"
										placeholder="请输入最大销量"
									/>
								</el-form-item>
							</div>
							<div class="rule-item">
								<el-form-item label="15天销量">
									<el-input-number
										v-model="rules.salesVolume15days.minValue"
										clearable
										class="w190 gutter-right"
										placeholder="请输入最小销量"
										:precision="2"
										:min="0"
										:max="rules.salesVolume15days.maxValue"
									/>
									<el-input-number
										v-model="rules.salesVolume15days.maxValue"
										clearable
										class="w190"
										:precision="2"
										:min="rules.salesVolume15days.minValue || 0"
										placeholder="请输入最大销量"
									/>
								</el-form-item>
							</div>
							<div class="rule-item">
								<el-form-item label="30天销量">
									<el-input-number
										v-model="rules.salesVolume30days.minValue"
										clearable
										class="w190 gutter-right"
										placeholder="请输入最小销量"
										:precision="2"
										:min="0"
										:max="rules.salesVolume30days.maxValue"
									/>
									<el-input-number
										v-model="rules.salesVolume30days.maxValue"
										clearable
										class="w190"
										:precision="2"
										:min="rules.salesVolume30days.minValue || 0"
										placeholder="请输入最大销量"
									/>
								</el-form-item>
							</div>
							<el-form-item label="总销量">
								<div class="rule-item" style="margin-bottom: 18px">
									<el-date-picker
										v-model="rules.salesVolume.startTime"
										type="datetime"
										value-format="YYYY-MM-DD HH:mm:ss"
										placeholder="请选择开始时间"
										style="margin-right: 30px"
									/>
									<el-date-picker
										v-model="rules.salesVolume.endTime"
										type="datetime"
										value-format="YYYY-MM-DD HH:mm:ss"
										placeholder="请选择结束时间"
									/>
								</div>
								<div class="rule-item">
									<el-input-number
										v-model="rules.salesVolume.minValue"
										clearable
										class="w190 gutter-right"
										placeholder="请输入最小销量"
										:precision="2"
										:min="0"
										:max="rules.salesVolume.maxValue"
									/>
									<el-input-number
										v-model="rules.salesVolume.maxValue"
										clearable
										class="w190"
										:precision="2"
										:min="rules.salesVolume.minValue || 0"
										placeholder="请输入最大销量"
									/>
								</div>
							</el-form-item>
						</div>
					</div>
				</el-form>
			</div>
			<template #footer>
				<div class="dialog-action">
					<el-button type="primary" @click="onConfirm">确认</el-button>
					<el-button @click="dialogVisible = false">取消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	getCategorySelect,
	getStatusSelect,
	getLevelList,
	getLevelDetail,
	updateLevel,
	deleteLevel,
} from "@/network/api";
import {
	getTagTypeSelect,
	getProductTagSelect,
	getPhotoTagSelect,
} from "@/network/selectApi";

const formInline = ref({});
const currentPage = ref(1);
const totalPage = ref(0);

const tableData = ref([]);
const categorySelectData = ref([]);
const statusSelectData = ref([]);
const tagTypeList = ref([]);
const refTable = ref(null);
const multipleSelection = ref([]);
const dialogVisible = ref(false);
const detailData = ref({
	allOrNot: true,
});
const rules = ref();
const title = ref("新增等级");
// 标签下拉选择数据
const tagsForPhoto = ref([]);
const tagsForItem = ref([]);

const params = ref({
	size: 10,
});

const tagSelectData = computed(() => {
	return detailData.value.type == "ITEM"
		? tagsForItem.value
		: tagsForPhoto.value;
});

watch(
	() => detailData.value.type,
	() => {
		rules.value.tag.value = "";
	}
);

function onQuery() {
	currentPage.value = 1;
	getList();
}

function reset() {
	formInline.value = {};
	onQuery();
}

function handleSelectionChange(val) {
	multipleSelection.value = val;
}

async function onDelete() {
	ElMessageBox.confirm("确认删除?", "提示")
		.then(async () => {
			const ids = multipleSelection.value.map((item) => item.id);
			const res = await deleteLevel({ idList: ids });
			ElMessage({
				message: res?.message ?? "操作成功",
				type: "success",
			});
			getList();
		})
		.catch(() => {});
}

async function getList() {
	const res = await getLevelList({
		current: currentPage.value,
		...formInline.value,
		...params.value,
	});
	tableData.value = res?.recordList ?? [];
	totalPage.value = res?.count ?? 0;
	if (refTable.value) {
		refTable.value.setScrollTop(0);
	}
}

function handleCurrentChange(val) {
	currentPage.value = val;
	getList();
}

function onClickAdd() {
	title.value = "新增等级";
	initData();
	dialogVisible.value = true;
}

async function onSelectChange(data) {
	initData();
	title.value = "编辑等级";
	const res = await getLevelDetail({ rule_id: data.id });
	detailData.value = res;
	replaceRulesValues(res.rule);
	console.log("---rule----", rules.value);
	dialogVisible.value = true;
}

async function onConfirm() {
	const tips = {
		name: "请输入规则名称",
		grade: "请输入等级",
		type: "请选择规则类型",
		weight: "请输入权重",
		// allOrNot: "请选择规则条件"
	};
	for (const key in tips) {
		if (!detailData.value[key]) {
			ElMessage({
				message: tips[key],
				type: "warning",
			});
			return; // 如果有一个字段未通过验证，则立即返回
		}
	}
	const processedRule = processBeforeUpload();
	await updateLevel({
		...detailData.value,
		rule: {
			...processedRule,
		},
	});
	ElMessage({
		message: "操作成功",
		type: "success",
	});
	dialogVisible.value = false;
	getList();
}

function initData() {
	rules.value = {
		itemId: { value: "" },
		tag: { value: [] },
		itemSku: { value: "" },
		categoryId: { value: "" },
		status: { value: "" },
		createTime: {
			startTime: "",
			endTime: "",
		},
		price: {
			minPrice: undefined,
			maxPrice: undefined,
		},
		salesVolume: {
			startTime: "",
			endTime: "",
			minValue: undefined,
			maxValue: undefined,
		},
		salesVolume7days: {
			minValue: undefined,
			maxValue: undefined,
		},
		salesVolume30days: {
			minValue: undefined,
			maxValue: undefined,
		},
		salesVolume15days: {
			minValue: undefined,
			maxValue: undefined,
		},
		salesVolume3days: {
			minValue: undefined,
			maxValue: undefined,
		},
	};
	detailData.value = {
		allOrNot: true,
		type: "ITEM",
	};
}

// 详情数据处理
async function replaceRulesValues(ruleRequest) {
	for (const key in ruleRequest) {
		if (ruleRequest[key].startTime) {
			rules.value[key].startTime = ruleRequest[key].startTime;
		}
		if (ruleRequest[key].endTime) {
			rules.value[key].endTime = ruleRequest[key].endTime;
		}
		if (ruleRequest[key].minPrice) {
			rules.value[key].minPrice = ruleRequest[key].minPrice;
		}
		if (ruleRequest[key].maxPrice) {
			rules.value[key].maxPrice = ruleRequest[key].maxPrice;
		}
		if (ruleRequest[key].minValue) {
			rules.value[key].minValue = ruleRequest[key].minValue;
		}
		if (ruleRequest[key].maxValue) {
			rules.value[key].maxValue = ruleRequest[key].maxValue;
		}
		const item = ruleRequest[key];
		if (item.value) {
			// 不知道数组类型的下拉选项会是proxy
			rules.value[key].value = await item.value;
		}
	}
}

// 提交数据处理
function processBeforeUpload() {
	const rule = {};
	for (const key in rules.value) {
		const item = rules.value[key];
		let obj = {};

		if (item.value) obj.value = item.value;
		if (item.startTime) obj.startTime = item.startTime;
		if (item.endTime) obj.endTime = item.endTime;
		if (item.minPrice) obj.minPrice = item.minPrice;
		if (item.maxPrice) obj.maxPrice = item.maxPrice;
		if (item.minValue) obj.minValue = item.minValue;
		if (item.maxValue) obj.maxValue = item.maxValue;

		if (
			(detailData.value.type === "ITEM" && ["itemSku"].includes(key)) ||
			(detailData.value.type === "PHOTO" &&
				["itemId", "categoryId", "status", "price"].includes(key))
		) {
			continue;
		}
		if (Object.keys(obj).length != 0) {
			rule[key] = obj;
		}
	}
	return rule;
}

async function init() {
	getList();
	categorySelectData.value = await getCategorySelect();
	statusSelectData.value = await getStatusSelect();
	tagsForItem.value = await getProductTagSelect();
	tagsForPhoto.value = await getPhotoTagSelect();
	tagTypeList.value = await getTagTypeSelect();
}
init();
</script>
<style scoped lang="scss">
.levelList {
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
	.rule-item {
		display: flex;
	}
	.gutter-right {
		margin-right: 30px !important;
	}
	.dialogContent {
		height: 500px;
		overflow-y: scroll;
	}
	:deep(.el-input) {
		width: 190px;
	}
}
</style>
