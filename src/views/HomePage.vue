<template>
  <div class="tea-building">
    <ControlData @controlChange="handleChange" />
    <div class="canvas-container">
      <TeachBuilding
        ref="teachBuilding"
        :controlObj="controlObj"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import ControlData from "@/components/home/ControlData.vue";
import TeachBuilding from "@/components/TeachBuilding.vue";
import { ref } from "vue";
const controlObj=ref({
  showWeather:false,
  showDevice:false,
  showAffairs:false
})


const handleChange=(obj:any)=>{
  controlObj.value=obj
}
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