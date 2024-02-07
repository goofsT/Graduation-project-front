<template>
  <div class="tea-building">
    <ControlData />
    <div class="canvas-container">
      <TeachBuilding />
    </div>
  </div>
</template>
<script setup lang="ts">
import ControlData from "@/components/home/ControlData.vue";
import TeachBuilding from "@/components/TeachBuilding.vue";
import LiveAffairs from "@/components/home/LiveAffairs.vue";

</script>
<style scoped lang="scss">
.tea-building{
  width: 100%;
  height:100%;
  .canvas-container{
    width: 100%;
    height:100%;
  }
}
</style>