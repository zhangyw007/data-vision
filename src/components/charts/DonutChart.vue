<template>
  <!-- 环形图 -->
  <div ref="chartRef" class="donut-chart"></div>
</template>

<script setup lang="ts">
/**
 * DonutChart - 环形图组件
 * 中心显示总数
 */
import { ref, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'

const props = withDefaults(defineProps<{
  data: { name: string; value: number }[]
  title?: string
}>(), {
  title: '总计'
})

const chartRef = ref<HTMLElement | null>(null)

const colors = ['#00d4ff', '#0066ff', '#00ff88', '#ffaa00', '#ff4757', '#a855f7']

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

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
  graphic: [{
    type: 'group',
    left: 'center',
    top: '38%',
    children: [
      {
        type: 'text',
        style: {
          text: props.title,
          textAlign: 'center',
          fill: 'rgba(160, 200, 240, 0.6)',
          fontSize: 12
        },
        top: -20
      },
      {
        type: 'text',
        style: {
          text: total.value.toLocaleString(),
          textAlign: 'center',
          fill: '#00d4ff',
          fontSize: 22,
          fontWeight: 'bold',
          fontFamily: 'DIN Alternate, monospace'
        }
      }
    ]
  }],
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['50%', '45%'],
    avoidLabelOverlap: false,
    label: { show: false },
    emphasis: {
      scaleSize: 8,
      itemStyle: {
        shadowBlur: 20,
        shadowColor: 'rgba(0, 212, 255, 0.5)'
      }
    },
    data: props.data,
    animationType: 'scale',
    animationDuration: 1500
  }]
}))

useChart(chartRef, chartOptions)
</script>

<style scoped lang="scss">
.donut-chart {
  width: 100%;
  height: 100%;
}
</style>
