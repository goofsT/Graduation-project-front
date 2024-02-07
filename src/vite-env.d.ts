/// <reference types="vite/client" />
/**
 * 解决.vue文件模块找不到的问题
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}


declare module '@/api/index.ts'
declare module "particles.vue3";
declare module 'element-plus'
declare module '@/api/index.ts'
declare module '@/assets/js/particles-options.js'