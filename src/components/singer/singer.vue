<template>
  <div class="singer">
    歌手界面
  </div>
</template>

<script>
import {getSingerList} from '@/api/singer'
import {ERR_OK} from '@/api/config'
import Singer from '@/common/js/singer'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      _getSingerList () {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = res.data.list
            this._normalizeSinger()
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
        this.singers.forEach((item, index) => {
          if (item.Fsinger_name.includes('薛')) return
          let singer = new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })

          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(singer)
          }

          let key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(singer)
        })
        console.log(map)
      }
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
