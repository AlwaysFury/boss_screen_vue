<template>
	<div class="logList">
		<div class="search">
			<el-form
				:inline="true"
				:model="formInline"
				class="demo-form-inline"
				label-width="auto"
			>
				<el-form-item label="日志类型">
					<el-select v-model="formInline.opt_type" class="w190" clearable>
						<el-option label="系统日志" value="系统日志" />
						<el-option label="用户日志" value="用户日志" />
					</el-select>
				</el-form-item>
				<el-form-item label="日志内容">
					<el-input v-model="formInline.opt_desc" class="w190" />
				</el-form-item>
				<el-form-item label="开始时间">
					<el-date-picker
						v-model="formInline.start_time"
						class="w190"
						type="datetime"
						value-format="YYYY-MM-DD HH:mm:ss"
						placeholder="请选择开始时间"
						clearable
					/>
				</el-form-item>
				<el-form-item label="结束时间">
					<el-date-picker
						v-model="formInline.end_time"
						class="w190"
						type="datetime"
						value-format="YYYY-MM-DD HH:mm:ss"
						placeholder="请选择结束时间"
						clearable
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onQuery">查询</el-button>
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="list_wrap">
			<el-checkbox-group v-model="checkList" v-if="logList.length">
				<el-timeline>
					<el-timeline-item
						placement="top"
						v-for="item in logList"
						:key="item.id"
						:timestamp="item.createTime"
						class="time-item"
					>
						<div class="flex">
							<el-checkbox label="" :value="item.id" />
							<el-card class="flex_right" @click="showDetail(item)">
								<h4 class="title">
									{{ item.optType }}
								</h4>
								<!-- <el-icon :size="20"
                  color="#F56C6C"
                  @click.stop.prevent="onDeleteLog(item)">
                  <Delete />
                </el-icon> -->
								<p v-if="item.optDesc">{{ item.optDesc }}</p>
							</el-card>
						</div>
					</el-timeline-item>
				</el-timeline>
			</el-checkbox-group>
			<el-empty v-else description="无数据" />
		</div>
		<div class="action">
			<div class="left">
				<el-button type="primary" @click="onClickAdd">新增</el-button>
				<el-button
					type="default"
					@click="onDelete"
					:disabled="checkList.length == 0"
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
		<el-dialog v-model="dialogVisible" :title="title" width="700" center>
			<Log :data="detailData" @save="onSaveData" />
		</el-dialog>
	</div>
</template>

<script setup>
import { ref } from "vue";
import Log from "./log.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
	getLogList,
	updateLogInfo,
	getLogDetail,
	deleteLogInfo,
} from "@/network/api";

const logList = ref([]);
const currentPage = ref(1);
const totalPage = ref(30);
const title = ref("新增日志");
const dialogVisible = ref(false);
const detailData = ref({});
const formInline = ref({});
const params = ref({
	size: 10,
});

const checkList = ref([]);

function onClickAdd() {
	title.value = "新增日志";
	detailData.value = {};
	dialogVisible.value = true;
}

async function showDetail(value) {
	title.value = "修改日志";
	detailData.value = await getLogDetail({ log_id: value.id });
	dialogVisible.value = true;
}

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
	const res = await getLogList({
		current: currentPage.value,
		...formInline.value,
		...params.value,
	});
	logList.value = res?.recordList ?? [];
	totalPage.value = res?.count ?? 0;
	checkList.value = [];
}

async function onSaveData(data) {
	if (data.optType && data.optType.indexOf("系统") != -1) {
		ElMessage({
			message: "系统日志不允许修改",
			type: "warning",
		});
		return;
	}
	const res = await updateLogInfo(data);
	ElMessage({
		message: res?.message ?? "操作成功",
		type: "success",
	});
	detailData.value = {};
	dialogVisible.value = false;
	getList();
}

async function onDelete() {
	console.log("-----", checkList.value);
	ElMessageBox.confirm("确认删除选中日志?", "提示")
		.then(async () => {
			await deleteLogInfo({ idList: checkList.value });
			ElMessage({
				message: "操作成功",
				type: "success",
			});
			getList();
		})
		.catch(() => {});
}

getList();
</script>

<<<<<<< HEAD
<style scoped lang="scss">
.logList {
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.action {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}
	.list_wrap {
		flex: 1;
		margin-right: 10px;
		background-color: #fff;
		overflow: auto;
	}
	.w190 {
		width: 190px;
	}
	.time-item {
		cursor: pointer;
	}
	.flex {
		display: flex;
		align-items: flex-start;
	}
	.flex_right {
		flex: 1;
		margin-right: 10px;
		.title {
			font-size: 16px;
			margin: 0;
			line-height: 22px;
		}
	}
}
</style>
=======
<style scoped lang="scss">
.logList {
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.content {
		flex: 1;
		padding: 10px 30px 0 0;
		overflow: auto;
		.title {
			display: flex;
			align-items: center;
			h4 {
				margin: 0 20px 0 0;
			}
		}
	}
	.action {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}
	.w190 {
		width: 190px;
	}
	.time-item {
		cursor: pointer;
	}
}
</style>
>>>>>>> d212d9e1eb6b8a410a636f42203376b48577c6cf
