<template>
  <!-- 滚动字幕 / 走马灯 -->
  <div class="scroll-text" :class="{ 'scroll-text--paused': paused }">
    <div class="scroll-text__track" :style="trackStyle">
      <div
        v-for="item in displayItems"
        :key="item.id"
        class="scroll-text__item"
        :class="`scroll-text__item--${item.type}`"
      >
        <span class="scroll-text__time" v-if="showTime">{{ item.time }}</span>
        <span class="scroll-text__dot" :class="`dot--${item.type}`"></span>
        <span class="scroll-text__content">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ScrollText - 滚动字幕 / 告警走马灯组件
 * 支持垂直滚动和水平走马灯两种模式
 */
import { computed, ref } from 'vue'
import type { AlertMessage } from '@/types'

const props = withDefaults(defineProps<{
  /** 消息列表 */
  messages: AlertMessage[]
  /** 滚动方向：vertical=垂直，horizontal=水平 */
  direction?: 'vertical' | 'horizontal'
  /** 滚动速度（秒） */
  speed?: number
  /** 是否显示时间 */
  showTime?: boolean
}>(), {
  direction: 'vertical',
  speed: 20,
  showTime: true
})

const paused = ref(false)

// 复制一份数据实现无缝滚动
const displayItems = computed(() => {
  return [...props.messages, ...props.messages]
})

const trackStyle = computed(() => {
  if (props.direction === 'horizontal') {
    return {
      animation: `marquee ${props.speed}s linear infinite`
    }
  }
  return {
    animation: `scroll-vertical ${props.speed * props.messages.length * 0.5}s linear infinite`
  }
})
</script>

<style scoped lang="scss">
.scroll-text {
  width: 100%;
  overflow: hidden;
  position: relative;

  &--paused:hover {
    .scroll-text__track {
      animation-play-state: paused !important;
    }
  }

  &__track {
    display: flex;
    flex-direction: column;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-xs 0;
    font-size: $font-size-sm;
    color: $text-secondary;
    white-space: nowrap;

    &--info .scroll-text__content { color: $text-secondary; }
    &--warning .scroll-text__content { color: $warning; }
    &--danger .scroll-text__content { color: $danger; }
  }

  &__time {
    color: $text-muted;
    font-size: $font-size-xs;
    min-width: 50px;
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;

    &.dot--info { background: $primary; box-shadow: 0 0 6px $primary; }
    &.dot--warning { background: $warning; box-shadow: 0 0 6px $warning; }
    &.dot--danger { background: $danger; box-shadow: 0 0 6px $danger; }
  }

  &__content {
    @include text-ellipsis;
  }
}

@keyframes scroll-vertical {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
</style>
