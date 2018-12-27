/*
* 1. 给子组件添加事件需要加 native
* 2. 如果要修改 element-ui 样式，不能添加scope
*/

<template>
  <div class="progress-bar">
    <el-slider 
    v-model="progress" 
    :show-tooltip="false"
    @touchstart.native="progressTouchStart"
    @touchmove.native="progressTouchMove"
    @touchend.native="progressTouchEnd"
    @change="progressChange"
    ref="slider"></el-slider>
  </div>
</template>

<script>
import {Slider} from 'element-ui'
import 'element-ui/lib/theme-chalk/slider.css'

export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    computed: {
      progress: { // element-ui 加上 新版 vue 的问题，如果不写成这样控制台会报错
        get () {
          return this.percent * 100
        },
        set () {   
        }
      }
    },
    components: {
      [Slider.name]: Slider
    },
    created () {
      this.touch = {}
      this.curPercent = 0
    },
    methods: {
      progressTouchStart (e) {
        this.touch.initialized = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.clientWidth * this.percent
      },
      progressTouchMove (e) {
        if (!this.touch.initialized) return
        this.touch.isDrag = true
        const diffX = e.touches[0].pageX - this.touch.startX
        this.curPercent = diffX / this.$refs.slider.$el.clientWidth + this.percent
      },
      progressTouchEnd (e) {
        this.touch.initialized = false
        if (this.touch.isDrag) {
          this.$emit('percentchange', this.curPercent)
        }
      },
      progressChange (data) {
        if (!this.touch.isDrag) {
          this.curPercent = this.$refs.slider.$children[0].value / 100
          this.$emit('percentchange', this.curPercent)
        }
        this.touch.isDrag = false
      }
    }
}
</script>

<style lang="stylus" scope>
  .progress-bar 
    margin 0 10px 
</style>

<style lang="stylus">
@import "../../common/stylus/variable"

  .el-slider
    .el-slider__runway
      height 4px
      background-color rgba(0,0,0,0.3)
      .el-slider__bar      
        height 100%
        background-color $color-theme
      .el-slider__button-wrapper
        top -16px        
        .el-slider__button
          background-color $color-theme       
          border none 
</style>
