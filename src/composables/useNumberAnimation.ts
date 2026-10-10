// ==========================================
// 数字滚动动画 composable
// ==========================================
import { ref, watch, onBeforeUnmount, type Ref } from 'vue'

/**
 * 数字递增动画
 * @param target 目标值（响应式）
 * @param duration 动画时长（ms），默认 1500
 * @returns 当前显示的数字
 */
export function useNumberAnimation(
  target: Ref<number>,
  duration = 1500
) {
  const currentValue = ref(0)
  let animationFrame: number | null = null
  let startTime: number | null = null
  let startValue = 0

  function animate(timestamp: number) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)

    // easeOutCubic 缓动
    const eased = 1 - Math.pow(1 - progress, 3)
    currentValue.value = Math.round(startValue + (target.value - startValue) * eased)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  function startAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
    startValue = currentValue.value
    startTime = null
    animationFrame = requestAnimationFrame(animate)
  }

  // 监听目标值变化
  watch(target, () => {
    startAnimation()
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  })

  return { currentValue }
}
