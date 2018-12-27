# music

> 音乐播放器

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## vuex 数据结构
- `singer: {}` // 歌手详情
- `playing: false` // 歌曲播放状态
- `fullScreen: false` // 全屏显示或隐藏
- `playList: []` // 播放列表
- `sequenceList: []` // 顺序歌曲列表
- `mode: Enum` // 播放模式
- `currentIndex: -1` // 当前歌曲的索引

## QQ 音乐接口整理
- 推荐列表：`https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg`
- 歌单列表：`https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg`
- 歌手列表：`https://c.y.qq.com/v8/fcg-bin/v8.fcg`
- 歌手详情：`https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg`
- 歌曲播放地址：`https://api.bzqll.com/music/tencent/url?key=579621905&id=${musicData.songmid}&br=192`
- 歌词地址： `https://api.bzqll.com/music/tencent/lrc?key=579621905&id=${musicData.songmid}`

> 网上常用的通过获取 vkey 的方法拼接播放地址行不通。因此找了一个新的方法，只需要 songmid 即可调用，具体使用方法参照 [网易云音乐/QQ音乐API更新](https://www.bzqll.com/2018/10/39.html)
