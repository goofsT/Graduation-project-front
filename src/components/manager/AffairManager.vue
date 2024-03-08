<template>
  <div class="affair-top">
    <el-button type="primary" size="large" @click="getData">今日事务</el-button>
    <div class="affair-title">{{affairTitle}}</div>
    <div>
      <el-date-picker
        v-model="searchDate"
        type="date"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        placeholder="选择日期查询"
        size="large"
      />
      <el-button type="primary" size="large" @click="getDataByDate">查询</el-button>
    </div>
  </div>
  <el-scrollbar height="700px" v-loading="isLoading" element-loading-text="查询中" element-loading-background="#000">
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
import {getAllAffairs,deleteAffair,getAffairByDate,getTodyAffairList} from "@/api/affair.ts";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const affairList=ref([])
const timer=ref(null)
const searchDate=ref('')
const showTodayAffair=ref(true)
const affairTitle=ref('今日事务')
const isLoading=ref(false)
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
        showTodayAffair.value?getData():getDataByDate()
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

// 获取今日事务
const getData=async ()=>{
  try{
    isLoading.value=true
    showTodayAffair.value=true
    affairTitle.value='今日事务'
    const res=await getTodyAffairList()
    isLoading.value=false
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

// 根据日期查询事务
const getDataByDate=async ()=>{
  if(searchDate.value){
    isLoading.value=true
    showTodayAffair.value=false
    const res=await getAffairByDate(searchDate.value)
    console.log(res);
    isLoading.value=false
    if(res.code==200){
      affairTitle.value=`${searchDate.value}事务`
      affairList.value=res.data
      affairList.value.sort((a,b)=>{
        return new Date(b.affairTime).getTime()-new Date(a.affairTime).getTime()
      })
    }else{
      ElMessage.warning('获取事务失败')
    }
  }
}
</script>

<style scoped lang="scss">
.affair-top{
  display: flex;
  justify-content: space-between;
  .affair-title{
    font-size: 25px;
    font-weight: bold;
    margin: 0 20px;
    color: #2eb9f5;
  }
}

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
:deep(.el-scrollbar__thumb) {
  background: #0680e5 !important;
  //透明度
  opacity: 1 !important;
}
</style>