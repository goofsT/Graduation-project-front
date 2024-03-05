<template>
  <div class="container">
    <el-button type="primary" @click="clickAddclass">添加班级</el-button>
    <el-table
      :data="classList"
      :header-cell-style="{background:'#105050',color:'#e5eeed',textAlign:'center',fontSize:'16px'}"
      :cell-style="{background:'#2c2f31',color:'#93d8e5',textAlign:'center',height:'70px'}"
      max-height="745"
      style="width: 100%"
    >
      <el-table-column prop="classId" label="Id" width="100" />
      <el-table-column prop="className" label="姓名"  />
      <el-table-column prop="classNum" label="人数" width="100" />
      <el-table-column prop="classCounselor" label="辅导员" />
      <el-table-column prop="counselorNumber" label="辅导员电话"/>
      <el-table-column prop="academy" label="学院"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="default" type="primary" @click="updateclassInfo(scope.row)">修改</el-button>
          <el-button size="default" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog destroy-on-close :show-close="false" @close="dialogClose" v-model="dialogFormVisible" :title="dialogTitle" width="500" center>
      <el-form :model="form">
        <el-form-item label="班级名" label-width="100">
          <el-input placeholder="输入班级名" style="width: 300px" v-model="form.className" autocomplete="off" />
        </el-form-item>
        <el-form-item label="人数" label-width="100">
          <el-input placeholder="输入人数" style="width: 300px" v-model="form.classNum" autocomplete="off" />
        </el-form-item>
        <el-form-item label="学院" label-width="100">
          <el-input placeholder="输入学院" style="width: 300px" v-model="form.academy" autocomplete="off" />
        </el-form-item>
        <el-form-item label="辅导员姓名" label-width="100">
          <el-input placeholder="输入辅导员姓名" style="width: 300px" v-model="form.classCounselor" autocomplete="off" />
        </el-form-item>
        <el-form-item label="辅导员电话" label-width="100">
          <el-input placeholder="输入辅导员电话" style="width: 300px" v-model="form.counselorNumber" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import{ref,onMounted} from 'vue'
import{getAllClass,updateClass,deleteClass,addClass} from "@/api/class.ts";
import { ElMessage, ElMessageBox } from "element-plus";
const classList=ref([])
const dialogFormVisible=ref(false)
const dialogTitle=ref('')
const form=ref({
  classId:'',
  className:'',
  classNum:'',
  classCounselor:'',
  counselorNumber:'',
  academy:''
})
onMounted(()=>{
  getData()
})


const dialogClose=()=>{
  dialogFormVisible.value = false;
  form.value = {
    classId:'',
    className:'',
    classNum:'',
    classCounselor:'',
    counselorNumber:'',
    academy:''
  };
}

const submit=async ()=>{
  if(form.value.classId){
    try{
      const res=await updateClass(form.value)
      if(res.code==200){
        ElMessage.success('修改成功')
        dialogFormVisible.value=false
        await getData()
      }else{
        ElMessage.error('修改失败')
      }
    }catch (e) {
      ElMessage.error('修改失败')
    }
  }else{
    try{
      const res=await addClass(form.value)
      if(res.code==200){
        ElMessage.success('添加成功')
        dialogFormVisible.value=false
        await getData()
      }else{
        ElMessage.error('添加失败')
      }
    }catch (e) {
      ElMessage.error('添加失败')
    }
  }
}

const clickAddclass=async()=>{
  dialogFormVisible.value=true
  dialogTitle.value='添加班级'
  delete form.value.classId;
}

const getData=async ()=>{
  try{
    const res=await getAllClass()
    if(res.code==200){
      console.log(res.data);
      classList.value=res.data
    }else{
      ElMessage.error('获取数据失败')
    }
  }catch (e) {
    ElMessage.error('获取数据失败')
  }
}

const updateclassInfo=async (row)=>{
  dialogFormVisible.value=true
  dialogTitle.value='修改班级信息'
  form.value=Object.assign({},row)
}

const handleDelete=async (row)=>{
  ElMessageBox.confirm(`是否删除${row.className}?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const res = await deleteClass(row.classId)
      if (res.code == 200) {
        ElMessage.success('删除成功')
        await getData()
      } else {
        ElMessage.error('删除失败')
      }
    } catch (e) {
      ElMessage.error('删除失败')
    }
  });
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:750px;
}
:deep(.el-dialog__title){
  color: #22a5d3;
  font-weight: bold;
  font-size: 18px;
}
:deep(.el-dialog--center){
  border-radius: 10px;
  background-color: #2a2828;
}
:deep(.el-form-item__label){
  color: #fff;
  font-size: 16px;
}
</style>