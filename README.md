# 企业数据大屏可视化

> 基于 Vue3 + ECharts + TypeScript + Vite 构建的企业级数据大屏可视化项目

## 项目介绍

本项目是一套**完整可直接运行**的企业数据大屏可视化解决方案，采用深色炫酷科技风格，内置多种图表组件和动态效果，全部使用模拟数据，无需后端接口即可预览完整效果。

### 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4+ | 渐进式 JavaScript 框架 |
| ECharts | 5.5+ | 百度开源图表库 |
| TypeScript | 5+ | 类型安全 |
| Vite | 5+ | 下一代前端构建工具 |
| SCSS | - | CSS 预处理器 |

### 功能特性

- **16:9 标准大屏布局**：顶部标题栏、左侧统计卡片、中间主图表、右侧指标面板、底部信息栏
- **15+ 可复用组件**：折线图、柱状图、饼图、地图、仪表盘、雷达图、散点图等
- **深色科技风格**：网格背景、流光边框、扫描线、渐变光晕、数字滚动动画
- **自适应缩放**：基于 `transform: scale()` 的大屏自适应方案
- **实时数据模拟**：`setInterval` 定时刷新数据，模拟真实数据流
- **动画控制**：支持一键开启/关闭所有动画效果
- **主题色系统**：SCSS 变量统一管理，修改一处即可全局换肤

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8 或 pnpm >= 7

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/zhangyw007/data-vision.git
cd data-vision

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

启动后访问 `http://localhost:3000` 即可查看大屏效果。

## 项目结构

```
data-vision/
├── index.html                  # 入口 HTML
├── package.json                # 项目配置
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
├── README.md                   # 项目文档
├── src/
│   ├── main.ts                 # 应用入口
│   ├── App.vue                 # 根组件
│   ├── styles/
│   │   ├── variables.scss      # 主题色变量（修改此文件换肤）
│   │   ├── global.scss         # 全局样式
│   │   └── mixins.scss         # SCSS Mixin
│   ├── types/
│   │   └── index.ts            # 通用类型定义
│   ├── utils/
│   │   ├── mock.ts             # 模拟数据工具
│   │   ├── animation.ts        # 动画开关控制
│   │   └── scale.ts            # 缩放工具
│   ├── composables/
│   │   ├── useChart.ts         # ECharts 生命周期管理
│   │   ├── useAutoTooltip.ts   # Tooltip 自动轮播
│   │   ├── useNumberAnimation.ts # 数字滚动动画
│   │   └── useScale.ts         # 缩放 Hook
│   ├── components/
│   │   ├── common/             # 通用 UI 组件
│   │   │   ├── BorderBox.vue   # 流光边框容器
│   │   │   ├── NumberFlip.vue  # 数字翻牌器
│   │   │   ├── ScrollText.vue  # 滚动字幕
│   │   │   ├── ProgressBar.vue # 进度条
│   │   │   └── RankList.vue    # 排名列表
│   │   └── charts/             # 图表组件
│   │       ├── LineChart.vue   # 折线图
│   │       ├── BarChart.vue    # 柱状图
│   │       ├── BarHorizontal.vue # 横向柱状图
│   │       ├── PieChart.vue    # 饼图
│   │       ├── DonutChart.vue  # 环形图
│   │       ├── RoseChart.vue   # 南丁格尔玫瑰图
│   │       ├── MapChart.vue    # 中国地图
│   │       ├── GaugeChart.vue  # 仪表盘
│   │       ├── RadarChart.vue  # 雷达图
│   │       └── ScatterChart.vue # 散点图
│   ├── layout/                 # 布局组件
│   │   ├── Header.vue          # 顶部标题栏
│   │   ├── LeftPanel.vue       # 左侧面板
│   │   ├── CenterPanel.vue     # 中间面板
│   │   ├── RightPanel.vue      # 右侧面板
│   │   ├── Footer.vue          # 底部信息栏
│   │   └── DashboardLayout.vue # 主布局
│   └── mock/                   # 模拟数据
│       ├── chartData.ts        # 图表数据
│       └── mapData.ts          # 地图 GeoJSON
```

## 组件使用示例

### 折线图

```vue
<template>
  <LineChart
    :x-data="['1月', '2月', '3月']"
    :series-data="[100, 200, 150]"
    series-name="销售额"
    line-color="#00d4ff"
  />
</template>

<script setup>
import LineChart from '@/components/charts/LineChart.vue'
</script>
```

### 数字翻牌器

```vue
<template>
  <NumberFlip :value="1286543" suffix="人" />
</template>

<script setup>
import NumberFlip from '@/components/common/NumberFlip.vue'
</script>
```

### 流光边框容器

```vue
<template>
  <BorderBox title="图表标题">
    <!-- 放入任意图表内容 -->
    <LineChart ... />
  </BorderBox>
</template>

<script setup>
import BorderBox from '@/components/common/BorderBox.vue'
</script>
```

## 自定义主题

修改 `src/styles/variables.scss` 中的变量即可全局换肤：

```scss
// 主色调
$primary: #00d4ff;

// 背景色
$bg-dark: #0a1929;

// 文字色
$text-primary: #e0f0ff;
```

## 截图说明

| 区域 | 说明 |
|------|------|
| 顶部 | 标题 + 日期时间 + 动画开关 |
| 左侧 | 4 个统计卡片 + 柱状图 + 横向柱状图 |
| 中间 | 中国地图 + 折线图 + 雷达图 |
| 右侧 | 仪表盘 + 进度条 + 排名列表 + 环形图 |
| 底部 | 系统状态 + 滚动告警字幕 |

> 提示：首次加载会有加载动画效果，数据每 5~10 秒自动刷新模拟实时数据流。

## 开源协议

MIT License

---

如果本项目对你有帮助，欢迎 Star 支持！
