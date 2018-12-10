import {commonParams} from './config'
import axios from 'axios'

export const getSingerList = () => {
  const url = '/api/getSingerList'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  })

  return axios.get(url, {
    params: data
  }).then(res => res.data)
}

export const getSingerDetail = (id) => {
  const url = '/api/getSingerDetail'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: id,
    g_tk: 5381
  })

  return axios.get(url, {
    params: data
  }).then(res => res.data)
}
