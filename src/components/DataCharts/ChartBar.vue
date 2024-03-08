<template>
  <div class="chart-bar" ref="chartRef"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from 'echarts'
import{getStudentNumToday} from "@/api/ClassRoom.ts";
import { ElMessage } from "element-plus";
type EChartsOption = echarts.EChartsOption
const chartRef = ref<HTMLElement | null>(null)
const chartData = ref<any>(null)
onMounted(() => {
  getData()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {})
})


const getData = async () => {
  const res = await getStudentNumToday()
  if(res.code !== 200) return ElMessage.warning('获取人员数据失败')
  chartData.value = res.data.filter(item=>{return item.buildingId === 1})
  const date=[]
  const num=[]
  chartData.value.forEach(item=>{
    num.push(item.num)
    date.push(item.time.slice(11,16))
  })
  setChart(date,num)
}

const setChart=(dateArr,numArr)=>{
  const chartDom = chartRef.value
  const myChart = echarts.init(chartDom)
  let option: EChartsOption
  option = {
    title: {
      text: '1号楼上课人数',
      left: 'center',
      textStyle: {
        color: '#15e7e1',
      },
    },
    backgroundColor: '#0f375f',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b}：{c}人',
    },
    xAxis: {
      name:'时间',
      data: dateArr,
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },
    yAxis: {
      name:'人数',
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },
    series: [
      {
        name: 'line',
        type: 'line',
        smooth: true,
        showAllSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 15,
        data: numArr,
      },
      {
        name: 'bar',
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          borderRadius: 5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#14c8d4' },
            { offset: 1, color: '#43eec6' },
          ]),
        },
        data: numArr,
      },
      {
        name: 'line',
        type: 'bar',
        barGap: '-100%',
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(20,200,212,0.5)' },
            { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
            { offset: 1, color: 'rgba(20,200,212,0)' },
          ]),
        },
        z: -12,
        data: numArr,
      },
      {
        name: 'dotted',
        type: 'pictorialBar',
        symbol: 'rect',
        itemStyle: {
          color: '#0f375f',
        },
        symbolRepeat: true,
        symbolSize: [12, 4],
        symbolMargin: 1,
        z: -10,
        data: numArr,
      },
    ],
  }
  option && myChart.setOption(option)
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}
</script>
<style scoped lang="scss">
.chart-bar {
  width: 100%;
  height: 90%;
}
</style>
