<template>
	<el-upload
		:action="uploadUrl"
		:on-success="handleSuccess"
		:on-error="handleError"
		:on-preview="handlePreview"
		:on-remove="handleRemove"
		:file-list="fileList"
		:auto-upload="autoUpload"
		:before-upload="beforeUpload"
		multiple
		:limit="maxFiles"
		:on-exceed="handleExceed"
		:accept="acceptedTypes"
		:http-request="handleRequest"
		ref="uploadRef"
	>
		<template #trigger>
			<el-button size="small" type="primary">选取文件</el-button>
		</template>
		<el-button
			style="margin-left: 10px"
			size="small"
			type="success"
			:disabled="uploading"
			@click="submitUpload"
			>上传</el-button
		>
		<template #tip>
			<div class="el-upload__tip">
				只能上传{{ acceptedTypes }}文件，且不超过{{ maxSize }}MB
			</div>
		</template>
	</el-upload>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { importProductTag, importPatternTag } from "@/network/api";

const props = defineProps(["type"]); // type: 'photo' | 'product'

// 文件上传地址
const uploadUrl = "https://your-upload-endpoint.com/upload";

// 文件列表
const fileList = ref([]);

// 是否自动上传
const autoUpload = false;

// 最大上传文件数量
const maxFiles = 1;

// 接受的文件类型
const acceptedTypes = ".xls,.xlsx";

// 最大文件大小 (MB)
const maxSize = 5;

// 引用组件
const uploadRef = ref(null);

const uploading = ref(false);

// 上传成功回调
const handleSuccess = (response, file, fileList) => {};

// 上传失败回调
const handleError = (error, file, fileList) => {
	ElMessage.error("文件上传失败");
};

// 文件预览回调
const handlePreview = (file) => {
	console.log("文件预览", file);
};

// 文件移除回调
const handleRemove = (file, fileList) => {
	fileList.value = fileList;
};

// 文件超出限制回调
const handleExceed = (files, fileList) => {
	ElMessage.warning(`最多允许上传 ${maxFiles} 个文件`);
};

// 上传之前验证文件
const beforeUpload = (file) => {
	const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
	if (!isLtMaxSize) {
		ElMessage.error(`上传文件大小不能超过 ${maxSize}MB!`);
	}
	return isLtMaxSize;
};

// 手动提交上传
const submitUpload = () => {
	// 触发上传
	uploadRef.value.submit();
};

// 自定义 HTTP 请求处理
const handleRequest = async (params) => {
	if (!params.file) {
		return;
	}
	const formData = new FormData();
	params.file && formData.append("file", params.file);
	const fn = props.type === "photo" ? importPatternTag : importProductTag;
	uploading.value = true;
	try {
		await fn(formData);
		ElMessage.success("上传成功");
		fileList.value = [];
	} catch (error) {
		console.error(error);
	} finally {
		uploading.value = false;
	}
};
</script>

<style scoped>
/* 样式可以根据需要进行调整 */
</style>
