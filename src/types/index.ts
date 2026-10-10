// ==========================================
// 通用类型定义
// ==========================================

/** 图表数据项 */
export interface ChartDataItem {
  name: string
  value: number
}

/** 时间序列数据 */
export interface TimeSeriesData {
  time: string
  value: number
}

/** 排名数据项 */
export interface RankItem {
  name: string
  value: number
  rank?: number
}

/** 统计卡片数据 */
export interface StatCardData {
  title: string
  value: number
  unit?: string
  icon?: string
  trend?: 'up' | 'down'
  trendValue?: number
}

/** 进度条数据 */
export interface ProgressData {
  label: string
  value: number
  max?: number
  color?: string
}

/** 告警/滚动消息 */
export interface AlertMessage {
  id: number
  text: string
  type: 'info' | 'warning' | 'danger'
  time: string
}

/** 地图省份数据 */
export interface MapRegionData {
  name: string
  value: number
}
