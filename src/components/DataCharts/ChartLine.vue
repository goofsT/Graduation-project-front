<template>
  <div ref="chartLineRef" class="chart-line"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
type EChartsOption = echarts.EChartsOption
const chartLineRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const chartDom = chartLineRef.value
  const myChart = echarts.init(chartDom)
  let option: EChartsOption

  option = {
    title: {
      text: '上月设备异常统计',
      left: 'center',
      textStyle: {
        color: '#fff',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['火灾报警', '人员离岗', '通道占用', '设备损坏'],
      left: 'center',
      top: '30',
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: {
        color: '#fff',
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
      },
    },
    series: [
      {
        name: '火灾报警',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '人员离岗',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '通道占用',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '设备损坏',
        type: 'line',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
    ],
  }

  option && myChart.setOption(option)
})
</script>

<style scoped lang="scss">
.chart-line {
  width: 100%;
  height: 100%;
}
</style>
