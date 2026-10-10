<template>
  <!-- 右侧指标面板 -->
  <aside class="right-panel">
    <!-- 仪表盘 -->
    <BorderBox title="系统负载">
      <div class="right-panel__gauge">
        <GaugeChart :value="gaugeData.gaugeValue.value" title="CPU 负载" />
      </div>
    </BorderBox>

    <!-- 进度条 -->
    <BorderBox title="资源监控">
      <div class="right-panel__progress">
        <ProgressBar
          v-for="(item, index) in progressData.progressData.value"
          :key="index"
          :label="item.label"
          :percent="item.value"
          :color="item.color"
        />
      </div>
    </BorderBox>

    <!-- 排名列表 -->
    <BorderBox title="分公司业绩 Top 8">
      <RankList :data="rankData.rankData.value" :limit="8" />
    </BorderBox>

    <!-- 环形图 -->
    <BorderBox title="订单分布">
      <DonutChart :data="pieData.pieData.value" title="总订单" />
    </BorderBox>
  </aside>
</template>

<script setup lang="ts">
/**
 * RightPanel - 右侧指标面板
 * 包含仪表盘、进度条、排名列表、环形图
 */
import BorderBox from '@/components/common/BorderBox.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import RankList from '@/components/common/RankList.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import { useGaugeData, useProgressData, useRankData, usePieData } from '@/mock/chartData'

const gaugeData = useGaugeData()
const progressData = useProgressData()
const rankData = useRankData()
const pieData = usePieData()
</script>

<style scoped lang="scss">
.right-panel {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: $spacing-md;
  overflow: hidden;

  &__gauge {
    height: 100%;
  }

  &__progress {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    justify-content: center;
    height: 100%;
  }
}
</style>
