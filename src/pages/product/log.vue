<template>
	<div class="log">
		<el-form label-width="auto">
			<el-form-item label="操作时间">
				<el-date-picker
					v-model="formInline.createTime"
					class="w190"
					placeholder="请选择创建时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					clearable
				/>
			</el-form-item>
			<el-form-item label="操作内容">
				<el-input type="textarea" v-model="formInline.optDesc" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSave">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps(["data"]);
const emits = defineEmits(["save"]);

const formInline = ref({});

watch(
	() => props.data,
	() => {
		if (props?.data?.id) {
			formInline.value = {
				createTime: props?.data?.createTime,
				optDesc: props?.data?.optDesc,
				id: props?.data?.id,
			};
		} else {
			formInline.value = {};
		}
	},
	{
		immediate: true,
		deep: true,
	}
);

function onSave() {
	emits("save", formInline.value);
}
</script>

<style></style>
