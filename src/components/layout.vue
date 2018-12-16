<template>
  <div>
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from './m-header/m-header.vue'
import Tab from './tab/tab.vue'
import Player from './player/player.vue'

export default {
    components: {
      'm-header': MHeader,
      'tab': Tab,
      'player': Player
    }
}
</script>

<style scoped>

</style>
