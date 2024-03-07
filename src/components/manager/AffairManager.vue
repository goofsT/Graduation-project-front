<template>
  <el-scrollbar height="740px">
    <el-descriptions class="description-box" title="With border" :column="3" size="large" border v-for="affair in affairList">
      <el-descriptions-item>
        <template #label><div class="cell-item"><i class="iconfont icon-shiwu"></i>事务Id</div></template>
        {{affair.affairId}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label><div class="cell-item"><i class="iconfont icon-type"></i>事务类型</div></template>
        {{handleAffairType(affair.affairType)}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label><div class="cell-item"><i class="iconfont icon-shijian"></i>提交时间</div></template>
        {{affair.affairTime}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"><i class="iconfont icon-jiluren"></i>记录人</div>
        </template>
        {{affair.recordUser.realname}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label><div class="cell-item"><i class="iconfont icon-miaoshu"></i>事务描述</div></template>
        <div :style="{'color':getDescriptionTextColor(affair.description)}">{{affair.description}}</div>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label><div class="cell-item"><i class="iconfont icon-shuju"></i>相关数据</div></template>
        {{handleAffairData(affair)}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label><div class="cell-item"><i class="iconfont icon-caozuo"></i>操作</div></template>
        <el-button type="danger" @click="handleDelete(affair.affairId)">删除</el-button>
      </el-descriptions-item>
    </el-descriptions>
    <el-empty style="margin-top: 200px" v-show="affairList.length===0" description="暂无事务" />
  </el-scrollbar>
</template>

<script setup lang="ts">
import {getAllAffairs,deleteAffair} from "@/api/affair.ts";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const affairList=ref([])
const timer=ref(null)
onMounted(()=>{
  getData()
  timer.value=setInterval(()=>{
    getData()
  },60000)
})

onBeforeUnmount(()=>{
  clearInterval(timer.value)
})

const getDescriptionTextColor=(text)=>{
  if(text.includes('完成')){
    return '#67c23a'
  }else if(text.includes('需要维修')){
    return '#f56c6c'
  }else if(text.includes('删除')){
    return '#e8cb0b'
  }else if(text.includes('更新')) {
    return '#409eff'
  }
}

const handleDelete=(id)=>{
  ElMessageBox.confirm(`是否删除该事务?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const res = await deleteAffair(id);
      if (res.code == 200) {
        ElMessage.success("删除成功");
        getData();
      } else {
        ElMessage.warning("删除失败");
      }
    } catch (e) {
      ElMessage.warning("删除失败");
    }
  });
}

const handleAffairData=(affair)=>{
  if(affair.affairType==='0'){
    return (affair.device&&affair.device.deviceName)||"无"
  }else if(affair.affairType=='1'){
    return (affair.classRoom&&affair.classRoom.roomName)||"无"
  }else if(affair.affairType=='2'){
    return (affair.sclass&&affair.sclass.className)||"无"
  }else if(affair.affairType=='3'){
    return (affair.teacher&&affair.teacher.realname)||"无"
  }else if(affair.affairType=='4'){
    return (affair.course&&affair.course.courseName)||"无"
  }else if(affair.affairType=='5'){
    return (affair.user&&affair.user.realname)||"无"
  }else{
    return "无"
  }
}

const handleAffairType=(type)=>{
  switch (type) {
    case '0':
      return "设备相关"
    case '1':
      return "教室相关"
    case '2':
      return "班级相关"
    case '3':
      return "教师相关"
    case '4':
      return "课程相关"
    case '5':
      return "权限相关"
    default:
      return "其他相关"
  }
}

const getData=async ()=>{
  try{
    const res=await getAllAffairs()
    if(res.code==200){
      affairList.value=res.data
      affairList.value.sort((a,b)=>{
        return new Date(b.affairTime).getTime()-new Date(a.affairTime).getTime()
      })
    }else{
      ElMessage.warning('获取事务失败')
    }
  }catch (e) {
    ElMessage.warning("获取事务失败")
  }
}
</script>

<style scoped lang="scss">

.description-box{
  :deep(.el-descriptions__body){
    border: 5px solid #2eb9f5;
    border-radius: 10px;
    overflow: hidden;
    .iconfont{
      font-size: 20px;
      color: #6bd6e0;
    }
  }
}
</style>