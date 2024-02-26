<template>
  <div class="w-full h-[100vh] bg-[#fdf8ee] flex items-center justify-center">
    <img src="@/assets/images/riding.svg" class="logo-left" alt="">
    <div class="login-right">
      <img src="/public/ye.svg" class="w-[48px]" alt="">
        <el-input class="mt-[24px]" placeholder="请输入账号" />
        <el-input class="mt-[24px]" placeholder="请输入密码" type="password" />
        <el-button :type="isSingUp?'primary':'primary'" class="w-full mt-[24px]">{{isSingUp?'注册':'登录'}}</el-button>
        <span class="text-[var(--primary)] self-end mt-[12px] cursor-pointer" @click="isSingUp=!isSingUp">{{isSingUp?'返回登录':'去注册'}}</span>
    </div>
  </div>
</template>

<script setup>
const isSingUp = ref(false)
</script>

<style lang='scss' scoped>
@media screen and (max-width: 768px) {
  .logo-left {
    display: none;
  }
}

.logo-left {
  max-width: 500px;
  margin-right: 100px;
}
.login-right{
  min-width: 300px;
  min-height: 300px;
  display: flex;
  flex-flow: column nowrap;
  padding: 24px;
  align-items: center;
  justify-content: center;
  background: #7a4c0180;
  box-shadow: 1px 1px 6px 0 #bfbfbf4d;
  border-radius: 10px;
  // transition:all .5s;
  :deep(.el-input__wrapper){
    background-color: #f8f8f8;
  }
}
</style>