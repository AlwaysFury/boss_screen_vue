<template>
  <div class="layout">
    <Aside />
    <div class="main">
      <div class="header">

      </div>
      <div class="breadcrumb">
        {{route.meta.title}}
      </div>
      <router-view class='content' />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import Aside from './Aside.vue';

const route = useRoute();
</script>

<style lang='scss' scoped>
.layout {
  width: 100vw;
  height: 100%vh;
  overflow: hidden;
  display: flex;
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    .header {
      width: 100%;
      height: 60px;
      background-color: #fff;
      box-shadow: 0px 6px 10px 0px rgba(78, 89, 105, 0.06);
      z-index: 1;
    }
    .breadcrumb {
      padding: 20px 20px 0;
    }
    .content {
      flex: 1;
      margin: 20px;
      background-color: #fff;
      padding: 20px;
    }
  }
}
</style>