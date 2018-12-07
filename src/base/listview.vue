<template>
  <scroll class="listview" ref="scroll" :data="data" :probeType="probeType" :listenScroll="listenScroll" @scroll="onScroll">
    <ul>
      <li v-for="group in data" :key="group.id" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="(item ,index) in group.items" :key="index">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onTouchStart" @touchmove="onTouchMove">
      <ul>
        <li class="item" v-for="(shortcut, index) in shortcutList" :key="index" :class="{current: currentIndex===index}"
          :data-index="index">
          {{shortcut}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixedList" v-show="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-if="data.length===0">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import scroll from './scroll'
import loading from '@/base/loading'

import {getData} from '@/common/js/dom'

const ANCHOR_HEIGHT = 18
const FIXED_HEIGHT = 30

export default {
  components: {
    scroll,
    loading
  },
  props: {
    data: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((item) => {
        return item.title.slice(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
          return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data () { // 初始化的时候不走 watch
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    scrollY (newVal) {
      if (newVal > 0) {
        this.currentIndex = 0
        return
      }

      const listHeight = this.listHeight
      for (var j = 0, len = listHeight.length; j < len - 1; j++) {
        if (-newVal >= listHeight[j] && -newVal < listHeight[j + 1]) {
          this.currentIndex = j
          this.diff = listHeight[j + 1] + newVal
          return
        }
      }
      console.log(this.currentIndex)
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let offsetTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? newVal - FIXED_HEIGHT : 0
      if (offsetTop === this.offsetTop) return

      this.offsetTop = offsetTop
      console.log(offsetTop)
      this.$refs.fixedList.style.transform = `translate(0, ${offsetTop}px)`
    }
  },
  created () {
    this.touch = {} // 如果将数据写到 data/props/computed 中，那么 Vue 才会监听数据的变化，而该数据不需要被监听
    this.listHeight = []
    this.probeType = 3
    this.listenScroll = true
  },
  methods: {
    onScroll (pos) {
      this.scrollY = pos.y
    },
    onTouchStart (e) {
      let anthorIndex = getData(e.target, 'index')      
      this.touch.y1 = e.touches[0].pageY
      this.touch.anthorIndex = parseInt(anthorIndex)
      this._scrollTo(anthorIndex)
    },
    onTouchMove (e) {
      this.touch.y2 = e.touches[0].pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anthorIndex = this.touch.anthorIndex + delta
      this._scrollTo(anthorIndex)
    },
    _scrollTo (index) {
      if (!index && index !== 0) return

      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }

      this.scrollY = -this.listHeight[index]
      this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0)     
    },
    _calculateHeight () {
      let listGroup = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)

      for (let i = 0, len = listGroup.length; i < len; i++) {
        height += listGroup[i].clientHeight
        this.listHeight.push(height)
      }
    }

  }
}
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
