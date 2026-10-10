<template>
  <div class="reports-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-header__content">
        <h1 class="page-title">
          <span class="title-icon">
            <el-icon :size="24"><Document /></el-icon>
          </span>
          数据报表
        </h1>
        <p class="page-subtitle">详细数据统计与分析报表</p>
      </div>
      <div class="page-header__actions">
        <el-button @click="exportData" :icon="Download">
          导出 Excel
        </el-button>
        <el-button type="primary" @click="printReport" :icon="Printer">
          打印报表
        </el-button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>时间范围</label>
          <el-select v-model="filters.dateRange" placeholder="选择时间范围" style="width: 100%">
            <el-option label="今天" value="today" />
            <el-option label="近7天" value="week" />
            <el-option label="近30天" value="month" />
            <el-option label="本月" value="currentMonth" />
            <el-option label="自定义日期区间" value="custom" />
          </el-select>
        </div>
        <div class="filter-item">
          <label>数据类型</label>
          <el-select v-model="filters.dataType" placeholder="选择数据类型" style="width: 100%">
            <el-option label="全部" value="all" />
            <el-option label="订单数据" value="order" />
            <el-option label="用户数据" value="user" />
            <el-option label="产品数据" value="product" />
          </el-select>
        </div>
        <div class="filter-item">
          <label>区域</label>
          <el-select v-model="filters.region" placeholder="选择区域" style="width: 100%">
            <el-option label="全部区域" value="all" />
            <el-option label="华东" value="east" />
            <el-option label="华南" value="south" />
            <el-option label="华北" value="north" />
            <el-option label="西部" value="west" />
          </el-select>
        </div>
        <div class="filter-item">
          <label>搜索</label>
          <el-input v-model="filters.keyword" placeholder="输入关键词..." clearable />
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="applyFilter" :icon="Search">
            查询
          </el-button>
          <el-button @click="resetFilter" :icon="Refresh">
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-summary">
      <div v-for="(stat, index) in summaryStats" :key="index" class="summary-card">
        <div class="summary-card__icon" :class="`summary-card__icon--${stat.color}`">
          <el-icon :size="24">
            <component :is="stat.iconComponent" />
          </el-icon>
        </div>
        <div class="summary-card__info">
          <div class="summary-card__label">{{ stat.label }}</div>
          <div class="summary-card__value">
            <NumberFlip :value="stat.value" :duration="1500" />
            <span class="summary-card__unit">{{ stat.unit }}</span>
          </div>
          <div class="summary-card__change" :class="stat.change > 0 ? 'change--up' : 'change--down'">
            <el-icon :size="12">
              <Top v-if="stat.change > 0" />
              <Bottom v-else />
            </el-icon>
            {{ Math.abs(stat.change) }}% 较上期
          </div>
        </div>
        <!-- 完成率卡片右下角环形进度图 -->
        <div v-if="index === 3" class="summary-card__progress-ring">
          <div ref="progressRingRef" class="progress-ring-chart"></div>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <div class="table-header">
        <h3>数据明细</h3>
        <div class="table-actions">
          <el-button-group>
            <el-button :type="viewMode === 'table' ? 'primary' : 'default'" @click="viewMode = 'table'">
              <el-icon><Grid /></el-icon>
            </el-button>
            <el-button :type="viewMode === 'card' ? 'primary' : 'default'" @click="viewMode = 'card'">
              <el-icon><Menu /></el-icon>
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 表格视图 -->
      <div v-if="viewMode === 'table'" class="table-container">
        <!-- Loading 骨架屏 -->
        <el-skeleton :loading="tableLoading" animated :count="5">
          <template #template>
            <div class="skeleton-table">
              <div v-for="i in 5" :key="i" class="skeleton-row">
                <el-skeleton-item variant="text" style="width: 15%" />
                <el-skeleton-item variant="text" style="width: 20%" />
                <el-skeleton-item variant="text" style="width: 20%" />
                <el-skeleton-item variant="text" style="width: 15%" />
                <el-skeleton-item variant="text" style="width: 15%" />
                <el-skeleton-item variant="text" style="width: 15%" />
              </div>
            </div>
          </template>
          <template #default>
            <!-- 空数据占位 -->
            <div v-if="paginatedData.length === 0" class="empty-data">
              <el-empty description="暂无数据" />
            </div>
            <table v-else class="data-table">
              <thead>
                <tr>
                  <th v-for="col in tableColumns" :key="col.key" @click="sortTable(col.key)">
                    <div class="th-content">
                      {{ col.label }}
                      <el-icon v-if="sortKey === col.key" class="sort-icon">
                        <Top v-if="sortOrder === 'asc'" />
                        <Bottom v-else />
                      </el-icon>
                    </div>
                  </th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in paginatedData" :key="index" class="table-row">
                  <td v-for="col in tableColumns" :key="col.key">
                    <span v-if="col.key === 'status'" class="status-badge" :class="`status-badge--${row[col.key as keyof typeof row]}`">
                      {{ row[col.key as keyof typeof row] === 'completed' ? '已完成' : row[col.key as keyof typeof row] === 'pending' ? '进行中' : '待处理' }}
                    </span>
                    <span v-else-if="col.key === 'amount'" class="amount-value">
                      ¥{{ (row[col.key as keyof typeof row] as number).toLocaleString() }}
                    </span>
                    <span v-else>{{ row[col.key as keyof typeof row] }}</span>
                  </td>
                  <td>
                    <div class="row-actions">
                      <el-button size="small" :icon="View" circle title="查看详情" />
                      <el-button size="small" :icon="Edit" circle title="编辑" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </el-skeleton>
      </div>

      <!-- 卡片视图 -->
      <div v-else class="card-grid">
        <el-skeleton :loading="tableLoading" animated :count="6">
          <template #template>
            <div class="skeleton-cards">
              <div v-for="i in 6" :key="i" class="skeleton-card">
                <el-skeleton-item variant="rect" style="width: 100%; height: 120px" />
              </div>
            </div>
          </template>
          <template #default>
            <div v-if="paginatedData.length === 0" class="empty-data">
              <el-empty description="暂无数据" />
            </div>
            <div v-else v-for="(row, index) in paginatedData" :key="index" class="data-card">
              <div class="data-card__header">
                <span class="data-card__id">{{ row.id }}</span>
                <span class="status-badge" :class="`status-badge--${row.status}`">
                  {{ row.status === 'completed' ? '已完成' : row.status === 'pending' ? '进行中' : '待处理' }}
                </span>
              </div>
              <div class="data-card__body">
                <div class="data-card__row">
                  <span class="data-card__label">客户名称</span>
                  <span class="data-card__value">{{ row.customer }}</span>
                </div>
                <div class="data-card__row">
                  <span class="data-card__label">产品</span>
                  <span class="data-card__value">{{ row.product }}</span>
                </div>
                <div class="data-card__row">
                  <span class="data-card__label">金额</span>
                  <span class="data-card__value data-card__value--highlight">¥{{ row.amount.toLocaleString() }}</span>
                </div>
                <div class="data-card__row">
                  <span class="data-card__label">日期</span>
                  <span class="data-card__value">{{ row.date }}</span>
                </div>
              </div>
              <div class="data-card__footer">
                <el-button size="small" type="primary">查看详情</el-button>
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <div class="pagination__info">
          显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, tableData.length) }} 条，共 {{ tableData.length }} 条
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Reports - 数据报表页
 * 提供数据表格、筛选和导出功能
 */
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'
import NumberFlip from '@/components/common/NumberFlip.vue'

// Element Plus 图标
import {
  Document, Money, User, CircleCheck,
  Top, Bottom, Search, Refresh,
  Download, Printer, View, Edit,
  Grid, Menu
} from '@element-plus/icons-vue'

// 筛选器
const filters = ref({
  dateRange: 'month',
  dataType: 'all',
  region: 'all',
  keyword: ''
})

const viewMode = ref<'table' | 'card'>('table')
const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const pageSize = ref(10)
const tableLoading = ref(false)

// 统计卡片
const summaryStats = ref([
  {
    label: '总订单数',
    value: 12846,
    unit: '单',
    change: 12.5,
    color: 'blue',
    iconComponent: Document
  },
  {
    label: '总金额',
    value: 892456,
    unit: '元',
    change: 15.2,
    color: 'green',
    iconComponent: Money
  },
  {
    label: '客户数',
    value: 3842,
    unit: '人',
    change: 8.3,
    color: 'orange',
    iconComponent: User
  },
  {
    label: '完成率',
    value: 93,
    unit: '%',
    change: -2.1,
    color: 'purple',
    iconComponent: CircleCheck
  }
])

// 表格列配置
const tableColumns = [
  { key: 'id', label: '订单号' },
  { key: 'customer', label: '客户名称' },
  { key: 'product', label: '产品' },
  { key: 'amount', label: '金额' },
  { key: 'date', label: '日期' },
  { key: 'status', label: '状态' }
]

// 生成动态日期（今天往前倒序）
const generateDates = () => {
  const today = new Date()
  const dates: string[] = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
  }
  return dates
}

const dates = generateDates()

// 模拟表格数据（使用动态日期）
const tableData = ref([
  { id: 'ORD001', customer: '张三', product: '产品A', amount: 12500, date: dates[0], status: 'completed' },
  { id: 'ORD002', customer: '李四', product: '产品B', amount: 8900, date: dates[1], status: 'pending' },
  { id: 'ORD003', customer: '王五', product: '产品C', amount: 15600, date: dates[2], status: 'completed' },
  { id: 'ORD004', customer: '赵六', product: '产品A', amount: 23400, date: dates[3], status: 'pending' },
  { id: 'ORD005', customer: '孙七', product: '产品D', amount: 6700, date: dates[4], status: 'completed' },
  { id: 'ORD006', customer: '周八', product: '产品B', amount: 18900, date: dates[5], status: 'completed' },
  { id: 'ORD007', customer: '吴九', product: '产品C', amount: 9800, date: dates[6], status: 'pending' },
  { id: 'ORD008', customer: '郑十', product: '产品A', amount: 31200, date: dates[7], status: 'completed' },
  { id: 'ORD009', customer: '钱十一', product: '产品D', amount: 4500, date: dates[8], status: 'pending' },
  { id: 'ORD010', customer: '陈十二', product: '产品B', amount: 14300, date: dates[9], status: 'completed' },
  { id: 'ORD011', customer: '林十三', product: '产品C', amount: 22100, date: dates[10], status: 'completed' },
  { id: 'ORD012', customer: '黄十四', product: '产品A', amount: 7800, date: dates[11], status: 'pending' },
  { id: 'ORD013', customer: '杨十五', product: '产品B', amount: 16500, date: dates[12], status: 'completed' },
  { id: 'ORD014', customer: '朱十六', product: '产品C', amount: 11200, date: dates[13], status: 'pending' },
  { id: 'ORD015', customer: '秦十七', product: '产品A', amount: 28900, date: dates[14], status: 'completed' },
  { id: 'ORD016', customer: '尤十八', product: '产品D', amount: 5300, date: dates[15], status: 'completed' },
  { id: 'ORD017', customer: '许十九', product: '产品B', amount: 19800, date: dates[16], status: 'pending' },
  { id: 'ORD018', customer: '何二十', product: '产品C', amount: 13400, date: dates[17], status: 'completed' },
  { id: 'ORD019', customer: '吕二一', product: '产品A', amount: 24600, date: dates[18], status: 'pending' },
  { id: 'ORD020', customer: '施二二', product: '产品D', amount: 8100, date: dates[19], status: 'completed' },
  { id: 'ORD021', customer: '张二三', product: '产品B', amount: 17200, date: dates[20], status: 'completed' },
  { id: 'ORD022', customer: '孔二四', product: '产品C', amount: 10500, date: dates[21], status: 'pending' },
  { id: 'ORD023', customer: '曹二五', product: '产品A', amount: 26800, date: dates[22], status: 'completed' },
  { id: 'ORD024', customer: '严二六', product: '产品D', amount: 6900, date: dates[23], status: 'pending' },
  { id: 'ORD025', customer: '华二七', product: '产品B', amount: 20100, date: dates[24], status: 'completed' }
])

// 排序后的数据
const sortedData = computed(() => {
  if (!sortKey.value) return tableData.value
  
  return [...tableData.value].sort((a, b) => {
    const aVal = a[sortKey.value as keyof typeof a]
    const bVal = b[sortKey.value as keyof typeof b]
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    const aStr = String(aVal)
    const bStr = String(bVal)
    return sortOrder.value === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })
})

// 分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedData.value.slice(start, end)
})

const sortTable = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

const applyFilter = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 500)
}

const resetFilter = () => {
  filters.value = {
    dateRange: 'month',
    dataType: 'all',
    region: 'all',
    keyword: ''
  }
}

const exportData = () => {
  // 使用 xlsx 库导出 Excel
  const exportData = tableData.value.map(row => ({
    '订单号': row.id,
    '客户名称': row.customer,
    '产品': row.product,
    '金额': row.amount,
    '日期': row.date,
    '状态': row.status === 'completed' ? '已完成' : row.status === 'pending' ? '进行中' : '待处理'
  }))
  
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '数据报表')
  XLSX.writeFile(wb, `数据报表_${new Date().toISOString().split('T')[0]}.xlsx`)
}

const printReport = () => {
  window.print()
}

// 环形进度图
const progressRingRef = ref<HTMLElement | null>(null)
let progressChart: echarts.ECharts | null = null

const initProgressRing = () => {
  if (!progressRingRef.value) return
  
  progressChart = echarts.init(progressRingRef.value)
  const option = {
    series: [{
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      pointer: { show: false },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          color: '#4fc3f7'
        }
      },
      axisLine: {
        lineStyle: {
          width: 8,
          color: [[1, 'rgba(79, 195, 247, 0.2)']]
        }
      },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      data: [{
        value: 93,
        name: '完成率',
        title: {
          offsetCenter: ['0%', '0%'],
          fontSize: 14,
          color: '#e0f0ff'
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '0%'],
          fontSize: 20,
          fontWeight: 'bold',
          formatter: '{value}%',
          color: '#4fc3f7'
        }
      }],
      detail: {
        width: 50,
        height: 14,
        fontSize: 20,
        color: '#4fc3f7',
        formatter: '{value}%'
      }
    }]
  }
  progressChart.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    initProgressRing()
  })
})
</script>

<style scoped lang="scss">
.reports-page {
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
    background: rgba(79, 195, 247, 0.1);
    border-radius: $radius-md;
    color: #4fc3f7;
  }
}

.page-subtitle {
  font-size: $font-size-base;
  color: $text-secondary;
  margin: 0;
  margin-top: $spacing-xs;
}

.filter-section {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.filter-row {
  display: flex;
  gap: $spacing-lg;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  min-width: 150px;
  flex: 1;

  label {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.filter-actions {
  display: flex;
  gap: $spacing-sm;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.summary-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  gap: $spacing-md;
  transition: all $transition-base;
  position: relative;

  &:hover {
    border-color: $border-glow;
    transform: translateY(-2px);
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

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

    &--purple {
      background: rgba(171, 71, 188, 0.15);
      color: #ab47bc;
    }
  }

  &__info {
    flex: 1;
  }

  &__label {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
  }

  &__value {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $text-primary;
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: $spacing-xs;
  }

  &__unit {
    font-size: $font-size-sm;
    color: $text-secondary;
    font-weight: normal;
  }

  &__change {
    font-size: $font-size-xs;
    display: flex;
    align-items: center;
    gap: 4px;

    &.change--up {
      color: #4caf50;
    }

    &.change--down {
      color: #ff5252;
    }
  }

  &__progress-ring {
    position: absolute;
    right: $spacing-md;
    bottom: $spacing-md;
    width: 70px;
    height: 70px;
  }
}

.progress-ring-chart {
  width: 100%;
  height: 100%;
}

.table-section {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
}

.table-header {
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

.table-actions {
  display: flex;
  gap: $spacing-xs;
}

.table-container {
  overflow-x: auto;
}

.skeleton-table {
  padding: $spacing-lg;
}

.skeleton-row {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-md 0;
  border-bottom: 1px solid rgba(79, 195, 247, 0.1);
}

.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-lg;
  padding: $spacing-lg;
}

.skeleton-card {
  background: rgba(0, 0, 0, 0.2);
  border-radius: $radius-lg;
  padding: $spacing-lg;
}

.empty-data {
  padding: $spacing-xl * 2;
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: $spacing-md $spacing-lg;
    text-align: left;
    border-bottom: 1px solid rgba(79, 195, 247, 0.1);
  }

  th {
    background: rgba(0, 0, 0, 0.2);
    font-size: $font-size-sm;
    color: $text-secondary;
    font-weight: 600;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: #4fc3f7;
    }
  }

  .th-content {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  .sort-icon {
    color: #4fc3f7;
  }

  td {
    font-size: $font-size-base;
    color: $text-primary;
  }

  .table-row {
    transition: background $transition-base;

    &:hover {
      background: rgba(79, 195, 247, 0.03);
    }
  }
}

.status-badge {
  padding: $spacing-xs $spacing-sm;
  border-radius: 12px;
  font-size: $font-size-xs;
  font-weight: 600;

  &--completed {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
  }

  &--pending {
    background: rgba(255, 152, 0, 0.15);
    color: #ff9800;
  }

  &--processing {
    background: rgba(79, 195, 247, 0.15);
    color: #4fc3f7;
  }
}

.amount-value {
  font-weight: 600;
  color: #4fc3f7;
}

.row-actions {
  display: flex;
  gap: $spacing-sm;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-lg;
  padding: $spacing-lg;
}

.data-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-base;

  &:hover {
    border-color: $border-glow;
    transform: translateY(-2px);
  }

  &__header {
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__id {
    font-size: $font-size-sm;
    color: #4fc3f7;
    font-weight: 600;
  }

  &__body {
    padding: $spacing-lg;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-sm;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  &__value {
    font-size: $font-size-sm;
    color: $text-primary;
    font-weight: 500;

    &--highlight {
      color: #4fc3f7;
      font-weight: 700;
    }
  }

  &__footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color;
  }
}

.pagination {
  padding: $spacing-lg;
  border-top: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__info {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

// 打印样式
@media print {
  body * {
    visibility: hidden;
  }
  
  .reports-page,
  .reports-page * {
    visibility: visible;
  }
  
  .reports-page {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 20px;
  }
  
  // 隐藏不需要打印的元素
  .page-header__actions,
  .filter-section,
  .table-actions,
  .pagination {
    display: none !important;
  }
  
  // 调整打印样式
  .table-section {
    border: 1px solid #ccc;
  }
  
  .data-table {
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
    }
  }
}

// 响应式
@media (max-width: 1600px) {
  .stats-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .stats-summary {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-item {
    min-width: auto;
  }
}
</style>
