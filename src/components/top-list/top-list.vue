<template>
  <transition>
    <musiclist
    :title="title"
    :bgImage="bgImage"
    :songs="songs"
    :rank="rank"
    ></musiclist>
  </transition>
</template>

<script>
import musiclist from '@/components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from '@/api/rank'
import {ERR_OK} from '@/api/config'
import {createSong} from '@/common/js/song'

export default {
  components: {
    musiclist
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push({
          path: '/rank'
        })
        return
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        let musicData = item.data
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret  
    }
  }  
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
