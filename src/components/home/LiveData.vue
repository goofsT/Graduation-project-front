<template>
  <CommonBox title="人员数据" :height="620" :display="showPersonData" @displayChange="changeDisplay">
    <ChartBar class="chart1" />
    <ChartScatter class="chart2" />
  </CommonBox>
  <CommonBox title="设备数据" :height="620" :display="showDeviceData" @displayChange="changeDisplay">
    <DeviceBar class="chart1"/>
    <DeviceRepairBar class="chart1" />
  </CommonBox>
  <CommonBox title="教室数据" :height="600" :display="showClassData" @displayChange="changeDisplay">
    <ClassRoomBar class="chart1" style="height:150px"  />
    <ClassRoomRepair class="chart1" />
  </CommonBox>
</template>

<script setup lang="ts">
import {ref,nextTick,reactive} from 'vue'
import CommonBox from "@/components/common/CommonBox.vue";
import ChartBar from "@/components/DataCharts/ChartBar.vue";
import ChartScatter from "@/components/DataCharts/ChartScatter.vue";
import DeviceBar from "@/components/DataCharts/DeviceBar.vue";
import DeviceRepairBar from "@/components/DataCharts/DeviceRepairBar.vue";
import ClassRoomBar from "@/components/DataCharts/ClassRoomBar.vue";
import ClassRoomRepair from "@/components/DataCharts/ClassRoomRepair.vue";

const showPersonData=ref(true)
const showDeviceData=ref(false)
const showClassData=ref(false)
//保证同一时间只有一个处于打开状态
const changeDisplay=(changedTitle:String,isShow:boolean)=>{
  if (changedTitle === '人员数据') {
    showPersonData.value = isShow;
    if (isShow) {
      showDeviceData.value = false;
      showClassData.value = false;
    }
  } else if (changedTitle === '设备数据') {
    showDeviceData.value = isShow;
    if (isShow) {
      showPersonData.value = false;
      showClassData.value = false;
    }
  } else if (changedTitle === '教室数据') {
    showClassData.value = isShow;
    if (isShow) {
      showPersonData.value = false;
      showDeviceData.value = false;
    }
  }
}


</script>

<style scoped lang="scss">
.chart1,
.chart2 {
  width: 95%;
  height: 260px;
  margin: 10px auto;
}
</style>