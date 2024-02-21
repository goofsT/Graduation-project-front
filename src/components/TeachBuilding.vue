<template>
  <div class="gl-container" ref="container"></div>
</template>
<script lang="ts">
import * as THREE from 'three'
//导入hdr图库
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {mergeGeometries} from "three/examples/jsm/utils/BufferGeometryUtils";
import { useWeatherStore } from "@/store/weatherStore.ts";
import { PointLightHelper } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { getWeather } from "@/api/weather.ts";
import { ElMessage } from "element-plus";
//添加坐标轴辅助
export default {
  name: 'TeachBuilding',
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
      corridorLightLeft:[],
      corridorLightRight:[],//走廊灯
      leftClassLight:[],
      rightClassLight:[],//教室灯
      classDoorRight:[],
      classDoorLeft:[],//教室门
      leftBuildingDoor:[],
      rightBuildingDoor:[],//顶楼/一楼教学楼门
      rayCasterMeshes:[],//射线检测的mesh
      showWeather:true//是否显示天气
    }
  },
  mounted() {
    this.getContainerInfo()
    this.initSeen()
    this.initModel()
  },
  beforeUnmount() {
    cancelAnimationFrame(this.renderId)
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
      //添加场景雾
      this.scene.fog=new THREE.Fog('#6c6969',0.015,500)
      //添加天空盒子纹理
      const skybox = new THREE.CubeTextureLoader()
        .setPath( '/textures/Park3Med/' )
        .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
      this.scene.background = skybox
      this.scene.environment = skybox

      this.camera = new THREE.PerspectiveCamera(45,this.containerWidth/this.containerHeight,0.1,200)
      this.camera.position.set(15,5,0)
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

      //效果合成器
      // this.composer = new EffectComposer(this.renderer)
      // this.composer.addPass(new RenderPass(this.scene, this.camera))
      // const ssrPass=new SSRPass({
      //   renderer:this.renderer,
      //   scene:this.scene,
      //   camera:this.camera,
      //   width:this.containerWidth,
      //   height:this.containerHeight,
      // })
      // this.composer.addPass(ssrPass)
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
      setTimeout(()=>{
        this.showWeather=false
        setTimeout(()=>{
          this.showWeather=true
        },5000)
      },5000)
      this.render()
    },
    render(){
      this.control.update()
      this.renderWeather()
      // this.composer.render()//使用效果合成器渲染
      this.renderer.render(this.scene, this.camera)
      this.renderId = requestAnimationFrame(this.render)
    },
    renderWeather(){
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
        this.weatherParticles && this.scene.remove(this.weatherParticles)
      }
    },
    initModel(){
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/gltf/')
      const modelLoader = new GLTFLoader()
      modelLoader.setDRACOLoader(dracoLoader)
      //加载模型
      modelLoader.load('/model/tea.glb', (glb) => {
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
              }else{
                item.castShadow = true
                item.receiveShadow = true
              }
            }
          }
        })
        this.handleRaycaster()//射线检测
        // console.log('左边教室灯',this.leftClassLight);
        // console.log('右边教室灯',this.rightClassLight);
        // console.log('左边走廊灯',this.corridorLightLeft);
        // console.log('右边走廊灯',this.corridorLightRight);
        // console.log('左边教室门',this.classDoorLeft);
        // console.log('右边教室门',this.classDoorRight);
        // console.log('左大门',this.leftBuildingDoor);
        console.log('右大门',this.rightBuildingDoor);

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
    },
    createLight(position){
      const pointLight=new THREE.PointLight(0xffffff,0,6)
      pointLight.position.set(position.x,position.y-0.1,position.z)
      // const pointLightHelper = new PointLightHelper(pointLight, 0.1);
      // this.scene.add(pointLightHelper);
      // this.scene.add(pointLight)
      return pointLight
    },
    saveDoor(mesh){
        if(mesh.name.includes('door')&&mesh.name.includes('right')) {
          if(mesh.name.includes('class')){
            this.classDoorRight.push({name:mesh.name,mesh})
          }else{
            this.rightBuildingDoor.push({name:mesh.name,mesh})
          }
          this.rayCasterMeshes.push(mesh)
          return
        }
        if(mesh.name.includes('door')&&mesh.name.includes('left')) {
          if(mesh.name.includes('class')){
            this.classDoorLeft.push({name:mesh.name,mesh})
          }else{
            this.leftBuildingDoor.push({name:mesh.name,mesh})
          }
          this.rayCasterMeshes.push(mesh)
        }
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
            console.log(obj.parent);
            const current=obj.parent
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
        size:1,//大小
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
    disposeWeather(){
      this.weatherTexture && this.weatherTexture.dispose()
      this.weatherGeometry && this.weatherGeometry.dispose()
      this.snowMaterial && this.snowMaterial.dispose()
      if(this.weatherParticles){
        this.weatherParticles.geometry.dispose()
        this.weatherParticles.material.dispose()
        this.scene.remove(this.weatherParticles)
      }
    }

  },

}
</script>
<style scoped>
.gl-container {
  width: 100%;
  height: 100%;
  border: 1px solid #0c8ee8;
  box-shadow: 0 0 5px #0c8ee8;
}
</style>
