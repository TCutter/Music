<template>
  <div class="singer" ref="singer">
    <listview :data="singers" @select="selectSinger" ref="listview"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from '@/api/singer'
import {ERR_OK} from '@/api/config'
import Singer from '@/common/js/singer'
import listview from '@/base/listview'
import {mapMutations} from 'vuex'
import {playListMixin} from '@/common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
    mixins: [playListMixin],
    components: {
      listview
    },
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      handlePlayList (list) {
        const bottom = list.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.listview.refresh()
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // this.$router.push({
        //   name: 'singer-detail',
        //   params: {id: singer.id}
        // })

        this.setSinger(singer)
      },
      _getSingerList () {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list) 
          }
        })
      },
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (item.Fsinger_name.includes('薛')) return
          let singer = new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })

          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(singer)
          }

          let key = item.Findex
          if (!(/[a-z]/i).test(key)) return
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(singer)
        })
        let arr = Object.values(map).sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
          })

          arr.unshift(arr.pop())
          return arr
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
}
</script>

<style lang="stylus" scoped>
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
