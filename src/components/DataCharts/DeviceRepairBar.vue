<template>
  <div class="scroll-container">
    <div class="scroll-title">设备维修数据</div>
    <el-scrollbar height="100%">
      <div class="device-item scrollbar-demo-item" v-for="item in repairData" :key="item" >
        <div class="device-item-name">{{ item.deviceName }}</div>
        <div class="device-item-status">待维修</div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { getRepairDevice } from "@/api/device.ts";
import { reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";
const repairData = reactive([])
onMounted(()=>{
  getData()
})

const getData = async () => {
  const res = await getRepairDevice()
  if (res.code === 200) {
    Object.assign(repairData, res.data)
  }else{
    ElMessage.warning('维修设备数据获取失败');
  }
}

//初始化图表
</script>

<style scoped lang="scss">
.scroll-container {
  width: 100%;
  height: 90%;
  .device-item{
    height: 40px;
    border: 1px solid #1c3e6b;
    margin: 10px 0;
    line-height: 40px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    &:hover{
      background-color: #1c3e6b;
      cursor: pointer;
      .device-item-name{
        color: #fff;
      }
      .device-item-status{
        color: #fff;
      }
    }
    .device-item-name{

    }
    .device-item-status{
      color: #f00;
    }

  }
  .scroll-title{
    color:#3889f1;
    text-align: center;
  }
}
</style>