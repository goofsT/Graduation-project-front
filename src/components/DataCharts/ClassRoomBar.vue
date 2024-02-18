<template>
  <div class="chart-bar">
    <div ref="chart1"></div>
    <div ref="chart2"></div>
  </div>
</template>

<script setup lang="ts">
import {useClassRoomStore} from "@/store/ClassRoomStore.ts";
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from 'echarts'
type EChartsOption = echarts.EChartsOption
const chart1 = ref<HTMLElement | null>(null)
const chart2 = ref<HTMLElement | null>(null)
const timer=ref<any>(null)

/**
 * 初始化图表
 自动更新图表
 */
onMounted(()=>{
  initChart()
  timer.value=setInterval(()=>{
    updateChart()
  },3000)
})
/**
 * 销毁图表
 销毁定时器
 */
onBeforeUnmount(()=>{
  chart1.value && chart1.value.remove()
  chart2.value && chart2.value.remove()
  timer.value && clearInterval(timer.value)
})



//统计数量
const countData=(data)=>{
  //一教、二教数据
  const firstData={free:0,use:0,repair:0}
  const secondData={free:0,use:0,repair:0}
  data.forEach(item=>{
    if(item.roomName.includes('教')){
      if(item.buildingId==='1'){
        if(item.status==='0'){
          firstData.free++
        }else if(item.status==='1'){
          firstData.use++
        }else{
          firstData.repair++
        }
      }else{
        if(item.status==='0'){
          secondData.free++
        }else if(item.status==='1'){
          secondData.use++
        }else{
          secondData.repair++
        }
      }
    }
  })
  return {firstData,secondData}
}

//初始化图表
const initChart=async()=>{
  const chartDom = chart1.value
  const chartDom2 = chart2.value
  const myChart = echarts.init(chartDom)
  const myChart2 = echarts.init(chartDom2)
  const data=await useClassRoomStore().getClassRoom()
  const {firstData,secondData}=countData(data)
  let option1: EChartsOption
  let option2: EChartsOption
  option1 = getOption('1号教学楼',firstData)
  option2 = getOption('2号教学楼',secondData)
  option1 && myChart.setOption(option1);
  option2 && myChart2.setOption(option2);
}

const updateChart=async()=>{
  await useClassRoomStore().setClassRoom()
  const data=await useClassRoomStore().getClassRoom()
  const {firstData,secondData}=countData(data)
  let option1: EChartsOption
  let option2: EChartsOption
  option1 = getOption('1号教学楼',firstData)
  option2 = getOption('2号教学楼',secondData)
  const myChart = echarts.init(chart1.value)
  const myChart2 = echarts.init(chart2.value)
  option1 && myChart.setOption(option1);
  option2 && myChart2.setOption(option2);
}
const getOption=(title:any,data:any)=>{
  let option:EChartsOption
  option= {
    title:{
      text: title,
      left: 'center',
      bottom: '5%',
      textStyle: {
        color: '#247cf1',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      selectedMode: false,
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '占比',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '70%'],
        // adjust the start angle
        startAngle: 180,
        label: {
          show: true,
          position: 'inside',
          //颜色
          color: '#f8f3f6',
          formatter(param) {
            // correct the percentage
            return String(param.value) +'间';
          }
        },
        data: [
          { value: data.free, name: '空闲' },
          { value: data.use, name: '使用中' },
          { value: data.repair, name: '维修' },
          {
            value: data.free+data.use+data.repair,
            itemStyle: {
              color: 'none',
              decal: {
                symbol: 'none'
              }
            },
            label: {
              show: false
            }
          }
        ]
      }
    ]
  };
  return option
}
</script>

<style scoped lang="scss">
.chart-bar {
  width: 100%;
  height: 100%;
  display: flex;
  div{
    box-sizing: border-box;
    width: 50%;
    height: 80%;
  }
}
</style>