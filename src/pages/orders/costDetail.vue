<template>
	<div class="costDetail">
		<el-form label-width="100" ref="formRef" :model="formInline" :rules="rules">
			<!-- <el-form-item label="产品名称">
        <el-input v-model="formInline.name" />
      </el-form-item> -->
			<el-form-item label="成本" prop="price">
				<el-input-number v-model="formInline.price" :min="0" />
			</el-form-item>
			<el-form-item label="汇率" prop="exchangeRate">
				<el-input-number
					v-model="formInline.exchangeRate"
					:precision="2"
					:step="0.1"
					:min="0"
				/>
			</el-form-item>
			<el-form-item label="衣服种类" prop="type">
				<el-select v-model="formInline.type" class="w190" clearable>
					<el-option
						v-for="item in costSelectData"
						:label="item.key"
						:value="item.key"
						:key="item.key"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="开始时间" prop="startTime">
				<el-date-picker
					v-model="formInline.startTime"
					class="w190"
					placeholder="请选择开始时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					clearable
				/>
			</el-form-item>
			<el-form-item label="结束时间" prop="endTime">
				<el-date-picker
					v-model="formInline.endTime"
					class="w190"
					placeholder="请选择结束时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					clearable
				/>
			</el-form-item>
		</el-form>
		<div class="action">
			<el-button type="primary" @click="onSave">保存</el-button>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps(["data", "costSelectData"]);
const emits = defineEmits(["save"]);

const formInline = ref({});
const formRef = ref(null);

const rules = {
	price: [{ required: true, message: "请输入成本", trigger: "blur" }],
	exchangeRate: [{ required: true, message: "请输入汇率", trigger: "blur" }],
	startTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
	endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
	type: [{ required: true, message: "请选择衣服种类", trigger: "blur" }],
};

watch(
	() => props.data,
	() => {
		if (props?.data?.id) {
			formInline.value = {
				name: props?.data?.name,
				price: props?.data?.price,
				id: props?.data?.id,
				type: props?.data?.type,
				startTime: props?.data?.startTime,
				endTime: props?.data?.endTime,
				exchangeRate: props?.data?.exchangeRate,
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

async function onSave() {
	if (!formRef.value) {
		return;
	}
	await formRef.value.validate();
	if (
		formInline.value.startTime &&
		formInline.value.endTime &&
		new Date(formInline.value.startTime).getTime() >
			new Date(formInline.value.endTime).getTime()
	) {
		ElMessage({
			message: "结束时间不能小于开始时间",
			type: "warning",
		});
		return;
	}
	emits("save", formInline.value);
}
</script>

<style scoped lang="scss">
.action {
	text-align: center;
}
</style>
