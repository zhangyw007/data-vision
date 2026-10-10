<template>
  <div class="monitor-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-header__content">
        <h1 class="page-title">
          <span class="title-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </span>
          系统监控
        </h1>
        <p class="page-subtitle">实时监控系统状态，保障服务稳定运行</p>
      </div>
      <div class="page-header__actions">
        <button class="btn btn--outline" @click="refreshMetrics">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          刷新
        </button>
      </div>
    </div>

    <!-- 系统状态概览 -->
    <div class="status-overview">
      <div class="status-card" v-for="(status, index) in systemStatus" :key="index">
        <div class="status-card__header">
          <div class="status-indicator" :class="`status-indicator--${status.level}`">
            <span class="status-dot"></span>
          </div>
          <span class="status-label">{{ status.label }}</span>
        </div>
        <div class="status-card__value">
          <NumberFlip :value="status.value" :duration="1000" />
          <span class="status-unit">{{ status.unit }}</span>
        </div>
        <div class="status-card__progress">
          <div class="progress-bar">
            <div
              class="progress-bar__fill"
              :style="{ width: `${status.percent}%` }"
              :class="`progress-bar__fill--${status.level}`"
            ></div>
          </div>
          <span class="progress-text">{{ status.percent }}%</span>
        </div>
      </div>
    </div>

    <!-- 实时监控图表 -->
    <div class="monitoring-grid">
      <!-- CPU 使用率 -->
      <div class="monitor-card">
        <div class="monitor-card__header">
          <h3>CPU 使用率</h3>
          <div class="metric-badge" :class="`metric-badge--${cpuStatus.level}`">
            {{ cpuStatus.value }}%
          </div>
        </div>
        <div class="monitor-card__body">
          <GaugeChart :value="cpuStatus.value" :color="cpuStatus.color" />
        </div>
        <div class="monitor-card__footer">
          <div class="metric-info">
            <span>核心数: 8</span>
            <span>频率: 3.6GHz</span>
          </div>
        </div>
      </div>

      <!-- 内存使用 -->
      <div class="monitor-card">
        <div class="monitor-card__header">
          <h3>内存使用</h3>
          <div class="metric-badge" :class="`metric-badge--${memoryStatus.level}`">
            {{ memoryStatus.value }}%
          </div>
        </div>
        <div class="monitor-card__body">
          <GaugeChart :value="memoryStatus.value" :color="memoryStatus.color" />
        </div>
        <div class="monitor-card__footer">
          <div class="metric-info">
            <span>已用: {{ memoryStatus.used }}GB</span>
            <span>总计: 32GB</span>
          </div>
        </div>
      </div>

      <!-- 磁盘 IO -->
      <div class="monitor-card">
        <div class="monitor-card__header">
          <h3>磁盘 IO</h3>
          <div class="metric-badge metric-badge--normal">正常</div>
        </div>
        <div class="monitor-card__body">
          <div class="disk-io-display">
            <div class="io-item">
              <span class="io-label">读取</span>
              <span class="io-value">{{ diskIO.read }} MB/s</span>
              <div class="io-bar">
                <div class="io-bar__fill io-bar__fill--read" :style="{ width: `${diskIO.readPercent}%` }"></div>
              </div>
            </div>
            <div class="io-item">
              <span class="io-label">写入</span>
              <span class="io-value">{{ diskIO.write }} MB/s</span>
              <div class="io-bar">
                <div class="io-bar__fill io-bar__fill--write" :style="{ width: `${diskIO.writePercent}%` }"></div>
              </div>
            </div>
            <div class="io-item">
              <span class="io-label">IOPS</span>
              <span class="io-value">{{ diskIO.iops }}</span>
              <div class="io-bar">
                <div class="io-bar__fill io-bar__fill--iops" :style="{ width: `${diskIO.iopsPercent}%` }"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="monitor-card__footer">
          <div class="metric-info">
            <span>磁盘: SSD</span>
            <span>容量: 1TB</span>
          </div>
        </div>
      </div>

      <!-- 网络流量 -->
      <div class="monitor-card monitor-card--wide">
        <div class="monitor-card__header">
          <h3>网络流量</h3>
          <div class="network-stats">
            <span class="network-stat network-stat--up">
              ↑ {{ network.upload }} MB/s
            </span>
            <span class="network-stat network-stat--down">
              ↓ {{ network.download }} MB/s
            </span>
          </div>
        </div>
        <div class="monitor-card__body">
          <div class="network-chart">
            <svg viewBox="0 0 400 100" preserveAspectRatio="none">
              <path :d="network.uploadPath" fill="none" stroke="#2ed573" stroke-width="2" />
              <path :d="network.downloadPath" fill="none" stroke="#00d4ff" stroke-width="2" />
            </svg>
          </div>
        </div>
        <div class="monitor-card__footer">
          <div class="metric-info">
            <span>总流量: {{ network.total }} GB</span>
            <span>连接数: {{ network.connections }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务状态列表 -->
    <div class="services-section">
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
        服务状态
      </h2>
      <div class="services-list">
        <div v-for="(service, index) in services" :key="index" class="service-item">
          <div class="service-item__status" :class="`service-item__status--${service.status}`">
            <span class="service-dot"></span>
          </div>
          <div class="service-item__info">
            <div class="service-item__name">{{ service.name }}</div>
            <div class="service-item__desc">{{ service.description }}</div>
          </div>
          <div class="service-item__metrics">
            <span class="metric-tag">{{ service.responseTime }}ms</span>
            <span class="metric-tag">{{ service.uptime }}%</span>
          </div>
          <div class="service-item__actions">
            <button class="action-btn" title="查看详情">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button class="action-btn" title="重启服务">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 告警信息 -->
    <div class="alerts-section">
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        告警信息
        <span class="alert-count">{{ alerts.length }}</span>
      </h2>
      <div class="alerts-list">
        <div v-for="(alert, index) in alerts" :key="index" class="alert-item" :class="`alert-item--${alert.level}`">
          <div class="alert-item__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" v-if="alert.level === 'info'" />
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" v-if="alert.level === 'warning'" />
              <circle cx="12" cy="12" r="10" v-if="alert.level === 'error'" />
              <line x1="15" y1="9" x2="9" y2="15" v-if="alert.level === 'error'" />
              <line x1="9" y1="9" x2="15" y2="15" v-if="alert.level === 'error'" />
            </svg>
          </div>
          <div class="alert-item__content">
            <div class="alert-item__title">{{ alert.title }}</div>
            <div class="alert-item__message">{{ alert.message }}</div>
          </div>
          <div class="alert-item__time">{{ alert.time }}</div>
          <button class="alert-item__action">处理</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Monitor - 系统监控页
 * 实时展示系统状态和性能指标
 */
import { ref, onMounted, onUnmounted } from 'vue'
import NumberFlip from '@/components/common/NumberFlip.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'

// 系统状态
const systemStatus = ref([
  { label: 'CPU', value: 45, unit: '%', percent: 45, level: 'normal' },
  { label: '内存', value: 68, unit: '%', percent: 68, level: 'warning' },
  { label: '磁盘', value: 52, unit: '%', percent: 52, level: 'normal' },
  { label: '网络', value: 23, unit: 'MB/s', percent: 23, level: 'normal' }
])

const cpuStatus = ref({ value: 45, level: 'normal', color: '#00d4ff' })
const memoryStatus = ref({ value: 68, level: 'warning', color: '#ffaa00', used: 21.8 })

const diskIO = ref({
  read: 125,
  write: 89,
  iops: 3200,
  readPercent: 45,
  writePercent: 32,
  iopsPercent: 64
})

const network = ref({
  upload: 12.5,
  download: 45.8,
  total: 1256,
  connections: 1842,
  uploadPath: 'M0,50 Q50,40 100,45 T200,35 T300,40 T400,30',
  downloadPath: 'M0,60 Q50,50 100,55 T200,45 T300,50 T400,40'
})

// 服务列表
const services = ref([
  { name: 'Web Server', description: 'Nginx 反向代理', status: 'healthy', responseTime: 12, uptime: 99.99 },
  { name: 'API Service', description: 'Node.js 后端服务', status: 'healthy', responseTime: 45, uptime: 99.95 },
  { name: 'Database', description: 'MySQL 主数据库', status: 'healthy', responseTime: 8, uptime: 99.99 },
  { name: 'Cache', description: 'Redis 缓存服务', status: 'warning', responseTime: 2, uptime: 99.8 },
  { name: 'Queue', description: 'RabbitMQ 消息队列', status: 'healthy', responseTime: 15, uptime: 99.9 }
])

// 告警信息
const alerts = ref([
  { level: 'warning', title: '内存使用率偏高', message: '当前内存使用率 68%，建议关注', time: '5分钟前' },
  { level: 'info', title: '系统更新', message: '新版本 v2.1.0 已发布', time: '1小时前' },
  { level: 'error', title: '服务异常', message: 'Cache 服务响应时间异常', time: '2小时前' }
])

// 模拟实时更新
let updateTimer: number | null = null

const refreshMetrics = () => {
  // 模拟数据更新
  cpuStatus.value.value = Math.floor(Math.random() * 30) + 30
  memoryStatus.value.value = Math.floor(Math.random() * 20) + 60
  systemStatus.value[0].value = cpuStatus.value.value
  systemStatus.value[1].value = memoryStatus.value.value
  
  network.value.upload = parseFloat((Math.random() * 20 + 10).toFixed(1))
  network.value.download = parseFloat((Math.random() * 50 + 30).toFixed(1))
}

onMounted(() => {
  updateTimer = window.setInterval(refreshMetrics, 5000)
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<style scoped lang="scss">
.monitor-page {
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

.status-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.status-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  transition: all $transition-base;

  &:hover {
    border-color: $border-glow;
    transform: translateY(-2px);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
  }

  &__value {
    font-size: 28px;
    font-weight: 700;
    color: $text-primary;
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: $spacing-md;
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: relative;

  .status-dot {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  &--normal {
    background: rgba(46, 213, 115, 0.3);
    .status-dot { background: $success; }
  }

  &--warning {
    background: rgba(255, 170, 0, 0.3);
    .status-dot { background: $warning; }
  }

  &--error {
    background: rgba(255, 71, 87, 0.3);
    .status-dot { background: $danger; }
  }
}

.status-label {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.status-unit {
  font-size: $font-size-sm;
  color: $text-secondary;
  font-weight: normal;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;

  &__fill {
    height: 100%;
    border-radius: 3px;
    transition: width $transition-base;

    &--normal { background: $success; }
    &--warning { background: $warning; }
    &--error { background: $danger; }
  }
}

.progress-text {
  font-size: $font-size-xs;
  color: $text-muted;
  min-width: 35px;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.monitor-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-base;

  &:hover {
    border-color: $border-glow;
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
      font-size: $font-size-base;
      color: $text-primary;
    }
  }

  &__body {
    padding: $spacing-lg;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color;
    background: rgba(0, 0, 0, 0.2);
  }
}

.metric-badge {
  padding: $spacing-xs $spacing-sm;
  border-radius: 12px;
  font-size: $font-size-xs;
  font-weight: 600;

  &--normal {
    background: rgba(46, 213, 115, 0.15);
    color: $success;
  }

  &--warning {
    background: rgba(255, 170, 0, 0.15);
    color: $warning;
  }

  &--error {
    background: rgba(255, 71, 87, 0.15);
    color: $danger;
  }
}

.metric-info {
  display: flex;
  justify-content: space-between;
  font-size: $font-size-xs;
  color: $text-muted;
}

.disk-io-display {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.io-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .io-label {
    width: 40px;
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  .io-value {
    width: 80px;
    font-size: $font-size-sm;
    color: $text-primary;
    font-weight: 600;
  }

  .io-bar {
    flex: 1;
    height: 8px;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;

    &__fill {
      height: 100%;
      border-radius: 4px;
      transition: width $transition-base;

      &--read { background: $primary; }
      &--write { background: $secondary; }
      &--iops { background: $warning; }
    }
  }
}

.network-stats {
  display: flex;
  gap: $spacing-md;
}

.network-stat {
  font-size: $font-size-sm;
  font-weight: 600;

  &--up { color: $success; }
  &--down { color: $primary; }
}

.network-chart {
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
    height: 100%;
  }
}

.services-section,
.alerts-section {
  margin-bottom: $spacing-xl;

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

.alert-count {
  background: $danger;
  color: white;
  font-size: $font-size-xs;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: $spacing-sm;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.service-item {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  transition: all $transition-base;

  &:hover {
    border-color: $border-glow;
  }

  &__status {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: relative;

    .service-dot {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    &--healthy {
      background: rgba(46, 213, 115, 0.3);
      .service-dot { background: $success; }
    }

    &--warning {
      background: rgba(255, 170, 0, 0.3);
      .service-dot { background: $warning; }
    }

    &--error {
      background: rgba(255, 71, 87, 0.3);
      .service-dot { background: $danger; }
    }
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-size: $font-size-base;
    color: $text-primary;
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  &__metrics {
    display: flex;
    gap: $spacing-sm;
  }

  &__actions {
    display: flex;
    gap: $spacing-sm;
  }
}

.metric-tag {
  padding: $spacing-xs $spacing-sm;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 4px;
  font-size: $font-size-xs;
  color: $primary;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    background: rgba(0, 212, 255, 0.08);
    color: $primary;
    border-color: $primary;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.alert-item {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  transition: all $transition-base;

  &:hover {
    border-color: $border-glow;
  }

  &--info { border-left: 3px solid $primary; }
  &--warning { border-left: 3px solid $warning; }
  &--error { border-left: 3px solid $danger; }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &--info &__icon {
    background: rgba(0, 212, 255, 0.15);
    color: $primary;
  }

  &--warning &__icon {
    background: rgba(255, 170, 0, 0.15);
    color: $warning;
  }

  &--error &__icon {
    background: rgba(255, 71, 87, 0.15);
    color: $danger;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: $font-size-base;
    color: $text-primary;
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__message {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  &__time {
    font-size: $font-size-xs;
    color: $text-muted;
  }

  &__action {
    padding: $spacing-xs $spacing-md;
    background: transparent;
    border: 1px solid $border-color;
    border-radius: $radius-md;
    color: $text-secondary;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all $transition-base;

    &:hover {
      border-color: $primary;
      color: $primary;
      background: rgba(0, 212, 255, 0.05);
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// 响应式
@media (max-width: 1600px) {
  .status-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .monitoring-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .monitor-card--wide {
    grid-column: span 1;
  }
}

@media (max-width: 1024px) {
  .status-overview {
    grid-template-columns: 1fr;
  }

  .monitoring-grid {
    grid-template-columns: 1fr;
  }
}
</style>
