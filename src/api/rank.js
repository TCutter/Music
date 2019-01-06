import {commonParams} from './config'
import axios from 'axios'

export const getTopList = () => {
  const url = '/api/getTopList'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    g_tk: 2078284487,
    needNewCode: 1,
    format: 'json',
    notice: 0
  })
  return axios
    .get(url, {params: data})
    .then(res => {
      return res.data
  })
}

export const getMusicList = (topid) => {
  const url = '/api/getMusicList'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    g_tk: 2078284487,
    needNewCode: 1,
    format: 'json',
    page: 'detail',
    notice: 0,
    type: 'top',
    topid,
    tpl: 3
  })
  return axios
    .get(url, {params: data})
    .then(res => {
      return res.data
  })
}
