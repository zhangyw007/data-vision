<template>
  <!-- 散点图 -->
  <div ref="chartRef" class="scatter-chart"></div>
</template>

<script setup lang="ts">
/**
 * ScatterChart - 散点图组件
 */
import { ref, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'

const props = withDefaults(defineProps<{
  /** 散点数据 [x, y][] */
  data: [number, number][]
  /** 系列名称 */
  seriesName?: string
  /** 点大小 */
  symbolSize?: number
}>(), {
  seriesName: '数据',
  symbolSize: 8
})

const chartRef = ref<HTMLElement | null>(null)

const chartOptions = computed<EChartsOption>(() => ({
  grid: { top: 30, right: 20, bottom: 30, left: 50 },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(6, 25, 55, 0.9)',
    borderColor: '#00d4ff',
    textStyle: { color: '#e0f0ff', fontSize: 12 },
    formatter: (params: any) => {
      return `${props.seriesName}<br/>X: ${params.value[0]}<br/>Y: ${params.value[1]}`
    }
  },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.06)' } },
    axisLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.2)' } },
    axisLabel: { color: 'rgba(160, 200, 240, 0.6)', fontSize: 10 }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.06)' } },
    axisLine: { show: false },
    axisLabel: { color: 'rgba(160, 200, 240, 0.6)', fontSize: 10 }
  },
  series: [{
    name: props.seriesName,
    type: 'scatter',
    data: props.data,
    symbolSize: props.symbolSize,
    itemStyle: {
      color: '#00d4ff',
      shadowBlur: 10,
      shadowColor: 'rgba(0, 212, 255, 0.5)'
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 20,
        shadowColor: 'rgba(0, 212, 255, 0.8)'
      }
    },
    animationDuration: 1500
  }]
}))

useChart(chartRef, chartOptions)
</script>

<style scoped lang="scss">
.scatter-chart {
  width: 100%;
  height: 100%;
}
</style>
