<template>
  <!-- 16:9 大屏主布局 -->
  <div class="dashboard-layout" ref="layoutRef" :style="layoutStyle">
    <div class="dashboard-layout__header">
      <Header />
    </div>
    <div class="dashboard-layout__body">
      <div class="dashboard-layout__left">
        <LeftPanel />
      </div>
      <div class="dashboard-layout__center">
        <CenterPanel />
      </div>
      <div class="dashboard-layout__right">
        <RightPanel />
      </div>
    </div>
    <div class="dashboard-layout__footer">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * DashboardLayout - 16:9 大屏主布局
 * 使用 transform scale 自适应缩放
 */
import { ref, computed } from 'vue'
import { useScale } from '@/composables/useScale'
import Header from './Header.vue'
import LeftPanel from './LeftPanel.vue'
import CenterPanel from './CenterPanel.vue'
import RightPanel from './RightPanel.vue'
import Footer from './Footer.vue'

const { scale } = useScale()
const layoutRef = ref<HTMLElement | null>(null)

const layoutStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'center center'
}))
</script>

<style scoped lang="scss">
.dashboard-layout {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  background: $bg-dark;
  position: relative;
  overflow: hidden;

  &__header {
    height: 70px;
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    display: flex;
    gap: $spacing-md;
    padding: $spacing-md;
    min-height: 0;
  }

  &__left {
    width: 400px;
    flex-shrink: 0;
    overflow: hidden;
    height: 100%;
  }

  &__center {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    height: 100%;
  }

  &__right {
    width: 350px;
    flex-shrink: 0;
    overflow: hidden;
    height: 100%;
  }

  &__footer {
    height: 36px;
    flex-shrink: 0;
  }
}
</style>
