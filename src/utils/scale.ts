// ==========================================
// 大屏自适应缩放工具
// ==========================================

/** 设计稿尺寸 */
const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

/**
 * 计算缩放比例
 * @returns { scaleX, scaleY, scale } 缩放值
 */
export function calcScale() {
  const width = window.innerWidth
  const height = window.innerHeight
  const scaleX = width / DESIGN_WIDTH
  const scaleY = height / DESIGN_HEIGHT
  // 使用较小的缩放比，保证完整显示
  const scale = Math.min(scaleX, scaleY)
  return { scaleX, scaleY, scale, width, height }
}
