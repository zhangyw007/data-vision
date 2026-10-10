<template>
  <!-- 排名列表 -->
  <div class="rank-list">
    <div
      v-for="(item, index) in displayList"
      :key="item.name"
      class="rank-list__item"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <!-- 排名序号 -->
      <span
        class="rank-list__rank"
        :class="{
          'rank-list__rank--gold': index === 0,
          'rank-list__rank--silver': index === 1,
          'rank-list__rank--bronze': index === 2
        }"
      >
        {{ index + 1 }}
      </span>
      <!-- 名称 -->
      <span class="rank-list__name">{{ item.name }}</span>
      <!-- 进度条 -->
      <div class="rank-list__bar">
        <div
          class="rank-list__bar-fill"
          :style="{
            width: `${(item.value / maxValue) * 100}%`,
            background: getBarColor(index)
          }"
        ></div>
      </div>
      <!-- 数值 -->
      <span class="rank-list__value">{{ formatNumber(item.value) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * RankList - 排名列表组件
 * 带序号高亮、进度条、动态排序
 */
import { computed } from 'vue'
import type { RankItem } from '@/types'
import { formatNumber } from '@/utils/mock'

const props = withDefaults(defineProps<{
  /** 排名数据 */
  data: RankItem[]
  /** 显示数量 */
  limit?: number
}>(), {
  limit: 10
})

// 按数值降序排列
const displayList = computed(() => {
  return [...props.data]
    .sort((a, b) => b.value - a.value)
    .slice(0, props.limit)
    .map((item, index) => ({ ...item, rank: index + 1 }))
})

const maxValue = computed(() => {
  if (displayList.value.length === 0) return 1
  return displayList.value[0]?.value || 1
})

/** 根据排名返回进度条颜色 */
function getBarColor(index: number): string {
  const colors = [
    'linear-gradient(90deg, #ff4757, #ff6b81)',  // 红
    'linear-gradient(90deg, #ffaa00, #ffc048)',  // 橙
    'linear-gradient(90deg, #00d4ff, #00e8ff)',  // 蓝
    'linear-gradient(90deg, #0066ff, #0088ff)',  // 深蓝
    'linear-gradient(90deg, #2ed573, #7bed9f)'   // 绿
  ]
  return colors[Math.min(index, colors.length - 1)]
}
</script>

<style scoped lang="scss">
.rank-list {
  width: 100%;

  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-xs $spacing-sm;
    margin-bottom: 2px;
    border-radius: $radius-sm;
    transition: background $transition-fast;
    animation: fadeIn 0.5s ease both;

    &:hover {
      background: rgba(0, 212, 255, 0.05);
    }
  }

  &__rank {
    width: 20px;
    height: 20px;
    @include flex-center;
    font-size: $font-size-xs;
    font-weight: 700;
    border-radius: $radius-sm;
    color: $text-muted;
    background: rgba(0, 212, 255, 0.05);
    flex-shrink: 0;

    &--gold {
      background: linear-gradient(135deg, #ff4757, #ff6b81);
      color: #fff;
      box-shadow: 0 0 8px rgba(255, 71, 87, 0.4);
    }
    &--silver {
      background: linear-gradient(135deg, #ffaa00, #ffc048);
      color: #fff;
      box-shadow: 0 0 8px rgba(255, 170, 0, 0.4);
    }
    &--bronze {
      background: linear-gradient(135deg, #00d4ff, #00e8ff);
      color: #fff;
      box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
    }
  }

  &__name {
    width: 70px;
    font-size: $font-size-sm;
    color: $text-secondary;
    @include text-ellipsis;
    flex-shrink: 0;
  }

  &__bar {
    flex: 1;
    height: 6px;
    background: rgba(0, 212, 255, 0.06);
    border-radius: 3px;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1s ease-out;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
    }
  }

  &__value {
    width: 55px;
    text-align: right;
    font-size: $font-size-sm;
    color: $primary;
    font-family: 'DIN Alternate', monospace;
    font-weight: 600;
    flex-shrink: 0;
  }
}
</style>
