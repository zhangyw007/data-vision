<template>
  <!-- 底部信息栏 -->
  <footer class="dashboard-footer">
    <div class="dashboard-footer__left">
      <span class="dashboard-footer__label">系统状态：</span>
      <span class="dashboard-footer__status">
        <span class="status-dot"></span>
        运行正常
      </span>
    </div>
    <div class="dashboard-footer__center">
      <ScrollText :messages="alertMessages.messages.value" direction="horizontal" :speed="30" :show-time="false" />
    </div>
    <div class="dashboard-footer__right">
      <span>技术支持：数据可视化团队</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
/**
 * Footer - 底部信息栏
 * 包含系统状态、滚动字幕
 */
import ScrollText from '@/components/common/ScrollText.vue'
import { useAlertMessages } from '@/mock/chartData'

const alertMessages = useAlertMessages()
</script>

<style scoped lang="scss">
.dashboard-footer {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-xl;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
  background: linear-gradient(0deg, rgba(0, 212, 255, 0.05) 0%, transparent 100%);

  &__left,
  &__right {
    width: 250px;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-xs;
    color: $text-muted;
  }

  &__right {
    justify-content: flex-end;
  }

  &__center {
    flex: 1;
    overflow: hidden;
  }

  &__label {
    color: $text-muted;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 4px;
    color: $success;
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: $success;
  box-shadow: 0 0 6px $success;
  animation: breathe 2s ease-in-out infinite;
}
</style>
