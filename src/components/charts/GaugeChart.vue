<template>
  <!-- 仪表盘 -->
  <div ref="chartRef" class="gauge-chart"></div>
</template>

<script setup lang="ts">
/**
 * GaugeChart - 仪表盘组件
 */
import { ref, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'

const props = withDefaults(defineProps<{
  /** 当前值 */
  value: number
  /** 最大值 */
  max?: number
  /** 标题 */
  title?: string
  /** 单位 */
  unit?: string
}>(), {
  max: 100,
  title: '完成率',
  unit: '%'
})

const chartRef = ref<HTMLElement | null>(null)

const chartOptions = computed<EChartsOption>(() => ({
  series: [{
    type: 'gauge',
    startAngle: 220,
    endAngle: -40,
    min: 0,
    max: props.max,
    radius: '90%',
    progress: {
      show: true,
      width: 12,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#0066ff' },
            { offset: 1, color: '#00d4ff' }
          ]
        }
      }
    },
    axisLine: {
      lineStyle: {
        width: 12,
        color: [[1, 'rgba(0, 212, 255, 0.1)']]
      }
    },
    axisTick: {
      distance: -18,
      length: 4,
      lineStyle: { color: 'rgba(0, 212, 255, 0.3)', width: 1 }
    },
    splitLine: {
      distance: -22,
      length: 8,
      lineStyle: { color: 'rgba(0, 212, 255, 0.4)', width: 2 }
    },
    axisLabel: {
      distance: -12,
      color: 'rgba(160, 200, 240, 0.5)',
      fontSize: 9
    },
    pointer: {
      length: '55%',
      width: 4,
      itemStyle: {
        color: '#00d4ff',
        shadowColor: 'rgba(0, 212, 255, 0.5)',
        shadowBlur: 10
      }
    },
    anchor: {
      show: true,
      size: 8,
      itemStyle: {
        color: '#00d4ff',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 4
      }
    },
    title: {
      show: true,
      offsetCenter: [0, '70%'],
      fontSize: 12,
      color: 'rgba(160, 200, 240, 0.8)'
    },
    detail: {
      valueAnimation: true,
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'DIN Alternate, monospace',
      offsetCenter: [0, '45%'],
      formatter: `{value}${props.unit}`,
      color: '#00d4ff'
    },
    data: [{
      value: props.value,
      name: props.title
    }],
    animationDuration: 2000
  }]
}))

useChart(chartRef, chartOptions)
</script>

<style scoped lang="scss">
.gauge-chart {
  width: 100%;
  height: 100%;
}
</style>
