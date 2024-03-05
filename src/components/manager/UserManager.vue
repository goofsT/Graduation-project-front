<template>
  <div class="container">
    <el-table
      :data="userList"
      :header-cell-style="{background:'#105050',color:'#e5eeed',textAlign:'center',fontSize:'16px'}"
      :cell-style="{background:'#2c2f31',color:'#93d8e5',textAlign:'center',height:'70px'}"
      max-height="745"
      style="width: 100%"
    >
      <el-table-column prop="id" label="用户id" width="100" />
      <el-table-column prop="username" label="用户名" width="110"  />
      <el-table-column prop="password" label="密码" width="110"  />
      <el-table-column prop="realname" label="真实姓名" width="110"  />
      <el-table-column prop="telphone" label="电话"  width="150"/>
      <el-table-column prop="cardnum" label="身份证号" width="180"/>
      <el-table-column prop="premission" label="权限"  width="100" >
        <template #default="scope">
          <el-tag size="large" v-if="scope.row.premission=='0'" type="success">管理员</el-tag>
          <el-tag size="large" v-if="scope.row.premission=='1'" type="success">普通用户</el-tag>
          <el-tag size="large" v-if="scope.row.premission=='2'" type="success">维修人员</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更改操作">
        <template #default="scope">
          <el-button size="default" type="primary" @click="changePermission(scope.row,'1')">普通用户</el-button>
          <el-button size="default" type="primary" @click="changePermission(scope.row,'0')">管理员</el-button>
          <el-button size="default" type="primary" @click="changePermission(scope.row,'2')">维修人员</el-button>
          <el-button size="default" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script setup lang="ts">
import{ref,onMounted} from 'vue'
import{getUserList,setRole,deleteUser} from "@/api/user.ts";
import { ElMessage, ElMessageBox } from "element-plus";
const userList=ref([])
onMounted(()=>{
  getData()
})

/**
 * 获取用户列表
 * 更新表格数据
 */
const getData=()=>{
  getUserList().then((res:any)=>{
    userList.value=res.data
    console.log(res.data);
  })
}

const changePermission=async (row,role)=>{
  try{
    const res=await setRole(row.id,role)
    console.log(res);
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

/**
 * 删除用户
 * @param row
 */
const handleDelete=async (row)=>{
  ElMessageBox.confirm(`是否删除用户${row.realname}?`, "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "警告",
  }).then(async()=>{
    try{
      const res=await deleteUser(row.id)
      if(res.code==200){
        ElMessage.success('删除成功')
        getData()
      }else{
        ElMessage.error('删除失败')
      }
    }catch (e) {
      ElMessage.error('删除失败')
    }
  })
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:750px;
}
</style>