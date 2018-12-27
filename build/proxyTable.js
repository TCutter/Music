/** 跨域代理配置(也可以使用 express, 以后再研究 )
 * 
 * target: 真实的请求值
 * bypass: 请求之前的相关配置
 * pathRewrite: 设置前缀,如果不进行配置那么代理的 url 会变成 target + '/api/getRecommend' + data
 */

module.exports = {
  '/api/getRecommend': {
    target: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
    changeOrigin: true,
    pathRewrite: {
      '^/api/getRecommend': ''
    } 
  },
  '/api/getDiscList': {
    target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
    bypass: function (req, res, proxyOptions) {
      // 设置请求头
      req.headers.referer = 'https://c.y.qq.com/',
      req.headers.host = 'c.y.qq.com'
    },    
    changeOrigin: true,
    pathRewrite: {
      '^/api/getDiscList': ''
    } 
  },
  '/api/getSingerList': {
    target: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',   
    changeOrigin: true,
    pathRewrite: {
      '^/api/getSingerList': ''
    } 
  },
  '/api/getSingerDetail': {
    target: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',   
    changeOrigin: true,
    pathRewrite: {
      '^/api/getSingerDetail': ''
    } 
  },
  '/api/getLyric': {
    target: ' https://api.bzqll.com/music/tencent/lrc',   
    changeOrigin: true,
    pathRewrite: {
      '^/api/getLyric': ''
    } 
  }
}
