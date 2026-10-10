// ==========================================
// 大屏缩放 composable
// ==========================================
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { calcScale } from '@/utils/scale'

/**
 * 大屏自适应缩放 hook
 * 返回 scale 值和容器 ref，用于 transform 缩放
 */
export function useScale() {
  const scale = ref(1)
  const scaleX = ref(1)
  const scaleY = ref(1)

  function updateScale() {
    const result = calcScale()
    scale.value = result.scale
    scaleX.value = result.scaleX
    scaleY.value = result.scaleY
  }

  onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScale)
  })

  return { scale, scaleX, scaleY }
}
