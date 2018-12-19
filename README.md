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
