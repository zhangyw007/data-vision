<template>
  <!-- 左侧统计面板 -->
  <aside class="left-panel">
    <!-- 统计卡片 -->
    <div class="left-panel__cards">
      <div v-for="(card, index) in statCards" :key="index" class="stat-card">
        <div class="stat-card__title">{{ card.title }}</div>
        <div class="stat-card__value">
          <NumberFlip :value="card.value" :suffix="card.unit" />
        </div>
        <div class="stat-card__trend" :class="`trend--${card.trend}`">
          <span class="trend-arrow">{{ card.trend === 'up' ? '▲' : '▼' }}</span>
          <span>{{ card.trendValue }}%</span>
        </div>
      </div>
    </div>

    <!-- 柱状图 -->
    <BorderBox title="产品销售统计">
      <BarChart
        :x-data="barData.xData.value"
        :series-data="barData.seriesData.value"
        series-name="销售额"
      />
    </BorderBox>

    <!-- 横向柱状图 -->
    <BorderBox title="城市业绩排名">
      <BarHorizontal
        :y-data="barHData.yData.value"
        :series-data="barHData.seriesData.value"
        series-name="业绩"
      />
    </BorderBox>
  </aside>
</template>

<script setup lang="ts">
/**
 * LeftPanel - 左侧统计面板
 * 包含统计卡片、柱状图、横向柱状图
 */
import NumberFlip from '@/components/common/NumberFlip.vue'
import BorderBox from '@/components/common/BorderBox.vue'
import BarChart from '@/components/charts/BarChart.vue'
import BarHorizontal from '@/components/charts/BarHorizontal.vue'
import { useStatCards, useBarData, useBarHorizontalData } from '@/mock/chartData'

const { statCards } = useStatCards()
const barData = useBarData()
const barHData = useBarHorizontalData()
</script>

<style scoped lang="scss">
.left-panel {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr 1fr;
  gap: $spacing-md;
  overflow: hidden;

  &__cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-sm;
  }
}

.stat-card {
  @include card-bg;
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  transition: all $transition-fast;

  &:hover {
    background: $bg-card-hover;
    border-color: $border-glow;
  }

  &__title {
    font-size: $font-size-xs;
    color: $text-muted;
  }

  &__value {
    font-size: $font-size-xl;
  }

  &__trend {
    font-size: $font-size-xs;
    display: flex;
    align-items: center;
    gap: 2px;

    &.trend--up { color: $success; }
    &.trend--down { color: $danger; }
  }
}
</style>
