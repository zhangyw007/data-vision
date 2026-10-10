<template>
  <div id="data-show" class="data-show-root">
    <!-- 背景装饰层 -->
    <div class="grid-bg"></div>
    <div class="glow-bg"></div>
    <div class="scan-line" v-if="animationEnabled"></div>

    <!-- 加载动画 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <!-- 主内容 -->
    <DashboardLayout v-show="!loading" />
  </div>
</template>

<script setup lang="ts">
/**
 * App.vue - 根组件
 * 提供背景装饰、加载动画、全局动画控制
 */
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import { provideAnimationControl } from '@/utils/animation'

// 提供全局动画开关
const { animationEnabled } = provideAnimationControl()

const loading = ref(true)

onMounted(() => {
  // 模拟加载延迟，展示加载动画
  setTimeout(() => {
    loading.value = false
  }, 1500)
})
</script>

<style scoped lang="scss">
.data-show-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-dark;
  position: relative;
}
</style>
