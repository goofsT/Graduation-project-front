<template>
  <div class="scroll-container">
    <div class="scroll-title">不可用教室</div>
    <el-scrollbar v-if="repairData.length>0" height="100%">
      <div class="device-item scrollbar-demo-item" v-for="item in repairData" :key="item" >
        <div class="device-item-name">{{ item.roomName }}</div>
        <div class="device-item-status">暂时无法使用</div>
      </div>
    </el-scrollbar>
    <div v-else style="height:100%">
      <el-empty description="暂无数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { getRepairClassRoom } from "@/api/ClassRoom.ts";
import { reactive, onMounted } from 'vue'
import { ElMessage } from "element-plus";
const repairData = ref([])
const timer = ref<any>(null)
onMounted(()=>{
  getData()
  setInterval(()=>{getData()},3000)
})
onBeforeUnmount(()=>{
  timer.value && clearInterval(timer.value)
})

const getData = async () => {
  const res = await getRepairClassRoom()
  if (res.code === 200) {
    repairData.value=res.data
  }else{
    ElMessage.warning('维修教室数据获取失败');
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
        color: #ef2121;
      }
    }
    .device-item-name{

    }
    .device-item-status{
      color: #0ba8ec;
    }

  }
  .scroll-title{
    color:#3889f1;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>