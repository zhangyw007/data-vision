<template>
  <div class="analytics-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-header__content">
        <h1 class="page-title">
          <span class="title-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18" />
              <path d="M7 14l4-4 4 4 5-5" />
            </svg>
          </span>
          数据分析
        </h1>
        <p class="page-subtitle">深度数据洞察，发现业务趋势与规律</p>
      </div>
      <div class="page-header__actions">
        <select class="select-box" v-model="timeRange">
          <option value="week">近7天</option>
          <option value="month">近30天</option>
          <option value="quarter">近90天</option>
          <option value="year">近1年</option>
        </select>
      </div>
    </div>

    <!-- 分析维度卡片 -->
    <div class="dimension-cards">
      <div
        v-for="(dim, index) in dimensions"
        :key="index"
        class="dimension-card"
        :class="{ 'dimension-card--active': selectedDimension === index }"
        @click="selectedDimension = index"
      >
        <div class="dimension-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <component :is="dim.icon" />
          </svg>
        </div>
        <div class="dimension-card__info">
          <div class="dimension-card__title">{{ dim.title }}</div>
          <div class="dimension-card__value">{{ dim.value }}</div>
        </div>
        <div class="dimension-card__trend" :class="dim.trend > 0 ? 'trend--up' : 'trend--down'">
          {{ dim.trend > 0 ? '+' : '' }}{{ dim.trend }}%
        </div>
      </div>
    </div>

    <!-- 主要图表区域 -->
    <div class="charts-container">
      <!-- 左侧：多系列对比图 -->
      <div class="chart-panel chart-panel--wide">
        <div class="chart-panel__header">
          <h3>趋势对比分析</h3>
          <div class="legend-custom">
            <span v-for="(item, index) in multiSeriesData.series" :key="index" class="legend-item">
              <span class="legend-dot" :style="{ background: item.color }"></span>
              {{ item.name }}
            </span>
          </div>
        </div>
        <div class="chart-panel__body">
          <LineChart
            :x-data="multiSeriesData.categories"
            :series-data="multiSeriesData.series[0].data"
            :series-name="multiSeriesData.series[0].name"
            :line-color="multiSeriesData.series[0].color"
            :smooth="true"
            :show-area="true"
          />
        </div>
      </div>

      <!-- 右侧：环形图 -->
      <div class="chart-panel">
        <div class="chart-panel__header">
          <h3>渠道分布</h3>
        </div>
        <div class="chart-panel__body">
          <DonutChart :data="channelData" />
        </div>
      </div>
    </div>

    <!-- 第二行图表 -->
    <div class="charts-container">
      <!-- 堆叠柱状图 -->
      <div class="chart-panel">
        <div class="chart-panel__header">
          <h3>产品销量排行</h3>
        </div>
        <div class="chart-panel__body">
          <BarHorizontal
            :y-data="productRankData.map(item => item.name)"
            :series-data="productRankData.map(item => item.value)"
            series-name="销量"
          />
        </div>
      </div>

      <!-- 散点图 -->
      <div class="chart-panel">
        <div class="chart-panel__header">
          <h3>价格-销量关系</h3>
        </div>
        <div class="chart-panel__body">
          <ScatterChart
            :data="scatterData"
            series-name="价格-销量"
          />
        </div>
      </div>

      <!-- 玫瑰图 -->
      <div class="chart-panel">
        <div class="chart-panel__header">
          <h3>区域销售占比</h3>
        </div>
        <div class="chart-panel__body">
          <RoseChart :data="regionSalesData" />
        </div>
      </div>
    </div>

    <!-- 数据洞察卡片 -->
    <div class="insights-section">
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        数据洞察
      </h2>
      <div class="insights-grid">
        <div v-for="(insight, index) in insights" :key="index" class="insight-card">
          <div class="insight-card__icon" :class="`insight-card__icon--${insight.type}`">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" v-if="insight.type === 'success'" />
              <polyline points="22 4 12 14.01 9 11.01" v-if="insight.type === 'success'" />
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" v-if="insight.type === 'warning'" />
              <line x1="12" y1="9" x2="12" y2="13" v-if="insight.type === 'warning'" />
              <line x1="12" y1="17" x2="12.01" y2="17" v-if="insight.type === 'warning'" />
              <circle cx="12" cy="12" r="10" v-if="insight.type === 'info'" />
              <line x1="12" y1="16" x2="12" y2="12" v-if="insight.type === 'info'" />
              <line x1="12" y1="8" x2="12.01" y2="8" v-if="insight.type === 'info'" />
            </svg>
          </div>
          <div class="insight-card__content">
            <h4>{{ insight.title }}</h4>
            <p>{{ insight.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Analytics - 数据分析页
 * 提供深度数据分析和趋势洞察
 */
import { ref } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import BarHorizontal from '@/components/charts/BarHorizontal.vue'
import ScatterChart from '@/components/charts/ScatterChart.vue'
import RoseChart from '@/components/charts/RoseChart.vue'

const timeRange = ref('month')
const selectedDimension = ref(0)

// 分析维度
const dimensions = ref([
  {
    title: '用户行为',
    value: '86,432',
    trend: 12.5,
    icon: { template: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />' }
  },
  {
    title: '交易转化',
    value: '68.5%',
    trend: -2.1,
    icon: { template: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />' }
  },
  {
    title: '留存率',
    value: '45.2%',
    trend: 5.8,
    icon: { template: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />' }
  },
  {
    title: '活跃度',
    value: '92,156',
    trend: 8.3,
    icon: { template: '<path d="M22 12h-4l-3 9L9 3l-3 9H2" />' }
  }
])

// 多系列数据
const multiSeriesData = ref({
  categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  series: [
    { name: '本周', data: [320, 280, 350, 420, 380, 450, 400], color: '#00d4ff' },
    { name: '上周', data: [280, 240, 300, 380, 340, 400, 360], color: '#00ff88' }
  ]
})

// 渠道分布数据
const channelData = ref([
  { name: '线上商城', value: 45 },
  { name: '线下门店', value: 25 },
  { name: '小程序', value: 20 },
  { name: '其他', value: 10 }
])

// 产品排行数据
const productRankData = ref([
  { name: '产品A', value: 1250 },
  { name: '产品B', value: 980 },
  { name: '产品C', value: 850 },
  { name: '产品D', value: 720 },
  { name: '产品E', value: 580 }
])

// 散点图数据
const scatterData = ref<[number, number][]>([
  [100, 50], [150, 80], [200, 120], [250, 90], [300, 150],
  [120, 60], [180, 100], [220, 110], [280, 130], [320, 170],
  [140, 70], [190, 95], [240, 125], [290, 140], [340, 180]
])

// 区域销售数据
const regionSalesData = ref([
  { name: '华东', value: 420 },
  { name: '华南', value: 380 },
  { name: '华北', value: 350 },
  { name: '西南', value: 280 },
  { name: '东北', value: 220 },
  { name: '西北', value: 180 }
])

// 数据洞察
const insights = ref([
  {
    type: 'success',
    title: '转化率提升',
    description: '本周转化率较上周提升 12.5%，主要得益于优化了结账流程。'
  },
  {
    type: 'warning',
    title: '用户流失预警',
    description: '近7天用户活跃度下降 8.3%，建议关注用户留存策略。'
  },
  {
    type: 'info',
    title: '新趋势发现',
    description: '移动端访问量持续增长，建议加大移动端优化投入。'
  }
])
</script>

<style scoped lang="scss">
.analytics-page {
  height: 100%;
  padding: $spacing-xl;
  overflow-y: auto;
  position: relative;
  z-index: 1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: $border-color;
    border-radius: 4px;
  }
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xl;

  &__content {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
  }

  &__actions {
    display: flex;
    gap: $spacing-md;
  }
}

.page-title {
  font-size: $font-size-title;
  color: $text-primary;
  margin: 0;
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .title-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 212, 255, 0.1);
    border-radius: $radius-md;
    color: $primary;

    svg {
      width: 24px;
      height: 24px;
    }
  }
}

.page-subtitle {
  font-size: $font-size-base;
  color: $text-secondary;
  margin: 0;
  margin-top: $spacing-xs;
}

.select-box {
  padding: $spacing-sm $spacing-lg;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  color: $text-primary;
  font-size: $font-size-base;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    border-color: $primary;
  }

  option {
    background: $bg-dark;
  }
}

.dimension-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.dimension-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    border-color: $border-glow;
    transform: translateY(-2px);
  }

  &--active {
    border-color: $primary;
    background: rgba(0, 212, 255, 0.05);
    box-shadow: $shadow-glow;
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    background: rgba(0, 212, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $primary;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__info {
    flex: 1;
  }

  &__title {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
  }

  &__value {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $text-primary;
  }

  &__trend {
    font-size: $font-size-sm;
    font-weight: 600;
    padding: $spacing-xs $spacing-sm;
    border-radius: 12px;

    &.trend--up {
      background: rgba(46, 213, 115, 0.15);
      color: $success;
    }

    &.trend--down {
      background: rgba(255, 71, 87, 0.15);
      color: $danger;
    }
  }
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.chart-panel {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-base;

  &:hover {
    border-color: $border-glow;
    box-shadow: $shadow-glow;
  }

  &--wide {
    grid-column: span 2;
  }

  &__header {
    padding: $spacing-lg;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      margin: 0;
      font-size: $font-size-lg;
      color: $text-primary;
    }
  }

  &__body {
    padding: $spacing-lg;
    height: 300px;
  }
}

.legend-custom {
  display: flex;
  gap: $spacing-lg;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.insights-section {
  margin-top: $spacing-xl;

  .section-title {
    font-size: $font-size-xl;
    color: $text-primary;
    margin: 0 0 $spacing-lg 0;
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    svg {
      width: 24px;
      height: 24px;
      color: $primary;
    }
  }
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
}

.insight-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  gap: $spacing-md;
  transition: all $transition-base;

  &:hover {
    border-color: $border-glow;
    transform: translateY(-2px);
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 22px;
      height: 22px;
    }

    &--success {
      background: rgba(46, 213, 115, 0.15);
      color: $success;
    }

    &--warning {
      background: rgba(255, 170, 0, 0.15);
      color: $warning;
    }

    &--info {
      background: rgba(0, 212, 255, 0.15);
      color: $primary;
    }
  }

  &__content {
    flex: 1;

    h4 {
      margin: 0 0 $spacing-xs 0;
      font-size: $font-size-base;
      color: $text-primary;
    }

    p {
      margin: 0;
      font-size: $font-size-sm;
      color: $text-secondary;
      line-height: 1.5;
    }
  }
}

// 响应式
@media (max-width: 1600px) {
  .dimension-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-container {
    grid-template-columns: 1fr;
  }

  .chart-panel--wide {
    grid-column: span 1;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .dimension-cards {
    grid-template-columns: 1fr;
  }
}
</style>
