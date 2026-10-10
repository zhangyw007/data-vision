<template>
  <!-- 中间主图表区域 -->
  <main class="center-panel">
    <!-- 上部：中国地图 -->
    <BorderBox title="全国数据分布" class="center-panel__map">
      <MapChart :data="mapData.mapData.value" />
    </BorderBox>

    <!-- 下部：两个并排图表 -->
    <div class="center-panel__bottom">
      <BorderBox title="营收趋势" class="center-panel__chart">
        <LineChart
          :x-data="lineData.xData.value"
          :series-data="lineData.seriesData.value"
          series-name="营收"
        />
      </BorderBox>
      <BorderBox title="业务指标" class="center-panel__chart">
        <RadarChart
          :indicators="radarData.indicators"
          :series-data="radarData.seriesData.value"
          series-name="综合指标"
        />
      </BorderBox>
    </div>
  </main>
</template>

<script setup lang="ts">
/**
 * CenterPanel - 中间主图表区域
 * 包含地图、折线图、雷达图
 */
import BorderBox from '@/components/common/BorderBox.vue'
import MapChart from '@/components/charts/MapChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import RadarChart from '@/components/charts/RadarChart.vue'
import { useMapData, useLineData, useRadarData } from '@/mock/chartData'

const mapData = useMapData()
const lineData = useLineData()
const radarData = useRadarData()
</script>

<style scoped lang="scss">
.center-panel {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 3fr 2fr;
  gap: $spacing-md;
  overflow: hidden;

  &__bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;
    min-height: 0;
  }
}
</style>
