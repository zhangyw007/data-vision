<template>
  <!-- 饼图 -->
  <div ref="chartRef" class="pie-chart"></div>
</template>

<script setup lang="ts">
/**
 * PieChart - 饼图组件
 */
import { ref, computed, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'
import { useAutoTooltip } from '@/composables/useAutoTooltip'

const props = withDefaults(defineProps<{
  data: { name: string; value: number }[]
  radius?: string[]
  showLabel?: boolean
  autoTooltip?: boolean
}>(), {
  radius: () => ['0%', '65%'],
  showLabel: true,
  autoTooltip: true
})

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
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { color: 'rgba(160, 200, 240, 0.8)', fontSize: 10 },
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8
  },
  series: [{
    type: 'pie',
    radius: props.radius,
    center: ['40%', '50%'],
    data: props.data,
    label: {
      show: props.showLabel,
      color: 'rgba(160, 200, 240, 0.8)',
      fontSize: 10,
      formatter: '{b}\n{d}%'
    },
    labelLine: {
      lineStyle: { color: 'rgba(0, 212, 255, 0.3)' }
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

const { getInstance } = useChart(chartRef, chartOptions)

if (props.autoTooltip) {
  const { start } = useAutoTooltip(getInstance, 3000)
  watch(() => props.data, (val) => {
    if (val.length > 0) start(val.length)
  }, { immediate: true })
}
</script>

<style scoped lang="scss">
.pie-chart {
  width: 100%;
  height: 100%;
}
</style>
