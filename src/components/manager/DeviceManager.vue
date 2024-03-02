<template>
 <div class="container">
   <el-table
     :data="deviceList"
     :header-cell-style="{background:'#105050',color:'#e5eeed',textAlign:'center',fontSize:'16px'}"
     :cell-style="{background:'#2c2f31',color:'#93d8e5',textAlign:'center',height:'70px'}"
     max-height="745"
     style="width: 100%"
   >
     <el-table-column prop="deviceId" label="Id" width="100" />
     <el-table-column prop="deviceName" label="设备名"  />
     <el-table-column prop="buildingId" label="楼栋号" width="100" />
     <el-table-column prop="floorNum" label="楼层号" width="100" />
     <el-table-column prop="modelName" label="模型名"/>
     <el-table-column prop="deviceStatus" label="状态" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.deviceStatus=='0'" type="success">正常</el-tag>
          <el-tag v-if="scope.row.deviceStatus=='1'" type="info">关闭</el-tag>
          <el-tag v-if="scope.row.deviceStatus=='2'" type="danger">维修</el-tag>
        </template>
     </el-table-column>
     <el-table-column label="更改操作">
       <template #default="scope">
         <el-button size="default" type="primary" @click="changeDeviceStatus(scope.row,'2')">维修</el-button>
         <el-button size="default" type="primary" @click="changeDeviceStatus(scope.row,'0')">正常</el-button>
         <el-button size="default" v-if="scope.row.deviceType!=='2'" type="primary" @click="changeDeviceStatus(scope.row,'1')">关闭</el-button>
         <el-button size="default" type="danger" @click="handleDelete(scope.row)">删除</el-button>
       </template>
     </el-table-column>

   </el-table>
 </div>
</template>

<script setup lang="ts">
import{ref,onMounted} from 'vue'
import{getAllDevice,updateDeviceStatus,deleteDevice} from "@/api/device.ts";
import { ElMessage } from "element-plus";
const deviceList=ref([])
onMounted(()=>{
  getData()
})


const getData=()=>{
  getAllDevice().then((res:any)=>{
    deviceList.value=res.data
  })
}

const changeDeviceStatus=async (row,status)=>{
  try{
    const res=await updateDeviceStatus(row.deviceId,status)
    if(res.code==200){
      ElMessage.success('设置成功')
      getData()
    }else{
      ElMessage.error('设置失败')
    }
  }catch (e) {
    ElMessage.error('设置失败')
  }
}

const handleDelete=async (row)=>{
  try{
    const res=await deleteDevice(row.deviceId)
    if(res.code==200){
      ElMessage.success('删除成功')
      getData()
    }else{
      ElMessage.error('删除失败')
    }
  }catch (e) {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:750px;
}
</style>