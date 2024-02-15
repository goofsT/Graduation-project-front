<template>
  <div class="chart-bar" ref="chartRef"></div>
</template>

<script setup lang="ts">
import {useDeviceStore} from "@/store/deviceStore.ts";
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
type EChartsOption = echarts.EChartsOption
const chartRef = ref<HTMLElement | null>(null)



onMounted(()=>{
  initChart()
})


//处理数据
const handleData=(data)=>{
  const arr=[
    {name:'灯光',totalNum:0,normalNum:0,repairNum:0},
    {name:'门',totalNum:0,normalNum:0,repairNum:0},
    {name:'消防栓',totalNum:0,normalNum:0,repairNum:0},
  ]
  data.forEach((item)=>{
    if(item.deviceType=='0'){
      arr[0].totalNum++
      if(item.deviceStatus=='0'){
        arr[0].normalNum++
      }else{
        arr[0].repairNum++
      }
    }else if(item.deviceType=='1'){
      arr[1].totalNum++
      if(item.deviceStatus=='0'){
        arr[1].normalNum++
      }else{
        arr[1].repairNum++
      }
    }else if(item.deviceType=='2'){
      arr[2].totalNum++
      if(item.deviceStatus=='0'){
        arr[2].normalNum++
      }else{
        arr[2].repairNum++
      }
    }
  })
  return arr
}
//初始化图表
const initChart=async()=>{
  const chartDom = chartRef.value
  const myChart = echarts.init(chartDom)
  const data=await useDeviceStore().getDeviceInfo()
  const deviceInfo=handleData(data)
  let option: EChartsOption
  option = {
    title: {
      text: '设备总数据',
      textStyle: {
        color: '#3889f1'
      },
      //位置
      left: 'center',
      top: '10%'
    },
    grid: {
      top: '30%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show:true,
      data: ['总设备数', '正常设备数', '维修设备数'],
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: [
      {
        type: 'category',
        data: ['灯光', '门', '消防栓'],
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          color: '#fff'
        },
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '数量',
        min: 0,
        max: 40,
        interval: 10,
        axisLabel: {
          formatter: '{value}'
        }
      },
    ],
    series: [
      {
        name: '总设备数',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return String(value) ;
          }
        },
        //柱子上方的数字
        label: {
          show: true,
          position: 'top',
          color: '#30b7e0'
        },
        data: [deviceInfo[0].totalNum, deviceInfo[1].totalNum, deviceInfo[2].totalNum]
      },
      {
        name: '正常设备数',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return String(value) ;
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#30b7e0'
        },
        data: [deviceInfo[0].normalNum, deviceInfo[1].normalNum, deviceInfo[2].normalNum]
      },
      {
        name: '维修设备数',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return String(value) ;
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#30b7e0'
        },
        data: [deviceInfo[0].repairNum, deviceInfo[1].repairNum, deviceInfo[2].repairNum]
      },
    ]
  };
  option && myChart.setOption(option);
}
</script>

<style scoped lang="scss">
.chart-bar {
  width: 100%;
  height: 90%;
}
</style>