// ==========================================
// 全局动画开关控制
// ==========================================
import { ref, provide, inject } from 'vue'

const ANIMATION_KEY = Symbol('animation-enabled')

/** 在根组件调用，提供动画开关 */
export function provideAnimationControl() {
  const animationEnabled = ref(true)

  function toggleAnimation() {
    animationEnabled.value = !animationEnabled.value
  }

  provide(ANIMATION_KEY, {
    animationEnabled,
    toggleAnimation
  })

  return { animationEnabled, toggleAnimation }
}

/** 在子组件调用，获取动画状态 */
export function useAnimationControl() {
  const ctx = inject<{
    animationEnabled: import('vue').Ref<boolean>
    toggleAnimation: () => void
  }>(ANIMATION_KEY)

  if (!ctx) {
    // 兜底：如果没有 provide，默认开启
    return {
      animationEnabled: ref(true),
      toggleAnimation: () => {}
    }
  }

  return ctx
}
