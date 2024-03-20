<template>
  <div class="gl-container" ref="container">
    <div id="card" class="card"></div>
  </div>
</template>
<script lang="ts">
import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {mergeGeometries} from "three/examples/jsm/utils/BufferGeometryUtils";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { getWeather } from "@/api/weather.ts";
import { ElMessage } from "element-plus";
import { getRepairDevice } from "@/api/device.ts";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { useCurrentDevice } from "@/store/currentDevice.ts";
import {useCurrentRoom} from "@/store/currentRoom.ts";
const currentRoom=useCurrentRoom()
const currentDevice=useCurrentDevice()
import {watch} from "vue";
import TWEEN from '@tweenjs/tween.js'
//添加坐标轴辅助
export default {
  name: 'TeachBuilding',
  props: {
    controlObj: {
      type: Object,
      default: () => {
        return {
          showWeather: false,
          showDevice: false,
          showAffairs: false
        }
      }
    }
  },
  data(){
    return{
      control:null,//轨道控制器
      renderId:null,
      raycaster:null,
      mouse:null,
      rect:null,//canvas的位置信息
      sunLight:null,//平行光
      ambientLight:null,//环境光
      containerHeight:null,
      containerWidth:null,
      cardHeight:null,//卡片高度
      cardWidth:null,// 卡片宽度
      lights:[],//所有灯光
      corridorLightLeft:[],
      corridorLightRight:[],//走廊灯
      leftClassLight:[],
      rightClassLight:[],//教室灯
      doors:[],//所有门
      classDoorRight:[],
      classDoorLeft:[],//教室门
      leftBuildingDoor:[],
      rightBuildingDoor:[],//顶楼/一楼教学楼门
      fireHydrant:[],//消防栓
      rayCasterMeshes:[],//射线检测的mesh
      showWeather:false,//是否显示天气
      showRepairDevice:false,//是否显示维修设备
      showDeviceCard:false,//是否显示设备卡片
      iconGroup:null,//图标group
      weatherFog:null,
      normalFog:null//正常
    }
  },
  watch:{
    controlObj:{
      handler(val){
        this.showWeather=val.showWeather
        this.showRepairDevice=val.showDevice
      },
      deep:true
    },
  },
  mounted() {
    //监听设备卡片
    watch(() => currentDevice.device, (newDeviceInfo) => {
      this.setDeviceCard(newDeviceInfo)
    });
    watch(() => currentRoom.room, (newRoom) => {
      this.setRoomCard(newRoom)
    })
    this.getContainerInfo()
    this.initSeen()
  },
  beforeUnmount() {
    cancelAnimationFrame(this.renderId)
    this.disposeWeather()
  },
  methods: {
    getContainerInfo(){
      if(!this.$refs.container) return
      this.containerHeight=this.$refs.container.clientHeight
      this.containerWidth=this.$refs.container.clientWidth
      this.rect=this.$refs.container.getBoundingClientRect()
    },
    initSeen(){
      this.scene = new THREE.Scene()
      this.iconGroup=new THREE.Group();
      this.scene.fog=new THREE.Fog('#6c6969',0.015,500)
      this.normalFog=new THREE.Fog('#6c6969',0.015,500)
      //添加天空盒子纹理
      const skybox = new THREE.CubeTextureLoader()
        .setPath( '/textures/Park3Med/' )
        .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
      this.scene.background = skybox
      this.scene.environment = skybox
      this.camera = new THREE.PerspectiveCamera(45,this.containerWidth/this.containerHeight,0.001,200)
      this.camera.position.set(18,8,0)
      this.camera.lookAt(0,0,0)
      this.camera.aspect = this.containerWidth/this.containerHeight
      this.camera.updateProjectionMatrix()
      this.scene.add(this.camera)

      const plane=new THREE.PlaneGeometry(500,500)
      const planeMesh=new THREE.Mesh(plane,new THREE.MeshBasicMaterial({color:'#6c6969'}))
      planeMesh.rotation.x=-Math.PI/2
      planeMesh.position.setY(-0.1)
      const axesHelper = new THREE.AxesHelper( 50 );
      const gridHelper=new THREE.GridHelper(50,50,'#ccc','#424141')
      gridHelper.raycast = function () {};
      this.scene.add( axesHelper );
      this.scene.add(planeMesh)
      this.scene.add(gridHelper)

      //添加环境光
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      this.scene.add(this.ambientLight)
      //添加平行光
      this.sunLight = new THREE.DirectionalLight(0xffffff, 3);
      this.sunLight.position.set(20, 20, 20)
      this.sunLight.castShadow = true
      this.sunLight.shadow.mapSize.width = 512;  // 阴影贴图宽度
      this.sunLight.shadow.mapSize.height = 512; // 阴影贴图高度
      this.sunLight.shadow.camera.near = 0.1;     // 近裁剪面
      this.sunLight.shadow.camera.far = 100;      // 远裁剪面
      this.sunLight.shadow.camera.left = -50;    // 调整视锥体大小
      this.sunLight.shadow.camera.right = 50;
      this.sunLight.shadow.camera.top = 50;
      this.sunLight.shadow.camera.bottom = -50;
      const helper = new THREE.DirectionalLightHelper(this.sunLight, 1);
      this.scene.add(helper);
      this.scene.add(this.sunLight);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, })
      //定义渲染器的输出编码
      this.renderer.outputEncoding = THREE.sRGBEncoding
      //定义渲染器的阴影地图类型
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      //开启渲染器的阴影地图
      this.renderer.shadowMap.enabled = true
      //深度缓冲
      this.renderer.autoClear = false
      this.renderer.setSize(this.containerWidth,this.containerHeight)
      this.$refs.container.appendChild(this.renderer.domElement)

      //添加轨道控制器
      this.control = new OrbitControls(this.camera, this.renderer.domElement)
      // 设置控制器阻尼，让控制器更真实
      this.control.enableDamping = true
      this.control.maxDistance = 200
      this.control.minDistance = 0
      this.control.maxPolarAngle = Math.PI/ 2
      this.control.minPolarAngle = Math.PI / 8

      // 监听尺寸变化
      window.addEventListener('resize', () => {
        this.getContainerInfo()
        //更新相机宽高比
        this.camera.aspect = this.containerWidth / this.containerHeight
        //更新相机投影矩阵
        this.camera.updateProjectionMatrix()
        //更新渲染器
        this.renderer.setSize(this.containerWidth, this.containerHeight)
        //更新渲染器像素比
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      })
      this.initSceneWeather()
      this.initCss3DRender()
      this.setBuildingName()
      this.initOutLinePass()
      this.initModel()
      this.render()
    },
    //初始化css3D渲染器
    initCss3DRender(){
      this.css3DRenderer = new CSS3DRenderer();
      this.css3DRenderer.setSize(this.containerWidth, this.containerHeight);
      document.getElementById('card')?.appendChild( this.css3DRenderer.domElement);
    },
    //高亮轮廓
    initOutLinePass(){
      //效果合成器
      this.composer = new EffectComposer(this.renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      const v2 = new THREE.Vector2(this.containerHeight, this.containerWidth);
      this.outlinePass = new OutlinePass(v2, this.scene, this.camera);
      this.outlinePass.visibleEdgeColor.set(0x00ffff);
      this.outlinePass.edgeThickness = 4;
      this.outlinePass.edgeStrength = 6;
      this.outlinePass.renderToScreen = true
      this.composer.addPass(this.outlinePass);
      // 创建伽马校正通道
      const gammaPass = new ShaderPass(GammaCorrectionShader);
      this.composer.addPass(gammaPass);
      const pixelRatio = this.renderer.getPixelRatio();
      const smaaPass = new SMAAPass(this.containerWidth * pixelRatio, this.containerHeight * pixelRatio);
      this.composer.addPass(smaaPass);
    },
    render(){
      TWEEN.update()
      this.control.update()
      this.renderWeather()
      this.renderRepairDevice()
      this.title.lookAt(this.camera.position)
      this.title1.lookAt(this.camera.position)
      this.card && this.card.lookAt(this.camera.position)
      this.roomCard && this.roomCard.lookAt(this.camera.position)
      this.iconGroup.children.forEach((icon) => {
        icon.lookAt(this.camera.position);
      });
      //this.renderer.render(this.scene, this.camera)
      this.composer.render()//使用效果合成器渲染
      this.css3DRenderer.render(this.scene, this.camera);
      this.renderId = requestAnimationFrame(this.render)
    },
    renderRepairDevice(){
      if (this.showRepairDevice) {
        if (!this.scene.children.includes(this.iconGroup)) {
          this.scene.add(this.iconGroup);
        }
      } else {
        this.scene.remove(this.iconGroup);
        this.iconGroup.children.forEach((icon) => {
          icon.element.style.display = 'none';
        });
      }
    },
    renderWeather(){
      this.scene.fog=this.showWeather?this.weatherFog:this.normalFog
      if(this.showWeather && this.weatherParticles){
        //判断场景中是否有雪花
        this.scene.add(this.weatherParticles)
        for(let i=1;i<this.weatherVertices.length;i+=3){
          if(this.weatherVertices[i]<-10){
            this.weatherVertices[i]=10
          }
          this.weatherVertices[i]-=Math.random()*0.2
        }
        //重新设置位置属性
        this.weatherGeometry.setAttribute('position',new THREE.Float32BufferAttribute(this.weatherVertices,3))
      }else{
        this.scene.fog=this.normalWeather
        this.weatherParticles && this.scene.remove(this.weatherParticles)
      }
    },
    initModel(){
      const dracoLoader = new DRACOLoader()
      const modelLoader = new GLTFLoader()
      dracoLoader.setDecoderPath('/draco/gltf/')
      modelLoader.setDRACOLoader(dracoLoader)
      //加载模型
      modelLoader.load('/model/building.glb', (glb) => {
        const model = glb.scene
        //遍历模型中的所有建筑
        this.scene.add(model)
        model.traverse((item) => {
          if (item.isMesh||item.isObject3D) {
            //添加阴影
            if(item.name==='Terreo'){
              item.material.transparent=false
              item.receiveShadow = true
            }else{
              if(item.name.includes('light')){
                this.saveLight(item)
              }else if(item.name.includes('door')){
                this.saveDoor(item)
              }else if(item.name.includes('fire')){
                this.saveFireHydrant(item)
              }else{
                item.castShadow = true
                item.receiveShadow = true
              }
            }
          }
        })
        this.handleRaycaster()//射线检测
        this.initRepairDevice()
        // console.log('左边教室灯',this.leftClassLight);
        // console.log('右边教室灯',this.rightClassLight);
        // console.log('左边走廊灯',this.corridorLightLeft);
        // console.log('右边走廊灯',this.corridorLightRight);
        // console.log('左边教室门',this.classDoorLeft);
        // console.log('右边教室门',this.classDoorRight);
        // console.log('左大门',this.leftBuildingDoor);
        // console.log('右大门',this.rightBuildingDoor);
        // console.log('消防栓',this.fireHydrant);

      })
    },
    saveLight(mesh){
      //判断是否为Group
      let light=this.createLight(mesh.position)
      if(mesh.name.includes('light')&&mesh.name.includes('left')){
        this.leftClassLight.push({name:mesh.name,mesh,light})
      }
      if(mesh.name.includes('light')&&mesh.name.includes('right')){
        this.rightClassLight.push({name:mesh.name,mesh,light})
      }
      if(mesh.name.includes('light')&&mesh.name.includes('zou')&&mesh.name.includes('left')){
        this.corridorLightLeft.push({name:mesh.name,mesh,light})
      }
      if(mesh.name.includes('light')&&mesh.name.includes('zou')&&mesh.name.includes('right')){
        this.corridorLightRight.push({name:mesh.name,mesh,light})
      }
      if(mesh.name.includes('door')&&mesh.name.includes('right')) {
        this.classDoorRight.push({name:mesh.name,mesh,light})
      }
      if(mesh.name.includes('door')&&mesh.name.includes('left')) {
        this.classDoorLeft.push({name:mesh.name,mesh,light})
      }
      this.lights.push({name:mesh.name,mesh})
    },
    saveDoor(mesh){
      if(mesh.name.includes('door')&&mesh.name.includes('right')) {
        if(mesh.name.includes('class')){
          this.classDoorRight.push({name:mesh.name,mesh})
        }else{
          this.rightBuildingDoor.push({name:mesh.name,mesh})
        }
        this.rayCasterMeshes.push(mesh)
        this.doors.push({name:mesh.name,mesh})
        return
      }
      if(mesh.name.includes('door')&&mesh.name.includes('left')) {
        if(mesh.name.includes('class')){
          this.classDoorLeft.push({name:mesh.name,mesh})
        }else{
          this.leftBuildingDoor.push({name:mesh.name,mesh})
        }
        this.rayCasterMeshes.push(mesh)
        this.doors.push({name:mesh.name,mesh})
      }
    },
    saveFireHydrant(mesh){
      this.fireHydrant.push({name:mesh.name,mesh})
    },
    createLight(position){
      const pointLight=new THREE.PointLight(0xffffff,0,6)
      pointLight.position.set(position.x,position.y-0.1,position.z)
      // const pointLightHelper = new PointLightHelper(pointLight, 0.1);
      // this.scene.add(pointLightHelper);
      // this.scene.add(pointLight)
      return pointLight
    },
    //将group转换为mesh(合并几何体)
    handleGroupToMesh(group){
      const geometries = [];
      const name=group.name
      // 递归函数，用于遍历group及其子group
      const traverseGroup = (item) => {
        if (item.isMesh) {
          // 克隆几何体并应用mesh的当前变换
          const geometry = item.geometry.clone();
          geometry.applyMatrix4(item.matrixWorld);
          geometries.push(geometry);
        } else if (item.isGroup) {
          // 如果是Group，则递归遍历其子项
          item.children.forEach(child => traverseGroup(child));
        }
      };
      // 从顶层group开始遍历
      traverseGroup(group);
      // 合并所有几何体
      const mergedGeometry = mergeGeometries(geometries, false);
      // 创建新的mesh，可以选择合适的材质
      const mesh = new THREE.Mesh(mergedGeometry, new THREE.MeshStandardMaterial());
      mesh.name=name
      return mesh;
    },
    animateCamera(position){
      const jsonStr = position.replace(/(\w+):/g, '"$1":');
      const obj = JSON.parse(jsonStr);
      new TWEEN.Tween(this.camera.position)
        .to(obj, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    },
    animateRoomCamer(position){
      const p=Object.assign({},position)
      p.z=p.z>0?0.8:-0.8
      new TWEEN.Tween(this.camera.position)
        .to(p, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      this.control.target.set(position.x,position.y,position.z)
      this.control.update()
    },
    //射线检测
    handleRaycaster(){
      this.raycaster = new THREE.Raycaster()
      this.mouse = new THREE.Vector2()
      const domElement = this.renderer.domElement
      domElement.addEventListener('click', (event) => {
        this.mouse.x = ((event.clientX - this.rect.left) / this.rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY -this.rect.top) /this.rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.rayCasterMeshes, true)
        if (intersects.length > 0) {
          const obj=intersects[0].object
          if(obj.name.includes('网格')){
            const current=obj.parent
            console.log(current);
            //把这个group的材质改为透明
            current.traverse((item)=>{
              if(item.isMesh){
                // let curMaterial=item.material
                // console.log('mesh材质',curMaterial);
                // item.material=new THREE.MeshBasicMaterial({color:'#fff',transparent:true,opacity:0.5})
              }
            })
          }else{
            console.log(obj);

          }
        }
      })
    },
    async initSceneWeather(){
      let weather=null
      if(localStorage.getItem('weather')){
        weather=JSON.parse(localStorage.getItem('weather'))
        this.setWeather(weather)
      }else{
        try{
          const res=await getWeather()
          const weatherRes=await getWeather()
          if(res.code==200){
            weather=weatherRes.data[0]
            localStorage.setItem('weather',JSON.stringify(weather))
            this.setWeather(weather)
          }else{
            ElMessage.warning('获取天气信息失败');
          }
        }catch (e) {
          ElMessage.warning('服务器出错了')
        }
      }
    },
    setWeather(weather){
      if(weather.type.includes("雾")||weather.type.includes("霾")){
        this.weatherFog=new THREE.FogExp2(0xefd1b5,0.02)
      }else{
        this.weatherFog=this.normalFog
      }

      this.weatherTexture=new THREE.TextureLoader().load(this.getWeatherTextureUrl(weather))
      this.weatherGeometry = new THREE.BufferGeometry()
      this.weatherVertices = []
      for(let i=0;i<500;i++){
        const x=Math.random()*20-10
        const y=Math.random()*20-10
        const z=Math.random()*20-10
        this.weatherVertices.push(x,y,z)
      }
      this.weatherGeometry.setAttribute('position',new THREE.Float32BufferAttribute(this.weatherVertices,3))
      //创建材质
      this.snowMaterial=new THREE.PointsMaterial({
        size:0.5,//大小
        transparent:true,//允许透明
        alphaTest:0.5,//如果不透明度低于此值，则不会渲染材质。默认值为0。
        alphaMap:this.weatherTexture,//一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）
        map:this.weatherTexture,//纹理贴图
      })
      this.weatherParticles=new THREE.Points(this.weatherGeometry,this.snowMaterial)
      this.scene.add(this.weatherParticles)
    },
    getWeatherTextureUrl(weather){
      if(weather.type.includes('雪')) {
        return './textures/snowflake2.png'
      }else if(weather.type.includes('雨')){
        return './textures/rain1.png'
      }else{
        return ''
      }
    },
    //获取维修设备
    async getRepairDevice(){
      try{
        const res=await getRepairDevice()
        if(res.code==200) {
          return res.data
        }else{
          ElMessage.warning('获取维修设备失败')
          return []
        }
      }catch (e) {
        ElMessage.warning('服务器出错了')
        return []
      }
    },
    async initRepairDevice(){
      const devices= await this.getRepairDevice()
      devices.forEach(device=>{
        if(device.deviceName.includes('消防栓')){
          this.fireHydrant.forEach((item)=>{
            if(item.name===device.modelName){
              this.setRepairIcon(item.mesh.position,device.deviceName,'fire')
            }
          })
        }else if(device.deviceName.includes('门')){
          this.doors.forEach((item)=>{
            if(item.name===device.modelName){
              this.setRepairIcon(item.mesh.position,device.deviceName,'door')
            }
          })
        }else if(device.deviceName.includes('灯')){
          this.lights.forEach((item)=>{
            if(item.name===device.modelName){
              this.setRepairIcon(item.mesh.position,device.deviceName,'light')
            }
          })
        }

      })
    },
    disposeWeather(){
      this.weatherTexture && this.weatherTexture.dispose()
      this.weatherGeometry && this.weatherGeometry.dispose()
      this.snowMaterial && this.snowMaterial.dispose()
      if(this.weatherParticles){
        this.weatherParticles.geometry.dispose()
        this.weatherParticles.material.dispose()
        this.scene.remove(this.weatherParticles)
      }
    },
    //设置建筑名称
    setBuildingName(){
      // 创建CSS3D对象
      const element = document.createElement('div');
      const element1 = document.createElement('div');
      element.className='buildingName'
      element1.className='buildingName'
      element.innerHTML='1号教学楼'
      element1.innerHTML='2号教学楼'
      element.style.color='#378de3'
      element1.style.color='#378de3'
      element1.style.fontWeight='bold'
      element.style.fontWeight='bold'
      this.title = new CSS3DObject(element);
      this.title1=new CSS3DObject(element1)
      this.title.position.set(0, 5, 5);
      this.title1.position.set(0, 5, -5);
      this.scene.add(this.title);
      this.scene.add(this.title1);
    },
    //设置卡片
    setCard(p,name,data){
      const position=JSON.parse(JSON.stringify(p))//深拷贝一份，防止移动模型位置
      if(name.includes('灯')){position.y-=0.1}
      console.log(position.y);
      const {icon,status,color}=this.getDeviceInfo(data)
      this.card && this.scene.remove(this.card)
      this.roomCard && this.scene.remove(this.roomCard)
      const card = document.createElement('div');
      card.innerHTML=`
       <div style="position:absolute;left:7px;top:8px;display: flex">
          <div class="iconfont ${icon}" style="font-size: 5px;color:${color};background-color: rgba(11,25,33,0.5);border-radius: 50%;"></div>
          <div style="font-size: 2px;margin-left: 3px;margin-top:1px">${name}</div>
       </div>
      `
      card.style.fontSize='1px'
      card.style.width='35px'
      card.style.height='15px'
      card.style.pointerEvents='none'
      card.style.background='url(images/device_box.png) no-repeat center center / 100% 100%'
      this.card = new CSS3DObject(card);
      this.card.scale.set(0.01,0.01,0.01)
      this.card.position.set(position.x,position.y,position.z);
      this.scene.add(this.card);
      this.animateCamera(data.modelPosition)
      this.disposeCardTimer && clearTimeout(this.disposeCardTimer);
      this.disposeRoomCardTimer && clearTimeout(this.disposeRoomCardTimer);
      this.disposeCardTimer=setTimeout(()=>{
        this.disposeCard()
      },10000)
    },
    setRoom(position,name,data){
      this.roomCard && this.scene.remove(this.roomCard)
      this.card && this.scene.remove(this.card)
      const card = document.createElement('div');
      let height,width
      if(data.status==='0'){
        height='15px'
        if(data.soonCourse){
          card.innerHTML=`
          <div style="position:absolute;padding:1px;font-size: 2.5px;color:#0be8e1">
            <div style="color:#10c710;position:absolute;right:-6px;font-size: 5px" class="iconfont icon-kongxianzhong" ></div>
            <div>教室：${name}</div>
            <div>当前状态: 空闲中</div>
            <div style="text-align: center;color:#eceff1;margin-left:8px;font-weight: bold">即将开始</div>
            <div>老师：${data.soonCourse.teacher.teacherName}</div>
            <div>课程：${data.soonCourse.courseName} </div>
            <div>时间：${data.soonCourse.courseTimeStart.slice(11, 16)}-${data.soonCourse.courseTimeEnd.slice(11, 16)}</div>
            <div>班级: ${data.soonCourse.sclass.className}</div>
        </div>`
          height='32px'
        }else{
          card.innerHTML=`
          <div style="position:absolute;padding:1px;font-size: 2.5px;color:#0be8e1">
            <div style="color:#10c710;position:absolute;right:-7px;font-size: 5px" class="iconfont icon-kongxianzhong" ></div>
            <div>教室：${name}</div>
            <div>状态: 空闲中</div>
            <div>下节课状态:空闲</div>
        </div>`
        }
        width='35px'
      }else if(data.status==='1'){
        if(data.soonCourse){
          card.innerHTML=`
          <div style="position:absolute;padding:1px;font-size: 2.5px;color:#0be8e1;display: flex;justify-content: space-between">
            <div style="font-size: 5px;color:#0e91ee;position:absolute;right:-5px" class="iconfont icon-shangkezhong1"></div>
            <div style="margin-left:2px;">
              <div style="text-align: center;color:#eceff1;font-weight: bold">当前课程</div>
              <div>教室：${name}</div>
              <div>老师：${data.course.teacher.teacherName}</div>
              <div>课程：${data.course.courseName} </div>
              <div>时间：${data.course.courseTimeStart.slice(11, 16)}-${data.course.courseTimeEnd.slice(11, 16)}</div>
              <div>班级: ${ data.course.sclass.className}</div>
            </div>
            <div style="margin-left:3px">
              <div style="text-align: center;color:#eceff1;margin-left:8px;font-weight: bold">即将开始</div>
              <div>教室：${name}</div>
              <div>老师：${data.soonCourse.teacher.teacherName}</div>
              <div>课程：${data.soonCourse.courseName} </div>
              <div>时间：${data.soonCourse.courseTimeStart.slice(11, 16)}-${data.soonCourse.courseTimeEnd.slice(11, 16)}</div>
              <div>班级: ${data.soonCourse.sclass.className}</div>
            </div>
         </div> `
          height='29px'
          width='60px'
        }else{
          card.innerHTML=`
          <div style="position:absolute;padding:1px;font-size: 2.5px;color:#0be8e1">
            <div style="font-size: 5px;color:#0e91ee;position:absolute;right:-8px" class="iconfont icon-shangkezhong1"></div>
            <div>教室：${name}</div>
            <div>老师：${data.course.teacher.teacherName}</div>
            <div>课程：${data.course.courseName} </div>
            <div>时间：${data.course.courseTimeStart.slice(11, 16)}-${data.course.courseTimeEnd.slice(11, 16)}</div>
            <div>班级: ${ data.course.sclass.className}</div>
            <div>下节课状态:空闲</div>
         </div> `
          height='28px'
          width='36px'
        }
      }else{
        card.innerHTML=`
       <div style="position:absolute;padding:1px;font-size: 2.5px;color:#0be8e1">
          <div style="color:red;position:absolute;right:-7px;font-size: 5px" class="iconfont icon-weixiuzhong" ></div>
          <div>教室：${name}</div>
          <div style="color:red">状态：维修中</div>
       </div>
      `
        width='35px'
        height='11px'
      }
      card.style.fontSize='1px'
      card.style.width=width
      card.style.padding='1px'
      card.style.height=height
      card.style.pointerEvents='none'
      card.style.background='url(images/roomCard.png) no-repeat center center / 100% 100%'
      this.roomCard = new CSS3DObject(card);
      this.roomCard.scale.set(0.05,0.05,0.05)
      this.roomCard.position.set(position.x,position.y+0.5,position.z);
      this.scene.add(this.roomCard);
      this.animateRoomCamer(position)
      this.disposeCardTimer && clearTimeout(this.disposeCardTimer);
      this.disposeRoomCardTimer && clearTimeout(this.disposeRoomCardTimer);
      this.disposeRoomCardTimer=setTimeout(()=>{
        this.disposeCard()
      },10000)
    },
    disposeCard(){
      this.card && this.scene.remove(this.card)
      this.roomCard && this.scene.remove(this.roomCard)
      this.outlinePass.selectedObjects=[]
      currentRoom.room=null
      currentDevice.device=null
      new TWEEN.Tween(this.camera.position)
        .to({x:18,y:8,z:0},2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      this.control.target.set(0,0,0)
      this.control.update()
    },
    setDeviceCard(device){
      if(!device)return
      if(device.deviceType==='0'){
        this.lights.forEach((light)=>{
          if(light.name===device.modelName){
            this.outlinePass.selectedObjects=[light.mesh]
            this.setCard(light.mesh.position,device.deviceName,device)
          }
        })
      }else if(device.deviceType==='1'){
        this.doors.forEach((door)=>{
          if(door.name===device.modelName){
            this.outlinePass.selectedObjects=[door.mesh]
            this.setCard(door.mesh.position,device.deviceName,device)
          }
        })
      }else{
        this.fireHydrant.forEach((fire)=>{
          if(fire.name===device.modelName){
            this.outlinePass.selectedObjects=[fire.mesh]
            this.setCard(fire.mesh.position,device.deviceName,device)
          }
        })
      }
    },
    setRoomCard(room){
      this.doors.forEach(door=>{
        if(room && door.name===room.positionModel){
          this.setRoom(door.mesh.position,room.roomName,room)
        }
      })
    },
    getDeviceInfo(device){
      let status,icon,color
      const colorObj={'0':'#3df613','1':'#18598d','2':'#e14545'}
      const statusObj={'0':'打开','1':'关闭','2':'维修中'}
      const iconObj={
        '0':{'0':'icon-light_open','1':'icon-light_close','2':'icon-light_repair-copy'},
        '1':{'0':'icon-door_open','1':'icon-door_close','2':'icon-door_repair-copy'},
        '2':{'0':'icon-fire_normal','1':'icon-fire_normal','2':'icon-fire_warning'}
      }
      if(device.deviceType==='0'){
        status=statusObj[device.deviceStatus]
        icon=iconObj['0'][device.deviceStatus]
      }else if(device.deviceType==='1'){
        status=statusObj[device.deviceStatus]
        icon=iconObj['1'][device.deviceStatus]
      }else{
        status=statusObj[device.deviceStatus]
        icon=iconObj['2'][device.deviceStatus]
      }
      color=colorObj[device.deviceStatus]
      return {status,icon,color}
    },
    //设置维修设备图标
    setRepairIcon(position,name,type){
      const icon=document.createElement('div')
      let iconClassName=''
      if(type==='fire'){
        iconClassName='icon-fire_warning'
      }else if(type==='door'){
        iconClassName='icon-door_repair-copy'
      }else if(type==='light'){
        iconClassName='icon-light_repair-copy'
      }
      icon.innerHTML =`
      <div style="display: flex;justify-content: center;align-items: center;flex-wrap: wrap">
        <div class="iconfont ${iconClassName}" style="font-size: 4px;color:red;width:100%;text-align: center"></div>
        <div style="font-size: 2px;font-weight: normal;border-radius: 1px;background-color:rgba(14,14,14,0.8);">
          <div>设备名：${name}</div>
          <div style="color:red;font-weight: bold">设备损坏</div>
        </div>
      </div>
      `
      this.icon = new CSS3DObject(icon);
      this.icon.scale.set(0.1,0.1,0.1)
      this.icon.position.set(position.x,position.y-0.3,position.z);
      this.iconGroup.add(this.icon)
    },

  },

}
</script>
<style lang="scss" scoped>
.gl-container {
  width: 100%;
  height: 100%;
  border: 1px solid #0c8ee8;
  box-shadow: 0 0 5px #0c8ee8;

}
.card{
  position: absolute;
  pointer-events: none;
  font-size: 0.5px;
}

</style>
