<template>
  <div class="dashboard-page">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="page-header__content">
        <h1 class="page-title">
          <span class="title-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          数据总览
        </h1>
        <p class="page-subtitle">实时监控核心业务数据，掌握全局动态</p>
      </div>
      <div class="page-header__actions">
        <button class="btn btn--outline" @click="refreshData">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          刷新数据
        </button>
        <button class="btn btn--primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          导出报表
        </button>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <div class="stats-grid">
      <div
        v-for="(stat, index) in statsData"
        :key="index"
        class="stat-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="stat-card__glow"></div>
        <div class="stat-card__header">
          <div class="stat-icon" :class="`stat-icon--${stat.color}`">
            <el-icon :size="24">
              <component :is="stat.iconComponent" />
            </el-icon>
          </div>
          <div class="stat-trend" :class="`stat-trend--${stat.trend > 0 ? 'up' : 'down'}`">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="stat.trend > 0" d="M7 14l5-5 5 5" />
              <path v-else d="M7 10l5 5 5-5" />
            </svg>
            {{ Math.abs(stat.trend) }}%
          </div>
        </div>
        <div class="stat-card__body">
          <div class="stat-value">
            <NumberFlip :value="stat.value" :duration="2000" />
            <span class="stat-unit">{{ stat.unit }}</span>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        <div class="stat-card__footer">
          <div class="stat-sparkline">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none">
              <path :d="stat.sparkline" fill="none" :stroke="stat.color === 'blue' ? '#00d4ff' : stat.color === 'green' ? '#2ed573' : stat.color === 'orange' ? '#ffaa00' : '#ff4757'" stroke-width="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 左侧：趋势图 -->
      <div class="chart-card chart-card--large">
        <div class="chart-card__header">
          <h3>业务趋势分析</h3>
          <div class="chart-tabs">
            <button
              v-for="tab in ['日', '周', '月', '年']"
              :key="tab"
              class="chart-tab"
              :class="{ 'chart-tab--active': activeTab === tab }"
              @click="activeTab = tab"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="chart-card__body">
          <LineChart
            :x-data="trendData.categories"
            :series-data="trendData.series[0].data"
            :series-name="trendData.series[0].name"
            :smooth="true"
            :show-area="true"
          />
        </div>
      </div>

      <!-- 右侧：分布图 -->
      <div class="chart-card">
        <div class="chart-card__header">
          <h3>数据分布</h3>
        </div>
        <div class="chart-card__body">
          <PieChart :data="distributionData" />
        </div>
      </div>
    </div>

    <!-- 第二行图表 -->
    <div class="charts-grid-secondary">
      <!-- 柱状图 -->
      <div class="chart-card">
        <div class="chart-card__header">
          <h3>区域对比</h3>
        </div>
        <div class="chart-card__body">
          <BarChart
            :x-data="regionData.categories"
            :series-data="regionData.series[0].data"
            :series-name="regionData.series[0].name"
          />
        </div>
      </div>

      <!-- 雷达图 -->
      <div class="chart-card">
        <div class="chart-card__header">
          <h3>能力评估</h3>
        </div>
        <div class="chart-card__body">
          <RadarChart
            :indicators="radarData.indicators"
            :series-data="radarData.series[0].data"
            :series-name="radarData.series[0].name"
          />
        </div>
      </div>

      <!-- 实时数据列表 -->
      <div class="chart-card">
        <div class="chart-card__header">
          <h3>实时动态</h3>
          <span class="live-indicator">
            <span class="live-dot"></span>
            实时
          </span>
        </div>
        <div class="chart-card__body">
          <div class="activity-list">
            <div
              v-for="(item, index) in activityData"
              :key="index"
              class="activity-item"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <div class="activity-item__icon" :class="`activity-item__icon--${item.type}`">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" v-if="item.type === 'order'" />
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" v-if="item.type === 'success'" />
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" v-if="item.type === 'user'" />
                </svg>
              </div>
              <div class="activity-item__content">
                <div class="activity-item__title">{{ item.title }}</div>
                <div class="activity-item__time">{{ item.time }}</div>
              </div>
              <div class="activity-item__value" :class="`activity-item__value--${item.type}`">
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Dashboard - 数据总览页
 * 展示核心指标、趋势图表和实时数据
 */
import { ref, onMounted } from 'vue'
import NumberFlip from '@/components/common/NumberFlip.vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import RadarChart from '@/components/charts/RadarChart.vue'
import { User, ShoppingCart, Money, TrendCharts } from '@element-plus/icons-vue'

// 核心指标数据
const statsData = ref([
  {
    label: '总用户数',
    value: 128456,
    unit: '人',
    trend: 12.5,
    color: 'blue',
    iconComponent: User,
    sparkline: 'M0,15 Q10,10 20,12 T40,8 T60,10 T80,5 T100,3'
  },
  {
    label: '今日订单',
    value: 3842,
    unit: '单',
    trend: 8.3,
    color: 'green',
    iconComponent: ShoppingCart,
    sparkline: 'M0,12 Q10,8 20,10 T40,6 T60,8 T80,4 T100,2'
  },
  {
    label: '销售额',
    value: 892456,
    unit: '元',
    trend: 15.2,
    color: 'orange',
    iconComponent: Money,
    sparkline: 'M0,18 Q10,15 20,12 T40,10 T60,8 T80,6 T100,4'
  },
  {
    label: '转化率',
    value: 68.5,
    unit: '%',
    trend: -2.1,
    color: 'red',
    iconComponent: TrendCharts,
    sparkline: 'M0,8 Q10,10 20,12 T40,14 T60,12 T80,15 T100,16'
  }
])

// 趋势图数据
const trendData = ref({
  categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  series: [
    { name: '订单量', data: [120, 80, 150, 280, 320, 250, 180] },
    { name: '销售额', data: [200, 150, 280, 420, 480, 380, 280] }
  ]
})

const trendOptions = ref({
  smooth: true,
  area: true
})

const activeTab = ref('日')

// 分布图数据
const distributionData = ref([
  { name: '电子产品', value: 35 },
  { name: '服装配饰', value: 25 },
  { name: '食品饮料', value: 20 },
  { name: '家居用品', value: 15 },
  { name: '其他', value: 5 }
])

// 区域对比数据
const regionData = ref({
  categories: ['华东', '华南', '华北', '西南', '东北', '西北'],
  series: [
    { name: '销售额', data: [420, 380, 350, 280, 220, 180] }
  ]
})

// 雷达图数据
const radarData = ref({
  indicators: [
    { name: '销售', max: 100 },
    { name: '管理', max: 100 },
    { name: '技术', max: 100 },
    { name: '客服', max: 100 },
    { name: '研发', max: 100 },
    { name: '市场', max: 100 }
  ],
  series: [
    { name: '本月', data: [85, 90, 78, 92, 88, 76] },
    { name: '上月', data: [75, 85, 70, 88, 82, 70] }
  ]
})

// 实时动态数据
const activityData = ref([
  { type: 'order', title: '新订单 #12345', time: '刚刚', value: '+¥299' },
  { type: 'user', title: '新用户注册', time: '2分钟前', value: '+1' },
  { type: 'success', title: '订单 #12340 已完成', time: '5分钟前', value: '¥599' },
  { type: 'order', title: '新订单 #12339', time: '8分钟前', value: '+¥199' },
  { type: 'user', title: '用户评价', time: '10分钟前', value: '5星' },
  { type: 'success', title: '订单 #12335 已发货', time: '15分钟前', value: '已发出' }
])

const refreshData = () => {
  // 模拟刷新数据
  statsData.value = statsData.value.map(stat => ({
    ...stat,
    value: Math.floor(stat.value * (1 + (Math.random() - 0.5) * 0.1))
  }))
}

onMounted(() => {
  // 页面加载后的初始化逻辑
})
</script>

<style scoped lang="scss">
.dashboard-page {
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

.btn {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  border-radius: $radius-md;
  font-size: $font-size-base;
  cursor: pointer;
  transition: all $transition-base;
  border: none;

  svg {
    width: 16px;
    height: 16px;
  }

  &--primary {
    background: $gradient-primary;
    color: white;

    &:hover {
      box-shadow: $shadow-glow;
      transform: translateY(-2px);
    }
  }

  &--outline {
    background: transparent;
    border: 1px solid $border-color;
    color: $text-primary;

    &:hover {
      border-color: $primary;
      color: $primary;
      background: rgba(0, 212, 255, 0.05);
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.stat-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  position: relative;
  overflow: hidden;
  transition: all $transition-base;
  animation: slideUp 0.6s ease-out both;

  &:hover {
    transform: translateY(-4px);
    border-color: $border-glow;
    box-shadow: $shadow-glow;
  }

  &__glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity $transition-base;
  }

  &:hover &__glow {
    opacity: 1;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-md;
  }

  &__body {
    margin-bottom: $spacing-md;
  }

  &__footer {
    height: 30px;
  }
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .el-icon {
    font-size: 24px;
  }

  &--blue {
    background: rgba(79, 195, 247, 0.15);
    color: #4fc3f7;
  }

  &--green {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
  }

  &--orange {
    background: rgba(255, 152, 0, 0.15);
    color: #ff9800;
  }

  &--red {
    background: rgba(255, 82, 82, 0.15);
    color: #ff5252;
  }
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: $font-size-sm;
  padding: 4px 8px;
  border-radius: 12px;

  svg {
    width: 14px;
    height: 14px;
  }

  &--up {
    background: rgba(46, 213, 115, 0.15);
    color: $success;
  }

  &--down {
    background: rgba(255, 71, 87, 0.15);
    color: $danger;
  }
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: $text-primary;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-unit {
  font-size: $font-size-sm;
  color: $text-secondary;
  font-weight: normal;
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-top: $spacing-xs;
}

.stat-sparkline {
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
    height: 100%;
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.charts-grid-secondary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
}

.chart-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-base;

  &:hover {
    border-color: $border-glow;
    box-shadow: $shadow-glow;
  }

  &--large {
    grid-row: span 2;
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
    height: 280px;
  }
}

.chart-tabs {
  display: flex;
  gap: $spacing-xs;
}

.chart-tab {
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-sm;
  font-size: $font-size-sm;
  color: $text-secondary;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    color: $text-primary;
    background: rgba(0, 212, 255, 0.05);
  }

  &--active {
    color: $primary;
    background: rgba(0, 212, 255, 0.1);
  }
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-sm;
  color: $success;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $success;
  animation: pulse 2s ease-in-out infinite;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm;
  border-radius: $radius-md;
  transition: all $transition-base;
  animation: slideIn 0.4s ease-out both;

  &:hover {
    background: rgba(0, 212, 255, 0.05);
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

    &--order {
      background: rgba(0, 212, 255, 0.15);
      color: $primary;
    }

    &--user {
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
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__time {
    font-size: $font-size-xs;
    color: $text-muted;
  }

  &__value {
    font-size: $font-size-sm;
    font-weight: 600;

    &--order {
      color: $primary;
    }

    &--user {
      color: $warning;
    }

    &--success {
      color: $success;
    }
  }
}

// 动画
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 响应式
@media (max-width: 1600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid-secondary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid-secondary {
    grid-template-columns: 1fr;
  }
}
</style>
