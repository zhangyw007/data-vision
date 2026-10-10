<template>
  <!-- 横向柱状图 -->
  <div ref="chartRef" class="bar-horizontal"></div>
</template>

<script setup lang="ts">
/**
 * BarHorizontal - 横向柱状图组件
 */
import { ref, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'

const props = withDefaults(defineProps<{
  yData: string[]
  seriesData: number[]
  seriesName?: string
  barColor?: string
}>(), {
  seriesName: '数据',
  barColor: '#00d4ff'
})

const chartRef = ref<HTMLElement | null>(null)

const chartOptions = computed<EChartsOption>(() => ({
  grid: { top: 15, right: 40, bottom: 15, left: 80 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(6, 25, 55, 0.9)',
    borderColor: '#00d4ff',
    textStyle: { color: '#e0f0ff', fontSize: 12 }
  },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.06)' } },
    axisLabel: { show: false },
    axisLine: { show: false }
  },
  yAxis: {
    type: 'category',
    data: props.yData,
    inverse: true,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: 'rgba(160, 200, 240, 0.8)', fontSize: 11 }
  },
  series: [{
    name: props.seriesName,
    type: 'bar',
    data: props.seriesData,
    barWidth: '50%',
    itemStyle: {
      borderRadius: [0, 4, 4, 0],
      color: {
        type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
        colorStops: [
          { offset: 0, color: props.barColor + '30' },
          { offset: 1, color: props.barColor }
        ]
      }
    },
    label: {
      show: true,
      position: 'right',
      color: 'rgba(160, 200, 240, 0.8)',
      fontSize: 10
    },
    animationDuration: 1500
  }]
}))

useChart(chartRef, chartOptions)
</script>

<style scoped lang="scss">
.bar-horizontal {
  width: 100%;
  height: 100%;
}
</style>
