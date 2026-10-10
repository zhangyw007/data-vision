<template>
  <!-- 雷达图 -->
  <div ref="chartRef" class="radar-chart"></div>
</template>

<script setup lang="ts">
/**
 * RadarChart - 雷达图组件
 */
import { ref, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'

const props = withDefaults(defineProps<{
  /** 维度名称 */
  indicators: { name: string; max: number }[]
  /** 数据系列 */
  seriesData: number[]
  /** 系列名称 */
  seriesName?: string
}>(), {
  seriesName: '数据'
})

const chartRef = ref<HTMLElement | null>(null)

const chartOptions = computed<EChartsOption>(() => ({
  tooltip: {
    backgroundColor: 'rgba(6, 25, 55, 0.9)',
    borderColor: '#00d4ff',
    textStyle: { color: '#e0f0ff', fontSize: 12 }
  },
  radar: {
    indicator: props.indicators,
    shape: 'polygon',
    radius: '65%',
    axisName: {
      color: 'rgba(160, 200, 240, 0.8)',
      fontSize: 10
    },
    splitArea: {
      areaStyle: {
        color: [
          'rgba(0, 212, 255, 0.02)',
          'rgba(0, 212, 255, 0.05)',
          'rgba(0, 212, 255, 0.02)',
          'rgba(0, 212, 255, 0.05)'
        ]
      }
    },
    axisLine: {
      lineStyle: { color: 'rgba(0, 212, 255, 0.15)' }
    },
    splitLine: {
      lineStyle: { color: 'rgba(0, 212, 255, 0.1)' }
    }
  },
  series: [{
    type: 'radar',
    data: [{
      value: props.seriesData,
      name: props.seriesName,
      areaStyle: {
        color: 'rgba(0, 212, 255, 0.15)'
      },
      lineStyle: {
        color: '#00d4ff',
        width: 2
      },
      itemStyle: {
        color: '#00d4ff',
        borderColor: '#00d4ff',
        borderWidth: 2
      },
      symbol: 'circle',
      symbolSize: 6
    }],
    animationDuration: 1500
  }]
}))

useChart(chartRef, chartOptions)
</script>

<style scoped lang="scss">
.radar-chart {
  width: 100%;
  height: 100%;
}
</style>
