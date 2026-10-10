<template>
  <!-- 流光边框容器 -->
  <div class="border-box" :class="{ 'border-box--active': active }">
    <!-- 四角装饰 -->
    <svg class="border-box__corner" viewBox="0 0 100 100" preserveAspectRatio="none">
      <!-- 左上角 -->
      <polyline points="0,20 0,0 20,0" fill="none" :stroke="color" stroke-width="2" />
      <!-- 右上角 -->
      <polyline points="80,0 100,0 100,20" fill="none" :stroke="color" stroke-width="2" />
      <!-- 左下角 -->
      <polyline points="0,80 0,100 20,100" fill="none" :stroke="color" stroke-width="2" />
      <!-- 右下角 -->
      <polyline points="80,100 100,100 100,80" fill="none" :stroke="color" stroke-width="2" />
    </svg>
    <!-- 内容区域 -->
    <div class="border-box__content">
      <div v-if="title" class="border-box__title">
        <span class="border-box__title-text">{{ title }}</span>
        <span class="border-box__title-line"></span>
      </div>
      <div class="border-box__body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BorderBox - 流光边框容器组件
 * 用于包裹图表等内容，提供科技感边框装饰
 */
withDefaults(defineProps<{
  /** 标题 */
  title?: string
  /** 边框主色 */
  color?: string
  /** 是否激活（显示流光动画） */
  active?: boolean
}>(), {
  color: '#00d4ff',
  active: true
})
</script>

<style scoped lang="scss">
.border-box {
  position: relative;
  width: 100%;
  height: 100%;
  @include card-bg;
  overflow: hidden;
  transition: all $transition-base;

  // 激活状态 - 流光效果
  &--active {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, v-bind(color), transparent);
      animation: border-flow-h 3s linear infinite;
    }
    &::after {
      content: '';
      position: absolute;
      top: -100%;
      right: 0;
      width: 1px;
      height: 100%;
      background: linear-gradient(180deg, transparent, v-bind(color), transparent);
      animation: border-flow-v 3s linear infinite 1.5s;
    }
  }

  &__corner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: $spacing-md;
    z-index: 2;
    box-sizing: border-box;
  }

  &__title {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  }

  &__body {
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow: hidden;
  }

  &__title-text {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $primary;
    @include text-glow;
    white-space: nowrap;
  }

  &__title-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, $border-color, transparent);
  }
}

@keyframes border-flow-h {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes border-flow-v {
  0% { top: -100%; }
  100% { top: 100%; }
}
</style>
