<template>
  <el-dialog v-model="showDialog"
    title="新增标签">
    <el-form :model="tagDialogData"
      label-width="100">
      <el-form-item label="类型">
        <el-radio-group v-model="tagDialogData.type">
          <el-radio value="1">列表选择</el-radio>
          <el-radio value="2">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="tagDialogData.tag"
          clearable
          v-if="tagDialogData.type == 1">
          <el-option v-for="item in tagData"
            :label="item.value"
            :value="item.key"
            :key="item.key" />
        </el-select>
        <el-input v-else
          v-model="tagDialogData.customTag"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-action">
        <el-button type="primary"
          @click="onConfirmTag">确认</el-button>
        <el-button @click="onCancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { watch, ref } from "vue"
import { getProductTagSelect, getPhotoTagSelect } from "@/network/selectApi"
const props = defineProps(['showTagDialog', 'type'])
const emits = defineEmits('confirm', 'close')

const tagDialogData = ref({})
const tagData = ref([])
const showDialog = ref(false)

watch(() => props.showTagDialog, () => {
  showDialog.value = props.showTagDialog
  if (props.showTagDialog) {
    tagDialogData.value = {
      type: "1"
    }
  }
})

async function init() {
  if (props.type) {
    const fn = props.type == 'photo' ? getPhotoTagSelect : getProductTagSelect
    tagData.value = await fn();
  }
}

function onConfirmTag() {
  const target = tagData.value.find(item => item.key == tagDialogData.value.tag)
  emits("confirm", { ...tagDialogData.value, tagName: target.value })
}

function onCancel() {
  emits("close")
}

init()
</script>
<style scoped>
</style>