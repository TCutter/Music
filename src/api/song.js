import axios from 'axios'

export const getLyric = (mid) => {
  const url = '/api/getLyric'

  const data = {
    key: 579621905,
    id: mid
  }

  return axios.get(url, {
    params: data
  }).then(res => res.data)
}
