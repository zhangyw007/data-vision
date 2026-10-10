// ==========================================
// Tooltip 自动轮播 composable
// ==========================================
import { onMounted, onBeforeUnmount } from 'vue'
import type * as echarts from 'echarts'

/**
 * 自动轮播 tooltip
 * @param getInstance 获取 ECharts 实例的方法
 * @param interval 轮播间隔（ms），默认 2000
 */
export function useAutoTooltip(
  getInstance: () => echarts.ECharts | null,
  interval = 2000
) {
  let timer: ReturnType<typeof setInterval> | null = null
  let currentIndex = 0
  let dataLength = 0

  function start(len: number) {
    dataLength = len
    stop()
    timer = setInterval(() => {
      const instance = getInstance()
      if (!instance || dataLength === 0) return

      // 先取消上一项的高亮
      instance.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex
      })

      // 移动到下一项
      currentIndex = (currentIndex + 1) % dataLength

      // 高亮当前项并显示 tooltip
      instance.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex
      })
      instance.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex
      })
    }, interval)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onBeforeUnmount(() => {
    stop()
  })

  return { start, stop }
}
