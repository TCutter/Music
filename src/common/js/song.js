export default class Song {
  constructor ({id, mid, singer, name, album, duration, img, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.img = img
    this.url = url
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `https://api.bzqll.com/music/tencent/url?key=579621905&id=${musicData.songmid}&br=192`
  })
}

function filterSinger (singer) {
  if (!singer || singer.length === 0) return ''
  let nameList = singer.map((item) => item.name)
  return nameList.join('/')
}
