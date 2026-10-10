<template>
  <!-- 柱状图 -->
  <div ref="chartRef" class="bar-chart"></div>
</template>

<script setup lang="ts">
/**
 * BarChart - 柱状图组件
 * 支持渐变柱体、圆角、tooltip 自动轮播
 */
import { ref, computed, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'
import { useAutoTooltip } from '@/composables/useAutoTooltip'

const props = withDefaults(defineProps<{
  xData: string[]
  seriesData: number[]
  seriesName?: string
  barColor?: string
  barWidth?: number | string
  autoTooltip?: boolean
}>(), {
  seriesName: '数据',
  barColor: '#00d4ff',
  barWidth: '40%',
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
    type: 'bar',
    data: props.seriesData,
    barWidth: props.barWidth,
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: props.barColor },
          { offset: 1, color: props.barColor + '30' }
        ]
      }
    },
    animationDuration: 1500,
    animationEasing: 'elasticOut'
  }]
}))

const { getInstance } = useChart(chartRef, chartOptions)

if (props.autoTooltip) {
  const { start } = useAutoTooltip(getInstance, 2000)
  watch(() => props.seriesData, (val) => {
    if (val.length > 0) start(val.length)
  }, { immediate: true })
}
</script>

<style scoped lang="scss">
.bar-chart {
  width: 100%;
  height: 100%;
}
</style>
