<template>
  <transition name="slide">
    <musiclist
    :songs="songs"
    :bg-image="bgImage"
    :title="title"
    ></musiclist>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail, getSongVkey} from '@/api/singer'
import {ERR_OK} from '@/api/config'
import {createSong} from '@/common/js/song'
import musiclist from '@/components/music-list/music-list'

export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'singer' // 把 `this.singer` 映射为 `this.$store.getters.singer`
      ]),
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      }
    },
    components: {
      musiclist
    },
    created () {
      this._getDetail()
    },
    methods: {
      _getDetail () {
        if (!this.singer.id) {
          this.$router.push({path: '/singer'})
        }
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach(item => {        
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            getSongVkey(musicData.songmid).then((res) => {
              if (res.code === ERR_OK) {
                ret.push(createSong(musicData, res.data.items[0].vkey))
                return ret
              }
            })
          }
        })        
      }
    }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
