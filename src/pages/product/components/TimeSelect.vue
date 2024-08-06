// 产品表现详细信息
<template>
	<el-dialog
		v-model="showDialog"
		title="刷新时间选择"
		width="500"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:show-close="false"
		center
	>
		<el-form label-width="100">
			<el-form-item label="开始时间" required>
				<el-date-picker
					v-model="startTime"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					placeholder=""
					clearable
					:disabled-date="disabledStartDate"
				/>
			</el-form-item>
			<el-form-item label="结束时间" required>
				<el-date-picker
					v-model="endTime"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					placeholder=""
					clearable
					:disabled-date="disabledEndDate"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-action">
				<el-button type="primary" @click="onConfirm">确认</el-button>
				<el-button @click="onCancel">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";

const props = defineProps(["show"]);
const emits = defineEmits("confirm", "close");

const startTime = ref("");
const endTime = ref("");
const showDialog = ref(false);
const timeFormat = "YYYY-MM-DD HH:mm:ss";

watch(
	() => props.show,
	() => {
		showDialog.value = props.show;
		// if (!startTime.value) {
		//   startTime.value = dayjs().add(-15, 'day').format(timeFormat);
		// }
		// if (!endTime.value) {
		//   endTime.value = dayjs().format(timeFormat);
		// }
	}
);

function disabledStartDate(time) {
	if (endTime.value) {
		const start_time = new Date(
			dayjs(endTime.value).add(-15, "day").format(timeFormat)
		);
		const end_time = new Date(dayjs(endTime.value).format(timeFormat));
		return (
			time.getTime() < start_time.getTime() ||
			time.getTime() > end_time.getTime()
		);
	}
}

function disabledEndDate(time) {
	if (startTime.value) {
		const end_time = new Date(
			dayjs(startTime.value).add(15, "day").format(timeFormat)
		);
		const start_time = new Date(dayjs(startTime.value).format(timeFormat));
		return (
			time.getTime() < start_time.getTime() ||
			time.getTime() > end_time.getTime()
		);
	}
}

function onConfirm() {
	if (!startTime.value) {
		ElMessage({
			message: "请选择开始时间",
			type: "warning",
		});
		return;
	}
	if (!endTime.value) {
		ElMessage({
			message: "请选择结束时间",
			type: "warning",
		});
		return;
	}
	emits("confirm", { startTime: startTime.value, endTime: endTime.value });
}

function onCancel() {
	emits("cancel");
}
</script>

<style scoped></style>
