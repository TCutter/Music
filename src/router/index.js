import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/components/layout'
import rank from '@/components/rank/rank'
import recommend from '@/components/recommend/recommend'
import search from '@/components/search/search'
import singer from '@/components/singer/singer'
import SingerDetail from '@/components/singer-detail/singer-detail'
import Disc from '@/components/disc/disc'
import TopList from '@/components/top-list/top-list'

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
          component: recommend,
          children: [
            {
              path: ':id',
              name: 'disc',
              component: Disc
            }
          ]
        },
        {
          path: 'singer',
          name: 'singer',
          component: singer,
          children: [
            {
              path: ':id',
              name: 'singer-detail',
              component: SingerDetail
            }
          ]
        },
        {
          path: 'rank',
          name: 'rank',
          component: rank,
          children: [
            {
            path: ':id',
            name: 'toplist',
            component: TopList
          }
        ]
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
