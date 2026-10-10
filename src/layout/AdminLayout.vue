<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <Sidebar ref="sidebarRef" />

    <!-- 主内容区域 -->
    <div class="admin-layout__main">
      <!-- 顶部工具栏 -->
      <TopBar />

      <!-- 页面内容区域 -->
      <main class="admin-layout__content">
        <!-- 背景装饰 -->
        <div class="content-bg">
          <div class="grid-pattern"></div>
          <div class="glow-effect"></div>
        </div>

        <!-- 路由视图，带过渡动画 -->
        <router-view v-slot="{ Component, route }">
          <transition
            :name="transitionName"
            @enter="onEnter"
            @after-enter="onAfterEnter"
          >
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * AdminLayout - 后台管理主布局
 * 包含侧边栏、顶部工具栏和主内容区域
 */
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'

const route = useRoute()
const sidebarRef = ref<InstanceType<typeof Sidebar> | null>(null)
const transitionName = ref('slide-fade')

// 缓存的视图
const cachedViews = ['Dashboard', 'Analytics', 'Monitor', 'Reports']

// 根据路由决定过渡动画方向
watch(
  () => route.path,
  (to, from) => {
    const routes = ['/dashboard', '/analytics', '/monitor', '/reports']
    const toIndex = routes.indexOf(to)
    const fromIndex = routes.indexOf(from)
    transitionName.value = toIndex > fromIndex ? 'slide-left' : 'slide-right'
  }
)

const onEnter = (el: Element) => {
  // 过渡进入
}

const onAfterEnter = (el: Element) => {
  // 过渡完成后的回调
}
</script>

<style scoped lang="scss">
.admin-layout {
  width: 100%;
  height: 100%;
  display: flex;
  background: $bg-dark;
  overflow: hidden;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    height: 100%;
  }

  &__content {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
  }
}

.content-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  .glow-effect {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(0, 212, 255, 0.05) 0%,
      transparent 50%
    );
  }
}

.transition-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 25, 41, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.transition-spinner {
  width: 60px;
  height: 60px;
  position: relative;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 3px solid transparent;
    border-top-color: $secondary;
    border-radius: 50%;
    animation: spin 2s linear infinite reverse;
  }
}

// 页面过渡动画
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式
@media (max-width: 1024px) {
  .admin-layout {
    flex-direction: column;
  }
}
</style>
