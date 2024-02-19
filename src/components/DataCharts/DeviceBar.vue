<template>
  <div class="chart-bar" ref="chartRef"></div>
</template>

<script setup lang="ts">
import {useDeviceStore} from "@/store/deviceStore.ts";
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
type EChartsOption = echarts.EChartsOption
const chartRef = ref<HTMLElement | null>(null)
const myChart = ref<echarts.ECharts | null>(null)


onMounted(()=>{
  setChart()
  setInterval(()=>{
    updateChart()
  },60000)
})


//处理数据
const handleData=(data)=>{
  const arr=[
    {name:'灯光',openNum:0,closeNum:0,repairNum:0},
    {name:'门',openNum:0,closeNum:0,repairNum:0},
    {name:'消防栓',openNum:0,closeNum:0,repairNum:0},
  ]
  data.forEach((item)=>{
    if(item.deviceType=='0'){
      if(item.deviceStatus=='0'){
        arr[0].openNum++
      }else if(item.deviceStatus==='1'){
        arr[0].closeNum++
      }else{
        arr[0].repairNum++
      }
    }else if(item.deviceType=='1'){
      if(item.deviceStatus=='0'){
        arr[1].openNum++
      }else if(item.deviceStatus==='1'){
        arr[1].closeNum++
      }else {
        arr[1].repairNum++
      }
    }else if(item.deviceType=='2'){
      if(item.deviceStatus=='0'){
        arr[2].openNum++
      }else if(item.deviceStatus==='1'){
        arr[2].closeNum++
      }else {
        arr[2].repairNum++
      }
    }
  })
  return arr
}
//初始化图表
const setChart=async()=>{
  const chartDom = chartRef.value
  myChart.value = echarts.init(chartDom)
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
      data: ['正常使用设备数', '关闭设备数', '维修设备数'],
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
        name: '正常使用设备数',
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
        data: [deviceInfo[0].openNum, deviceInfo[1].openNum, deviceInfo[2].openNum]
      },
      {
        name: '关闭设备数',
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
        data: [deviceInfo[0].closeNum, deviceInfo[1].closeNum, deviceInfo[2].closeNum]
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
  option && myChart.value.setOption(option);
}

const updateChart=async()=>{
  if(!myChart.value){
    await setChart()
  }else{
    await useDeviceStore().updateDeviceInfo()
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
        data: ['正常使用设备数', '关闭设备数', '维修设备数'],
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
          name: '正常使用设备数',
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
          data: [deviceInfo[0].openNum, deviceInfo[1].openNum, deviceInfo[2].openNum]
        },
        {
          name: '关闭设备数',
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
          data: [deviceInfo[0].closeNum, deviceInfo[1].closeNum, deviceInfo[2].closeNum]
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
    option && myChart.value.setOption(option);
  }
}

</script>

<style scoped lang="scss">
.chart-bar {
  width: 100%;
  height: 90%;
}
</style>