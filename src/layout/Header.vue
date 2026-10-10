<template>
  <!-- 顶部标题栏 -->
  <header class="dashboard-header">
    <div class="dashboard-header__left">
      <span class="dashboard-header__date">{{ currentDate }}</span>
    </div>
    <div class="dashboard-header__center">
      <h1 class="dashboard-header__title">企业数据可视化大屏</h1>
      <div class="dashboard-header__decoration">
        <span class="decoration-line"></span>
        <span class="decoration-diamond"></span>
        <span class="decoration-line"></span>
      </div>
    </div>
    <div class="dashboard-header__right">
      <span class="dashboard-header__time">{{ currentTime }}</span>
      <button class="dashboard-header__toggle" @click="toggleAnimation" :title="animationEnabled ? '关闭动画' : '开启动画'">
        {{ animationEnabled ? '◉' : '○' }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Header - 顶部标题栏
 * 包含日期、标题、时间、动画开关
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAnimationControl } from '@/utils/animation'

const { animationEnabled, toggleAnimation } = useAnimationControl()

const currentDate = ref('')
const currentTime = ref('')
let timer: ReturnType<typeof setInterval> | null = null

function updateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentDate.value = `${year}-${month}-${day} ${weekDays[now.getDay()]}`

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.dashboard-header {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-xl;
  position: relative;
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.08) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);

  &__left,
  &__right {
    width: 250px;
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__right {
    justify-content: flex-end;
  }

  &__center {
    flex: 1;
    @include flex-center;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 6px;
    @include gradient-text;
    @include text-glow;
  }

  &__decoration {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__date {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  &__time {
    font-size: $font-size-lg;
    color: $primary;
    font-family: 'DIN Alternate', monospace;
    font-weight: 600;
    @include text-glow;
  }

  &__toggle {
    background: none;
    border: 1px solid $border-color;
    color: $primary;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    transition: all $transition-fast;
    @include flex-center;

    &:hover {
      border-color: $primary;
      box-shadow: $shadow-glow;
    }
  }
}

.decoration-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, $primary, transparent);
}

.decoration-diamond {
  width: 8px;
  height: 8px;
  background: $primary;
  transform: rotate(45deg);
  box-shadow: 0 0 8px $primary;
}
</style>
