<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <!-- Logo 区域 -->
    <div class="sidebar__logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <transition name="fade">
        <span v-if="!collapsed" class="logo-text">DataVision</span>
      </transition>
    </div>

    <!-- 导航菜单 -->
    <nav class="sidebar__nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'nav-item--active': isActive(item.path) }"
      >
        <div class="nav-item__icon">
          <component :is="getIcon(item.icon)" />
          <div class="nav-item__glow" v-if="isActive(item.path)"></div>
        </div>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-item__text">{{ item.title }}</span>
        </transition>
        <transition name="fade">
          <span v-if="!collapsed && item.badge" class="nav-item__badge">{{ item.badge }}</span>
        </transition>
      </router-link>
    </nav>

    <!-- 底部折叠按钮 -->
    <div class="sidebar__footer">
      <button class="collapse-btn" @click="toggleCollapse">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="!collapsed" d="M15 18l-6-6 6-6" />
          <path v-else d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>

    <!-- 装饰光效 -->
    <div class="sidebar__glow"></div>
  </aside>
</template>

<script setup lang="ts">
/**
 * Sidebar - 侧边栏导航组件
 * 支持折叠/展开，带有炫酷的动效
 */
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// 定义图标组件（使用内联 SVG）
const DashboardIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>`
}

const AnalyticsIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 3v18h18" />
    <path d="M7 14l4-4 4 4 5-5" />
  </svg>`
}

const MonitorIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M6 10h2M10 10h2M14 10h2" />
  </svg>`
}

const ReportsIcon = {
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>`
}

const iconMap: Record<string, any> = {
  dashboard: DashboardIcon,
  analytics: AnalyticsIcon,
  monitor: MonitorIcon,
  reports: ReportsIcon
}

const getIcon = (iconName: string) => iconMap[iconName] || DashboardIcon

const route = useRoute()
const collapsed = ref(false)

// 菜单项配置
const menuItems = computed(() => [
  {
    path: '/dashboard',
    title: '数据总览',
    icon: 'dashboard',
    badge: null
  },
  {
    path: '/analytics',
    title: '数据分析',
    icon: 'analytics',
    badge: null
  },
  {
    path: '/monitor',
    title: '系统监控',
    icon: 'monitor',
    badge: '3'
  },
  {
    path: '/reports',
    title: '数据报表',
    icon: 'reports',
    badge: null
  }
])

const isActive = (path: string) => {
  return route.path === path
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

// 暴露折叠状态供父组件使用
defineExpose({ collapsed })
</script>

<style scoped lang="scss">
.sidebar {
  width: 240px;
  height: 100%;
  background: linear-gradient(180deg, $bg-darker 0%, $bg-dark 100%);
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  transition: width $transition-base cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &--collapsed {
    width: 72px;
  }

  &__logo {
    height: 70px;
    display: flex;
    align-items: center;
    padding: 0 $spacing-lg;
    gap: $spacing-md;
    border-bottom: 1px solid $border-color;
    overflow: hidden;
  }

  &__nav {
    flex: 1;
    padding: $spacing-lg 0;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: $border-color;
      border-radius: 2px;
    }
  }

  &__footer {
    padding: $spacing-md;
    border-top: 1px solid $border-color;
  }

  &__glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: radial-gradient(ellipse at top, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
}

.logo-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  color: $primary;
  transition: transform $transition-base;

  svg {
    width: 100%;
    height: 100%;
  }
}

.sidebar:hover .logo-icon {
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
  white-space: nowrap;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: $spacing-md $spacing-lg;
  margin: $spacing-xs $spacing-md;
  border-radius: $radius-md;
  color: $text-secondary;
  text-decoration: none;
  transition: all $transition-base;
  position: relative;
  overflow: hidden;
  gap: $spacing-md;

  &:hover {
    background: rgba(0, 212, 255, 0.08);
    color: $text-primary;
    transform: translateX(4px);

    .nav-item__icon {
      color: $primary;
    }
  }

  &--active {
    background: rgba(0, 212, 255, 0.15);
    color: $primary;

    .nav-item__icon {
      color: $primary;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: $primary;
      border-radius: 0 2px 2px 0;
    }
  }

  &__icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    position: relative;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__glow {
    position: absolute;
    inset: -4px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 70%);
    filter: blur(4px);
    opacity: 0;
    transition: opacity $transition-base;
  }

  &--active &__glow {
    opacity: 1;
    animation: glow 2s ease-in-out infinite;
  }

  &__text {
    font-size: $font-size-base;
    white-space: nowrap;
    flex: 1;
  }

  &__badge {
    background: $danger;
    color: white;
    font-size: $font-size-xs;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }
}

.collapse-btn {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    background: rgba(0, 212, 255, 0.08);
    color: $primary;
    border-color: $primary;
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

// 动画
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式
@media (max-width: 1024px) {
  .sidebar {
    width: 72px;

    .logo-text,
    .nav-item__text,
    .nav-item__badge {
      display: none;
    }
  }
}
</style>
