import {mapGetters} from 'vuex'

export const platListMxin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList (newVal) {
      this.handlePlayList(newVal)
    }
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  methods: {
    handlePlayList (list) {

    }
  }
}
