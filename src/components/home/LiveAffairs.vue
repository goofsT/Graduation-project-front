<template>
 <div class="live-container">
   <div class="card">
     <div class="card-title">{{title}}</div>
     <div class="card-list">
       <el-scrollbar height="300px" always>
         <template v-for="item in 5">
           <div class="card-item" v-for="thing in data">
             <div class="info">
               <i class="iconfont icon-icon-fabu"></i>
               <span class="title">{{ thing.title }}</span>
             </div>
             <div class="date">{{ thing.date }}</div>
             <span class="status">{{ thing.status }}</span>
           </div>
         </template>
       </el-scrollbar>
     </div>
     <div @click="isShow=!isShow" :class="{'control-btn':true,'iconfont':true,'icon-youzhankai':isShow,'icon-zuoshouqi':!isShow}"></div>
   </div>
 </div>
</template>
<script setup lang="ts">
import { ref, reactive,watch } from 'vue'
//父组件数据
const props = defineProps(['name'])
const emit= defineEmits(['updateShow'])
const title=ref('实时事务')
//子组件数据
const data = reactive([
  {
    title: '1号楼3楼消防栓损坏',
    date: '2023-9-8',
    status: '待处理',
    urgency: '紧急事务',
  },
  {
    title: '2号楼3楼17号教室待清洁',
    date: '2023-9-8',
    status: '已处理',
    urgency: '一般事务',
  },
  {
    title: '2号楼1楼发生聚众情况',
    date: '2023-9-8',
    status: '待处理',
    urgency: '紧急事务',
  },
  {
    title: '2号楼2楼监控损坏',
    date: '2023-9-8',
    status: '待处理',
    urgency: '通知',
  },
  {
    title: '1号楼1楼召开教务会议',
    date: '2023-9-8',
    status: '已处理',
    urgency: '通知',
  },
])

//控制显示隐藏
const isShow = ref(true)
watch(isShow,(newVal)=>{
emit('updateShow',{name:props.name,isShow:newVal})
})

</script>
<style scoped lang="scss">
.live-container {
  height: 100%;
  width: 100%;
  .card {
    width: 100%;
    height: 400px;
    position:relative;
    .card-title {
      width: 110px;
      height: 30px;
      line-height: 25px;
      font-size: 16px;
      padding:5px 0;
      vertical-align: middle;
      color: #fff;
      box-sizing: border-box;
      text-align: center;
      background: url('../../assets/image/card-head.png') no-repeat;
      background-size: 100% 100%;
    }
    .card-list {
      margin-top: 0px;
      padding: 10px;
      width: 100%;
      height: 370px;
      background: url('../../assets/image/card-body.png') no-repeat;
      background-size: 100% 100%;
      .card-item {
        border: 1px solid #38393a;
        box-shadow: 0 0 5px #636669;
        height:45px;
        border-right: 5px;
        padding: 5px 10px;
        margin: 5px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        .info {
          width: 100%;
          display: flex;
          align-items: center;

          i {
            font-size: 28px;
            color: #0c8fe9;
          }
        }
        .date {
          margin-top: 5px;
          font-size: 12px;
          color: #fff;
        }
        .status {
          font-size: 12px;
        }
        &:hover{
          cursor: pointer;
          background-color: rgba(46, 58, 66, 0.8);
        }
      }
    }
    .control-btn{
      position:absolute;
      left:-30px;
      top:50%;
      padding:10px;
      background-color: rgba(46, 58, 66, 0.8);
      border-radius: 8px 0 0 8px;
      &:hover{
        cursor: pointer;
        background-color: rgba(41, 61, 73, 0.9);
      }
    }
  }
  :deep(.el-scrollbar__thumb) {
    background: #0c8ee8 !important;
  }
}
</style>
