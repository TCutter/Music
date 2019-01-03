<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <span class="icon-back"></span>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div 
        class="middle"
        @touchstart="toggleStart"
        @touchmove="toggleMove"
        @touchend="toggleEnd">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.img">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p 
                ref="lyricLine" 
                class="text"
                :class="{current: currentLineNum===index}"
                v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShowType==='cd'}"></span>
            <span class="dot" :class="{active: currentShowType==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime | formatTime}}</span>
            <div class="progress-bar-wrapper">
              <progressbar :percent="percent" @percentchange="onProgressBarChange"></progressbar>
            </div>
            <span class="time time-r">{{currentSong.duration | formatTime}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <span @click.stop="changeMode" :class="iconMode" ></span>
            </div>
            <div class="icon i-left" :class="disableCls">
              <span @click.stop="prev" class="icon-prev"></span>
            </div>
            <div class="icon i-center" :class="disableCls">
              <span @click.stop="togglePlaying" :class="playIcon"></span>
            </div>
            <div class="icon i-right" :class="disableCls">
              <span @click.stop="next" class="icon-next"></span>
            </div>
            <div class="icon i-right">
              <span class="icon-not-favorite"></span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.img" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progresscircle :radius="32" :percent="percent">
            <span @click.stop="togglePlaying" :class="playMiniIcon" class="icon-mini"></span>
          </progresscircle>
        </div>
        <div class="control">
          <span class="icon-playlist"></span>
        </div>
      </div>
    </transition>
    <audio 
    ref="audio" 
    :src="currentSong.url"
    @canplay="ready"
    @error="error"
    @timeupdate="updateTime"
    @ended="end"
    ></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from '@/components/progress-bar/progress-bar'
import ProgressCircle from '@/components/progress-circle/progress-circle'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/utils'
import Lyric from 'lyric-parser'
import Scroll from '@/base/scroll'
import {prefixStyle} from '@/common/js/dom'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  components: {
    progressbar: ProgressBar,
    progresscircle: ProgressCircle,
    scroll: Scroll
  },
  data () {
    return {
      isReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShowType: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    disableCls () {
      return this.isReady ? '' : 'disable'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    playMiniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    iconMode () {
      if (this.mode === playMode.sequence) {
        return 'icon-sequence'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'sequenceList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (newSong.id !== oldSong.id) {
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      }
    },
    playing (state) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        return state ? audio.play() : audio.pause()
      })      
    }
  },
  filters: {
    formatTime (interval) {
      interval = interval | 0
      let minute = interval / 60 | 0
      let second = (interval % 60).toString().padStart(2, '0')
      return `${minute}:${second}`
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    toggleStart (e) {
      this.touch.initialized = true
      let touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
      this.touch.moved = false
    },
    toggleMove (e) {
      if (!this.touch.initialized) return
      let touch = e.touches[0]
      let diffX = touch.pageX - this.touch.startX
      let diffY = touch.pageY - this.touch.startY
      if (Math.abs(diffX) < Math.abs(diffY)) return
      if (!this.touch.moved) this.touch.moved = true

      const left = this.currentShowType === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + diffX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      console.log(`this.touch.percent = ${this.touch.percent}`)

      this.$refs.cdWrapper.style.opacity = 1 - this.touch.percent
      this.$refs.cdWrapper.style[transitionDuration] = 0
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
    },
    toggleEnd (e) {
      if (!this.touch.moved) return      

      let offsetWidth
      let opacity
      if (this.currentShowType === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShowType = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }

      let time = 300
      this.$refs.cdWrapper.style.opacity = opacity
      this.$refs.cdWrapper.style[transitionDuration] = `${time}ms`
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.touch.initialized = false
    },
    getLyric () {
      this.currentSong.getLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this._handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    enter (el, done) {
      let {x, y, scale} = this._getPosAndScale()

      let animation = {
        '0%': {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        '60%': {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        '100%': {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'        
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter (el) {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      let {x, y, scale} = this._getPosAndScale()
      let animation = {
        '0%': {
          transform: `translate3d(0, 0, 0) scale(1)`
        },
        '40%': {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        '100%': {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        }
      }

      animations.registerAnimation({
        name: 'leave',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'        
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'leave', done)
    },
    afterLeave (el) {
      animations.unregisterAnimation('leave')
      this.$refs.cdWrapper.style.animation = ''
    },
    next () {
      if (!this.isReady) return
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
      }

      if (!this.playing) {
        this.togglePlaying()
      }
      this.isReady = false
    },
    prev () {
      if (!this.isReady) return
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
      }
      
      if (!this.playing) {
        this.togglePlaying()
      }
      this.isReady = false
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    ready () {
      this.isReady = true
    },
    error () {
      this.isReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    _getPosAndScale () {
      const miniLeft = 40
      const miniBottom = 30
      const miniWidth = 40
      const normalWidth = window.outerWidth * 0.4
      const normalLeft = window.outerWidth * 0.5
      const normalBottom = window.outerHeight - 80 + normalWidth

      let x = miniLeft - normalLeft
      let y = normalBottom - miniBottom
      const scale = miniWidth / normalWidth
      return {
        x,
        y,
        scale
      }
    },
    _handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]      
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)         
      }
      this.playingLyric = txt
    },
    _resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    togglePlaying () {
      if (!this.isReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if (this.mode === playMode.sequence) {
        list = this.sequenceList
      } else if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        return
      }
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            span
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            span
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.5s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
