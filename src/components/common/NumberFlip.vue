<template>
  <!-- 数字翻牌器 -->
  <span class="number-flip">
    <span class="number-flip__prefix" v-if="prefix">{{ prefix }}</span>
    <span class="number-flip__value" ref="displayValue">{{ formattedValue }}</span>
    <span class="number-flip__suffix" v-if="suffix">{{ suffix }}</span>
  </span>
</template>

<script setup lang="ts">
/**
 * NumberFlip - 数字翻牌器组件
 * 带数字滚动动画，支持前后缀
 */
import { computed } from 'vue'
import { useNumberAnimation } from '@/composables/useNumberAnimation'
import { formatNumber } from '@/utils/mock'

const props = withDefaults(defineProps<{
  /** 目标数值 */
  value: number
  /** 动画时长（ms） */
  duration?: number
  /** 前缀 */
  prefix?: string
  /** 后缀 */
  suffix?: string
  /** 是否格式化千分位 */
  format?: boolean
}>(), {
  duration: 1500,
  format: true
})

const target = computed(() => props.value)
const { currentValue } = useNumberAnimation(target, props.duration)

const formattedValue = computed(() => {
  return props.format
    ? formatNumber(currentValue.value)
    : String(currentValue.value)
})
</script>

<style scoped lang="scss">
.number-flip {
  display: inline-flex;
  align-items: baseline;
  font-family: 'DIN Alternate', 'Oswald', 'Roboto Mono', monospace;

  &__prefix,
  &__suffix {
    font-size: 0.7em;
    color: $text-secondary;
    margin: 0 2px;
  }

  &__value {
    color: $primary;
    @include text-glow;
    font-weight: 700;
    transition: all 0.1s;
  }
}
</style>
