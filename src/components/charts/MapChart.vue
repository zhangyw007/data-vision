<template>
  <!-- 中国地图 -->
  <div ref="chartRef" class="map-chart"></div>
</template>

<script setup lang="ts">
/**
 * MapChart - 中国地图组件
 * 使用内联简化版 GeoJSON 数据
 */
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useChart } from '@/composables/useChart'
import { getChinaGeoJSON } from '@/mock/mapData'

const props = defineProps<{
  data: { name: string; value: number }[]
}>()

const chartRef = ref<HTMLElement | null>(null)
let mapRegistered = false

const chartOptions = computed<EChartsOption>(() => {
  const maxVal = Math.max(...props.data.map(d => d.value), 1)
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(6, 25, 55, 0.9)',
      borderColor: '#00d4ff',
      textStyle: { color: '#e0f0ff', fontSize: 12 },
      formatter: (params: any) => {
        return `${params.name}<br/>数据量: ${params.value || 0}`
      }
    },
    visualMap: {
      min: 0,
      max: maxVal,
      left: 10,
      bottom: 10,
      text: ['高', '低'],
      textStyle: { color: 'rgba(160, 200, 240, 0.8)', fontSize: 10 },
      inRange: {
        color: ['#0a1929', '#003366', '#0066cc', '#00aaff', '#00d4ff']
      },
      calculable: true
    },
    geo: {
      map: 'china',
      roam: false,
      zoom: 1.2,
      center: [104, 36],
      label: {
        show: true,
        color: 'rgba(160, 200, 240, 0.6)',
        fontSize: 8
      },
      itemStyle: {
        areaColor: '#0a1929',
        borderColor: '#00d4ff',
        borderWidth: 1,
        shadowColor: 'rgba(0, 212, 255, 0.3)',
        shadowBlur: 10
      },
      emphasis: {
        label: { color: '#fff', fontSize: 10 },
        itemStyle: {
          areaColor: '#0066cc',
          borderColor: '#00d4ff',
          borderWidth: 2,
          shadowColor: 'rgba(0, 212, 255, 0.6)',
          shadowBlur: 20
        }
      }
    },
    series: [{
      type: 'map',
      map: 'china',
      geoIndex: 0,
      data: props.data
    }]
  }
})

// 注册地图（只注册一次）
onMounted(() => {
  if (!mapRegistered) {
    const geoJSON = getChinaGeoJSON()
    echarts.registerMap('china', geoJSON as any)
    mapRegistered = true
  }
})

useChart(chartRef, chartOptions)
</script>

<style scoped lang="scss">
.map-chart {
  width: 100%;
  height: 100%;
}
</style>
