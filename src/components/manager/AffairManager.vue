<template>
  <div>
    <el-descriptions
      class="margin-top"
      title="With border"
      :column="3"
      size="large"
      border
    >
      <template #extra>
        <el-button type="primary">Operation</el-button>
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <i class="iconfont icon-chakan2"></i>
            事务Id
          </div>
        </template>
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <i class="iconfont icon-chakan2"></i>
            事务描述
          </div>
        </template>
        18100000000
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <i class="iconfont icon-chakan2"></i>
            事务时间
          </div>
        </template>
        Suzhou
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <i class="iconfont icon-chakan2"></i>
            记录人
          </div>
        </template>
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <i class="iconfont icon-chakan2"></i>
            Address
          </div>
        </template>
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">

</style>