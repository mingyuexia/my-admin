<template>
  <el-config-provider :locale="locale">
    <Transition>
      <router-view style="min-height: calc(100vh - 120px);" />
    </Transition>
  </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {

    const $route = useRoute()
    return {
      locale: zhCn,
    }
  },
})
</script>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity .2s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

