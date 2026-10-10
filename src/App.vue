<template>
  <div id="data-show" class="data-show-root">
    <!-- 背景装饰层 -->
    <div class="grid-bg"></div>
    <div class="glow-bg"></div>
    <div class="scan-line" v-if="animationEnabled"></div>

    <!-- 加载动画 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>

    <!-- 主内容 -->
    <AdminLayout v-show="!loading" />
  </div>
</template>

<script setup lang="ts">
/**
 * App.vue - 根组件
 * 提供背景装饰、加载动画、全局动画控制
 * 集成路由系统，使用后台管理布局
 */
import { ref, onMounted } from 'vue'
import AdminLayout from '@/layout/AdminLayout.vue'
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

.loading-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-lg;
  z-index: 9999;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(0, 212, 255, 0.1);
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: $font-size-lg;
  color: $text-secondary;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
