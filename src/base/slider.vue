<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from '@/common/js/dom'

export default {
    data () {
      return {
        children: Object,
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted () {
      // 保证 dom 成功渲染，20ms 是经验值，浏览器是每 17ms 刷新一次
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
          this._autoPlay()
        }
      }, 20)

      var self = this
      window.addEventListener('resize', () => {
        if (!self.slider) {
          return 
        }
        self._setSliderWidth(true)
        self.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth (isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth

        Array.from(this.children).forEach(child => {
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px '
          width += sliderWidth
        })

        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false, 
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          click: true
        })

        var self = this
        this.slider.on('scrollEnd', () => {
          let pageIndex = self.slider.getCurrentPage().pageX
          if (self.loop) {
            pageIndex -= 1
          }
          self.currentPageIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._autoPlay()
          }
        })
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      },
      _autoPlay () {
        let pageIndex = this.currentPageIndex + 1
          if (this.loop) {
            pageIndex += 1
          }

        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    beforeDestroy () {
      console.log('beforeDestroy')
      clearTimeout(this.timer) // 使用keep-alive时，切换 tab 该方法不会被调用
    }
}
</script>

<style lang="stylus" scoped>
@import '../common/stylus/variable'

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
