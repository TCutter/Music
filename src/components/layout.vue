<template>
  <div>
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MHeader from './m-header/m-header.vue'
import Tab from './tab/tab.vue'

export default {
    components: {
      'm-header': MHeader,
      'tab': Tab
    }
}
</script>

<style scoped>

</style>
