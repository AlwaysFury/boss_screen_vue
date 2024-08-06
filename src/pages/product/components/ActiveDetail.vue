// 活动表现详细信息
<template>
	<div>
		<el-table :data="data" stripe style="width: 100%">
			<el-table-column prop="modelId" label="规格id" />
			<el-table-column prop="mainName" label="母活动" />
			<el-table-column prop="subName" label="子活动" />
			<el-table-column prop="price" label="活动价格" />
			<el-table-column prop="date" label="活动时间" />
		</el-table>
	</div>
</template>

<script setup>
// eslint-disable-next-line no-undef
const props = defineProps(["data"]);
</script>

<style scoped></style>
