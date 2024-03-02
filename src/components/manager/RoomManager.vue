<template>
  <div class="container">
    <el-table
      :data="roomList"
      :header-cell-style="{background:'#105050',color:'#e5eeed',textAlign:'center',fontSize:'16px'}"
      :cell-style="{background:'#2c2f31',color:'#93d8e5',textAlign:'center',height:'70px'}"
      max-height="745"
      style="width: 100%"
    >
      <el-table-column prop="roomId" label="教室id" width="100" />
      <el-table-column prop="roomName" label="教室名"  />
      <el-table-column prop="buildingId" label="楼栋号" width="100" />
      <el-table-column prop="floorNum" label="楼层号" width="100" />
      <el-table-column prop="studentNum" label="学生人数" width="100" />
      <el-table-column prop="positionModel" label="定位模型"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status=='0'" type="success">空闲</el-tag>
          <el-tag v-if="scope.row.status=='1'" type="info">使用中</el-tag>
          <el-tag v-if="scope.row.status=='2'" type="danger">维修</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态修改">
        <template #default="scope">
          <el-button size="default" type="primary" @click="changeRoomStatus(scope.row,'2')">维修</el-button>
          <el-button size="default" type="primary" @click="changeRoomStatus(scope.row,'0')">空闲</el-button>
          <el-button size="default" type="primary" @click="changeRoomStatus(scope.row,'1')">使用中</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script setup lang="ts">
import{ref,onMounted} from 'vue'
import { getAllClassRoom, updateClassRoomStatus } from "@/api/ClassRoom.ts";
import { ElMessage } from "element-plus";
const roomList=ref([])
onMounted(()=>{
  getData()
})


const getData=()=>{
  getAllClassRoom().then((res:any)=>{
    roomList.value=res.data
  })
}

const changeRoomStatus=async (row,status)=>{
  try{
    const res=await updateClassRoomStatus(row.roomId,status)
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

</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:750px;
}
</style>