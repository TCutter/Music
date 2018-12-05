<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: () => []
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        var self = this
        if (this.listenScroll) {
          self.scroll.on('scroll', pos => {
            self.$emit('scroll', pos)
          })
        }
      },
      enable () {
        return this.scroll && this.scroll.enable()
      },
      disable () {
        return this.scroll && this.scroll.disable()
      },
      refresh () {
        return this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        return this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        return this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
}
</script>

<style scoped>

</style>
