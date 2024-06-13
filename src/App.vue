<template>
  <router-view class="main"></router-view>
</template>

<script setup>
// 解决Element-plus，table页面重置错误，ResizeObserver loop completed with undelivered notifications.
window.ResizeObserver = class ResizeObserver extends window.ResizeObserver {
  constructor(callback) {
    let timer = null;
    const debouncedCallback = function () {
      let context = this;
      let args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, 16)
    };
    super(debouncedCallback)
  }
}
</script>

<style lang='scss'>
body {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
* {
  box-sizing: border-box;
}
.main {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f2f5;
}
.el-input {
  // 固定宽度
  width: 190px !important;
}
.w190 {
  width: 190px !important;
}
</style>
