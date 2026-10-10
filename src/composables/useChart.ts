// ==========================================
// ECharts 实例管理 composable
// ==========================================
import { ref, onMounted, onBeforeUnmount, watch, nextTick, type Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

/**
 * 管理 ECharts 实例的生命周期
 * @param chartRef 图表容器 DOM 的 ref
 * @param options 图表配置（响应式）
 */
export function useChart(
  chartRef: Ref<HTMLElement | null>,
  options: Ref<EChartsOption> | EChartsOption
) {
  let chartInstance: echarts.ECharts | null = null
  let resizeObserver: ResizeObserver | null = null

  /** 初始化图表 */
  function initChart() {
    if (!chartRef.value) return
    chartInstance = echarts.init(chartRef.value, undefined, {
      renderer: 'canvas'
    })
    const opts = 'value' in options ? options.value : options
    chartInstance.setOption(opts as EChartsOption)
    // 延迟 resize 确保容器尺寸已确定
    nextTick(() => {
      chartInstance?.resize()
    })
  }

  /** 更新配置 */
  function updateChart(newOptions: EChartsOption, notMerge = false) {
    chartInstance?.setOption(newOptions, notMerge)
  }

  /** resize 处理 */
  function handleResize() {
    chartInstance?.resize()
  }

  /** 获取实例 */
  function getInstance() {
    return chartInstance
  }

  // 监听 window resize + 容器尺寸变化
  onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
    // 使用 ResizeObserver 监听容器尺寸变化
    if (chartRef.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      resizeObserver.observe(chartRef.value)
    }
  })

  // 监听 options 变化（如果是响应式的）
  if ('value' in options) {
    watch(options, (newOpts) => {
      if (chartInstance) {
        chartInstance.setOption(newOpts, { notMerge: false })
      }
    }, { deep: true })
  }

  // 清理
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    resizeObserver?.disconnect()
    chartInstance?.dispose()
    chartInstance = null
  })

  return {
    initChart,
    updateChart,
    handleResize,
    getInstance
  }
}
