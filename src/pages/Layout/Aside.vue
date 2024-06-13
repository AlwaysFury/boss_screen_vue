<template>
  <div class="Aside"
    :class="{'fold': !expand}">
    <div class="top">
      <span class="title"
        v-show="expand">Shopee</span>
      <Fold class="btn-icon"
        v-if="expand"
        @click="onClickBtn" />
      <Expand class="btn-icon"
        v-else
        @click="onClickBtn" />
    </div>
    <div class="menu-box">
      <el-menu :default-active="activeMenu"
        class="el-menu-vertical-demo"
        :collapse="!expand"
        :router='true'>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <Monitor />
            </el-icon>
            <span>店铺</span>
          </template>
          <el-menu-item index="/shop">店铺列表</el-menu-item>
          <el-menu-item index="/account">账号列表</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <CreditCard />
            </el-icon>
            <span>产品</span>
          </template>
          <el-menu-item index="/product">产品列表</el-menu-item>
          <el-menu-item index="/rule">等级列表</el-menu-item>
          <el-menu-item index="/logList">日志</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <Tickets />
            </el-icon>
            <span>订单</span>
          </template>
          <el-menu-item index="/order">订单列表</el-menu-item>
          <el-menu-item index="/cost">成本</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';


const expand = ref(true)

const activeMenu = ref("/shop")

function onClickBtn() {
  expand.value = !expand.value;
}

function getCurrentHash() {
  return window.location.hash.slice(1);
}

onMounted(() => {
  const hash = getCurrentHash();
  if (hash) {
    activeMenu.value = hash
  }
})
</script>

<style lang='scss' scoped>
.Aside {
  width: 200px;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .top {
    height: 60px;
    display: flex;
    line-height: 60px;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0px 6px 10px 0px rgba(78, 89, 105, 0.06);
    z-index: 1;
    .btn-icon {
      width: 22px;
      cursor: pointer;
      color: #bbb;
    }
  }
  .menu-box {
    flex: 1;
    overflow-y: visible;
  }
  :deep(.el-menu) {
    border-right: 0;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
  }
  &.fold {
    width: auto;
  }
}
</style>