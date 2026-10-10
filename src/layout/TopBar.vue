<template>
  <header class="topbar">
    <!-- 左侧：面包屑和页面标题 -->
    <div class="topbar__left">
      <div class="breadcrumb">
        <span class="breadcrumb__item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          首页
        </span>
        <span class="breadcrumb__separator">/</span>
        <span class="breadcrumb__item breadcrumb__item--active">
          {{ currentTitle }}
        </span>
      </div>
    </div>

    <!-- 右侧：工具栏 -->
    <div class="topbar__right">
      <!-- 搜索框 -->
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input type="text" placeholder="搜索功能..." />
      </div>

      <!-- 全屏按钮 -->
      <button class="tool-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
        <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
      </button>

      <!-- 通知按钮 -->
      <div class="notification-wrapper">
        <button class="tool-btn" @click="toggleNotification">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span class="notification-badge" v-if="notifications.length">
            {{ notifications.length }}
          </span>
        </button>

        <!-- 通知面板 -->
        <transition name="dropdown">
          <div v-if="showNotification" class="notification-panel">
            <div class="notification-panel__header">
              <h4>通知消息</h4>
              <span class="notification-count">{{ notifications.length }} 条未读</span>
            </div>
            <div class="notification-panel__body">
              <div
                v-for="(item, index) in notifications"
                :key="index"
                class="notification-item"
              >
                <div class="notification-item__icon" :class="`notification-item__icon--${item.type}`">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" v-if="item.type === 'info'" />
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" v-if="item.type === 'warning'" />
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" v-if="item.type === 'success'" />
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" v-if="item.type === 'success'" />
                  </svg>
                </div>
                <div class="notification-item__content">
                  <div class="notification-item__title">{{ item.title }}</div>
                  <div class="notification-item__desc">{{ item.description }}</div>
                  <div class="notification-item__time">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 主题切换 -->
      <button class="tool-btn" @click="toggleTheme" title="主题切换">
        <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <!-- 用户信息 -->
      <div class="user-menu">
        <div class="user-avatar">
          <span>管</span>
          <div class="user-avatar__status"></div>
        </div>
        <div class="user-info">
          <div class="user-info__name">管理员</div>
          <div class="user-info__role">超级管理员</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * TopBar - 顶部工具栏组件
 * 包含面包屑、搜索、通知、主题切换等功能
 */
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isFullscreen = ref(false)
const showNotification = ref(false)
const isDark = ref(true)

const currentTitle = computed(() => {
  return (route.meta.title as string) || '数据总览'
})

// 模拟通知数据
const notifications = ref([
  {
    type: 'warning',
    title: '系统告警',
    description: 'CPU 使用率超过 85%',
    time: '2 分钟前'
  },
  {
    type: 'success',
    title: '数据同步完成',
    description: '已成功同步 1,234 条数据',
    time: '10 分钟前'
  },
  {
    type: 'info',
    title: '系统更新',
    description: '新版本 v2.0 已发布',
    time: '1 小时前'
  }
])

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const toggleNotification = () => {
  showNotification.value = !showNotification.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  // 这里可以添加主题切换逻辑
}
</script>

<style scoped lang="scss">
.topbar {
  height: 70px;
  background: rgba(6, 25, 55, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-xl;
  position: relative;

  &__left {
    display: flex;
    align-items: center;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-base;

  &__item {
    color: $text-secondary;
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    svg {
      width: 16px;
      height: 16px;
    }

    &--active {
      color: $primary;
    }
  }

  &__separator {
    color: $text-muted;
  }
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid $border-color;
  border-radius: 20px;
  padding: $spacing-sm $spacing-md;
  gap: $spacing-sm;
  transition: all $transition-base;

  &:focus-within {
    border-color: $primary;
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.1);
  }

  svg {
    width: 16px;
    height: 16px;
    color: $text-muted;
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: $text-primary;
    font-size: $font-size-sm;
    width: 120px;

    &::placeholder {
      color: $text-muted;
    }
  }
}

.tool-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: $radius-md;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition-base;
  position: relative;

  &:hover {
    background: rgba(0, 212, 255, 0.08);
    color: $primary;
    border-color: $border-color;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.notification-wrapper {
  position: relative;
  z-index: 1000;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: $danger;
  color: white;
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  animation: pulse 2s ease-in-out infinite;
}

.notification-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 340px;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
  z-index: 1000;
  overflow: hidden;

  &__header {
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h4 {
      margin: 0;
      color: $text-primary;
      font-size: $font-size-base;
    }

    .notification-count {
      font-size: $font-size-xs;
      color: $primary;
    }
  }

  &__body {
    max-height: 300px;
    overflow-y: auto;
  }
}

.notification-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  transition: background $transition-base;

  &:hover {
    background: rgba(0, 212, 255, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 18px;
      height: 18px;
    }

    &--info {
      background: rgba(0, 212, 255, 0.15);
      color: $primary;
    }

    &--warning {
      background: rgba(255, 170, 0, 0.15);
      color: $warning;
    }

    &--success {
      background: rgba(46, 213, 115, 0.15);
      color: $success;
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: $font-size-sm;
    color: $text-primary;
    margin-bottom: 4px;
  }

  &__desc {
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__time {
    font-size: $font-size-xs;
    color: $text-muted;
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    background: rgba(0, 212, 255, 0.08);
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $gradient-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  position: relative;

  &__status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $success;
    border: 2px solid $bg-dark;
  }
}

.user-info {
  &__name {
    font-size: $font-size-sm;
    color: $text-primary;
    font-weight: 500;
  }

  &__role {
    font-size: $font-size-xs;
    color: $text-muted;
  }
}

// 动画
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all $transition-base;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// 响应式
@media (max-width: 1280px) {
  .search-box {
    display: none;
  }

  .user-info {
    display: none;
  }
}
</style>
