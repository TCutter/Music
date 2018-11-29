import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/components/layout'
import rank from '@/components/rank/rank'
import recommend from '@/components/recommend/recommend'
import search from '@/components/search/search'
import singer from '@/components/singer/singer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'layout',
      component: layout,
      children: [
        {
          path: '',
          redirect: 'recommend'
        },
        {
          path: 'recommend',
          name: 'recommend',
          component: recommend
        },
        {
          path: 'singer',
          name: 'singer',
          component: singer 
        },
        {
          path: 'rank',
          name: 'rank',
          component: rank
        },  
        {
          path: 'search',
          name: 'search',
          component: search
        }
      ]
    }
  ]
})
