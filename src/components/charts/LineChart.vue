<template>
  <!-- 折线图 -->
  <div ref="chartRef" class="line-chart"></div>
</template>

<script setup lang="ts">
/**
 * LineChart - 折线图组件
 * 支持渐变填充、平滑曲线、tooltip 自动轮播
 */
import { ref, computed, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'
import { useAutoTooltip } from '@/composables/useAutoTooltip'

const props = withDefaults(defineProps<{
  /** X 轴标签 */
  xData: string[]
  /** 数据系列 */
  seriesData: number[]
  /** 系列名称 */
  seriesName?: string
  /** 线条颜色 */
  lineColor?: string
  /** 是否平滑曲线 */
  smooth?: boolean
  /** 是否显示 area 填充 */
  showArea?: boolean
  /** 是否自动轮播 tooltip */
  autoTooltip?: boolean
}>(), {
  seriesName: '数据',
  lineColor: '#00d4ff',
  smooth: true,
  showArea: true,
  autoTooltip: true
})

const chartRef = ref<HTMLElement | null>(null)

const chartOptions = computed<EChartsOption>(() => ({
  grid: { top: 30, right: 15, bottom: 25, left: 45 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(6, 25, 55, 0.9)',
    borderColor: '#00d4ff',
    textStyle: { color: '#e0f0ff', fontSize: 12 }
  },
  xAxis: {
    type: 'category',
    data: props.xData,
    axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.2)' } },
    axisLabel: { color: 'rgba(160, 200, 240, 0.6)', fontSize: 10 },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.06)' } },
    axisLabel: { color: 'rgba(160, 200, 240, 0.6)', fontSize: 10 },
    axisLine: { show: false }
  },
  series: [{
    name: props.seriesName,
    type: 'line',
    data: props.seriesData,
    smooth: props.smooth,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { width: 2, color: props.lineColor },
    itemStyle: { color: props.lineColor },
    areaStyle: props.showArea ? {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: props.lineColor + '40' },
          { offset: 1, color: props.lineColor + '05' }
        ]
      }
    } : undefined,
    animationDuration: 1500
  }]
}))

const { getInstance } = useChart(chartRef, chartOptions)

// tooltip 自动轮播
if (props.autoTooltip) {
  const { start } = useAutoTooltip(getInstance, 3000)
  watch(() => props.seriesData, (val) => {
    if (val.length > 0) start(val.length)
  }, { immediate: true })
}
</script>

<style scoped lang="scss">
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
