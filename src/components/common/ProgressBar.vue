<template>
  <!-- 进度条 -->
  <div class="progress-bar">
    <div class="progress-bar__header">
      <span class="progress-bar__label">{{ label }}</span>
      <span class="progress-bar__value">{{ displayPercent }}%</span>
    </div>
    <div class="progress-bar__track">
      <div
        class="progress-bar__fill"
        :style="fillStyle"
        :class="{ 'progress-bar__fill--animated': animated }"
      >
        <div class="progress-bar__glow"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ProgressBar - 渐变色进度条组件
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** 标签名 */
  label: string
  /** 百分比值 0-100 */
  percent: number
  /** 进度条颜色（不传则使用默认渐变） */
  color?: string
  /** 是否启用动画 */
  animated?: boolean
}>(), {
  animated: true
})

const displayPercent = computed(() => Math.min(100, Math.max(0, Math.round(props.percent))))

const fillStyle = computed(() => {
  const bg = props.color
    ? `linear-gradient(90deg, ${props.color}, ${props.color}dd)`
    : 'linear-gradient(90deg, #0066ff, #00d4ff)'
  return {
    width: `${displayPercent.value}%`,
    background: bg
  }
})
</script>

<style scoped lang="scss">
.progress-bar {
  width: 100%;
  margin-bottom: $spacing-sm;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-xs;
  }

  &__label {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  &__value {
    font-size: $font-size-sm;
    color: $primary;
    font-family: 'DIN Alternate', monospace;
    font-weight: 600;
  }

  &__track {
    width: 100%;
    height: 8px;
    background: rgba(0, 212, 255, 0.08);
    border-radius: 4px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    border-radius: 4px;
    position: relative;
    transition: width 1s ease-out;

    &--animated {
      animation: progress-grow 1.5s ease-out;
    }
  }

  &__glow {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4));
    animation: glow-move 2s ease-in-out infinite;
  }
}

@keyframes progress-grow {
  from { width: 0; }
}

@keyframes glow-move {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
</style>
