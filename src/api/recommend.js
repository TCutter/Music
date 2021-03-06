import {commonParams} from './config'
import axios from 'axios'

export const getRecommend = () => {
  const url = '/api/getRecommend'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return axios
    .get(url, {params: data})
    .then(res => {
      // return Promise.resolve(res.data) 结果相同，不知道有什么区别
      return res.data
  })
}

export function getDiscList () {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  
  return axios
    .get(url, {params: data})
    .then((res) => {
      return res.data
  })
}

export const getSongList = function (disstid) {
  const url = '/api/getSongList'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq.json',
    hotstUin: 0,
    g_tk: 2078284487,
    needNewCode: 0,
    format: 'json',
    notice: 0
  })

  return axios
    .get(url, {params: data})
    .then((res) => {
      return res.data
  })
}
