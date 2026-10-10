<template>
  <!-- 南丁格尔玫瑰图 -->
  <div ref="chartRef" class="rose-chart"></div>
</template>

<script setup lang="ts">
/**
 * RoseChart - 南丁格尔玫瑰图组件
 */
import { ref, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'

const props = defineProps<{
  data: { name: string; value: number }[]
}>()

const chartRef = ref<HTMLElement | null>(null)

const colors = ['#00d4ff', '#0066ff', '#00ff88', '#ffaa00', '#ff4757', '#a855f7', '#2ed573', '#ff6b81']

const chartOptions = computed<EChartsOption>(() => ({
  color: colors,
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(6, 25, 55, 0.9)',
    borderColor: '#00d4ff',
    textStyle: { color: '#e0f0ff', fontSize: 12 },
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    bottom: 5,
    textStyle: { color: 'rgba(160, 200, 240, 0.8)', fontSize: 10 },
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8
  },
  series: [{
    type: 'pie',
    radius: ['15%', '70%'],
    center: ['50%', '45%'],
    roseType: 'radius',
    data: props.data,
    label: {
      show: true,
      color: 'rgba(160, 200, 240, 0.8)',
      fontSize: 10
    },
    labelLine: {
      lineStyle: { color: 'rgba(0, 212, 255, 0.3)' }
    },
    itemStyle: {
      borderRadius: 4,
      borderColor: 'rgba(10, 25, 41, 0.8)',
      borderWidth: 2
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 20,
        shadowColor: 'rgba(0, 212, 255, 0.5)'
      }
    },
    animationType: 'scale',
    animationDuration: 1500
  }]
}))

useChart(chartRef, chartOptions)
</script>

<style scoped lang="scss">
.rose-chart {
  width: 100%;
  height: 100%;
}
</style>
