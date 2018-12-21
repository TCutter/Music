<template>
  <div class="progress-bar">
    <el-slider v-model="progress" :show-tooltip="false" @change="change"></el-slider>
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
    methods: {
      change (data) {
        console.log(data)
      }
    }
}
</script>

<style lang="stylus" scope>
  .progress-bar 
    margin 0 10px 
</style>

<style lang="stylus">
// 如果要修改 element-ui 样式，不能添加scope
@import "../../common/stylus/variable"

  .el-slider
    .el-slider__runway
      height 2px
      .el-slider__bar
        background-color $color-theme
        height 100%
      .el-slider__button-wrapper
        top -17px        
        .el-slider__button
          background-color $color-theme       
          border none 
</style>
