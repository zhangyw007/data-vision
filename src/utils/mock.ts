// ==========================================
// 模拟数据生成工具函数
// ==========================================

/** 生成 [min, max] 区间随机整数 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 生成 [min, max] 区间随机浮点数 */
export function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

/** 生成随机数组 */
export function randomArray(length: number, min: number, max: number): number[] {
  return Array.from({ length }, () => randomInt(min, max))
}

/** 生成时间序列标签（最近 N 小时） */
export function generateTimeLabels(count: number): string[] {
  const labels: string[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const h = new Date(now.getTime() - i * 3600000)
    labels.push(`${String(h.getHours()).padStart(2, '0')}:00`)
  }
  return labels
}

/** 生成日期标签（最近 N 天） */
export function generateDateLabels(count: number): string[] {
  const labels: string[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`)
  }
  return labels
}

/** 随机选取数组中的 N 个元素 */
export function randomPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/** 生成带名称的数据数组 */
export function generateNamedData(
  names: string[],
  min: number,
  max: number
): { name: string; value: number }[] {
  return names.map(name => ({
    name,
    value: randomInt(min, max)
  }))
}

/** 格式化数字（千分位） */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN')
}

/** 格式化大数字（万/亿） */
export function formatBigNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(2) + '亿'
  if (num >= 10000) return (num / 10000).toFixed(2) + '万'
  return num.toString()
}
