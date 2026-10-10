// ==========================================
// 图表模拟数据
// ==========================================
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  randomInt, randomArray, generateTimeLabels,
  generateDateLabels, generateNamedData, formatNumber
} from '@/utils/mock'
import type { StatCardData, RankItem, ProgressData, AlertMessage, MapRegionData } from '@/types'

// ==================== 统计卡片数据 ====================
export function useStatCards() {
  const statCards = ref<StatCardData[]>([
    { title: '总用户数', value: 1286543, unit: '人', trend: 'up', trendValue: 12.5 },
    { title: '今日订单', value: 8653, unit: '单', trend: 'up', trendValue: 8.3 },
    { title: '总营收', value: 98562100, unit: '元', trend: 'up', trendValue: 15.2 },
    { title: '活跃设备', value: 23456, unit: '台', trend: 'down', trendValue: 2.1 }
  ])

  // 模拟实时数据刷新
  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      statCards.value = statCards.value.map(card => ({
        ...card,
        value: card.value + randomInt(-100, 500),
        trend: Math.random() > 0.3 ? 'up' : 'down',
        trendValue: parseFloat((Math.random() * 20).toFixed(1))
      }))
    }, 5000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { statCards }
}

// ==================== 折线图数据 ====================
export function useLineData() {
  const xData = ref(generateTimeLabels(12))
  const seriesData = ref(randomArray(12, 200, 800))

  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      // 滚动更新数据
      seriesData.value = seriesData.value.map(() => randomInt(200, 800))
    }, 8000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { xData, seriesData }
}

// ==================== 柱状图数据 ====================
export function useBarData() {
  const categories = ['产品A', '产品B', '产品C', '产品D', '产品E', '产品F', '产品G']
  const xData = ref(categories)
  const seriesData = ref(randomArray(7, 100, 600))

  return { xData, seriesData }
}

// ==================== 横向柱状图数据 ====================
export function useBarHorizontalData() {
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉']
  const yData = ref(cities)
  const seriesData = ref(randomArray(7, 500, 3000))

  return { yData, seriesData }
}

// ==================== 饼图/环形图数据 ====================
export function usePieData() {
  const pieData = ref([
    { name: '电子产品', value: randomInt(200, 500) },
    { name: '服装鞋帽', value: randomInt(150, 400) },
    { name: '食品饮料', value: randomInt(100, 300) },
    { name: '家居用品', value: randomInt(80, 250) },
    { name: '其他', value: randomInt(50, 150) }
  ])

  return { pieData }
}

// ==================== 玫瑰图数据 ====================
export function useRoseData() {
  const roseData = ref(
    generateNamedData(['华东', '华南', '华北', '华中', '西南', '西北', '东北'], 100, 600)
  )

  return { roseData }
}

// ==================== 地图数据 ====================
export function useMapData() {
  const provinces = [
    '北京', '天津', '上海', '重庆', '河北', '河南', '云南', '辽宁',
    '黑龙江', '湖南', '安徽', '山东', '新疆', '江苏', '浙江', '江西',
    '湖北', '广西', '甘肃', '山西', '内蒙古', '陕西', '吉林', '福建',
    '贵州', '广东', '青海', '西藏', '四川', '宁夏', '海南', '台湾',
    '香港', '澳门'
  ]

  const mapData = ref<MapRegionData[]>(
    provinces.map(name => ({ name, value: randomInt(0, 1000) }))
  )

  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      mapData.value = mapData.value.map(item => ({
        ...item,
        value: Math.max(0, item.value + randomInt(-50, 50))
      }))
    }, 10000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { mapData }
}

// ==================== 仪表盘数据 ====================
export function useGaugeData() {
  const gaugeValue = ref(randomInt(60, 95))

  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      gaugeValue.value = Math.min(100, Math.max(0, gaugeValue.value + randomInt(-5, 5)))
    }, 6000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { gaugeValue }
}

// ==================== 雷达图数据 ====================
export function useRadarData() {
  const indicators = [
    { name: '销售', max: 100 },
    { name: '管理', max: 100 },
    { name: '技术', max: 100 },
    { name: '客服', max: 100 },
    { name: '研发', max: 100 },
    { name: '市场', max: 100 }
  ]
  const seriesData = ref(randomArray(6, 40, 95))

  return { indicators, seriesData }
}

// ==================== 散点图数据 ====================
export function useScatterData() {
  const scatterData = ref<[number, number][]>(
    Array.from({ length: 30 }, () => [
      randomInt(10, 100),
      randomInt(10, 100)
    ] as [number, number])
  )

  return { scatterData }
}

// ==================== 排名数据 ====================
export function useRankData() {
  const rankData = ref<RankItem[]>([
    { name: '北京总部', value: randomInt(5000, 9000) },
    { name: '上海分部', value: randomInt(4000, 8000) },
    { name: '广州分部', value: randomInt(3000, 7000) },
    { name: '深圳分部', value: randomInt(3000, 6500) },
    { name: '杭州分部', value: randomInt(2000, 5500) },
    { name: '成都分部', value: randomInt(2000, 5000) },
    { name: '武汉分部', value: randomInt(1500, 4500) },
    { name: '南京分部', value: randomInt(1000, 4000) }
  ])

  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      rankData.value = rankData.value.map(item => ({
        ...item,
        value: Math.max(500, item.value + randomInt(-200, 300))
      }))
    }, 7000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { rankData }
}

// ==================== 进度条数据 ====================
export function useProgressData() {
  const progressData = ref<ProgressData[]>([
    { label: 'CPU 使用率', value: randomInt(30, 85), color: '#00d4ff' },
    { label: '内存占用', value: randomInt(40, 90), color: '#00ff88' },
    { label: '磁盘使用', value: randomInt(20, 70), color: '#ffaa00' },
    { label: '网络带宽', value: randomInt(10, 60), color: '#ff4757' }
  ])

  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      progressData.value = progressData.value.map(item => ({
        ...item,
        value: Math.min(100, Math.max(5, item.value + randomInt(-8, 8)))
      }))
    }, 4000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { progressData }
}

// ==================== 告警消息数据 ====================
export function useAlertMessages() {
  const messages = ref<AlertMessage[]>([
    { id: 1, text: '系统运行正常，所有服务在线', type: 'info', time: '10:23' },
    { id: 2, text: '服务器 CPU 使用率超过 80%', type: 'warning', time: '10:15' },
    { id: 3, text: '数据库连接池已扩容至 200', type: 'info', time: '09:58' },
    { id: 4, text: '华北节点响应延迟偏高', type: 'warning', time: '09:45' },
    { id: 5, text: '安全扫描完成，未发现异常', type: 'info', time: '09:30' },
    { id: 6, text: '磁盘空间不足告警 - 节点 A3', type: 'danger', time: '09:12' },
    { id: 7, text: '新版本 v2.3.1 已部署上线', type: 'info', time: '08:55' },
    { id: 8, text: 'API 网关流量峰值 12000 QPS', type: 'warning', time: '08:40' }
  ])

  return { messages }
}

// ==================== 多系列折线图数据（用于中间区域） ====================
export function useMultiLineData() {
  const xData = ref(generateDateLabels(14))
  const series1 = ref(randomArray(14, 500, 1500))
  const series2 = ref(randomArray(14, 300, 1200))

  return { xData, series1, series2 }
}
