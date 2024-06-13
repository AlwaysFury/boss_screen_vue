<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/side-logo.png">
      </div>
      <div class="login-form">
        <div class="login-title">
          <img class="icon"
            src="@/assets/logo.png"
            alt="logo" />
          <h2 class="title">Vue-Admin-Perfect</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from "./components/LoginForm.vue";
</script>
<style lang="scss" scoped>
@import "./index";
</style>
