var cheerio = require('cheerio');
var URL = require('url')
var url = 'http://www.baidu.com';
var MyFile = new BaaS.File()

function uploadImage(url) {
  return BaaS.request.get(url, {responseType: 'arraybuffer'}).then(res => {
    const img = new Buffer(res.data)
    return MyFile.upload(img, {filename: Math.random().toString().slice(2) + '.png'}) 
  })
}

module.exports = function (event, callback) {
  BaaS.request.get(url).then(res => {
    var images = [];
    var $ = cheerio.load(res.data, {decodeEntities: false});
    $('img').each(function (idx, element) {
      var $element = $(element);
      var src = URL.resolve(url, $element.attr('src'))
      images.push(src)
    })
    var jobs = images.map(src => uploadImage(src))
    Promise.all(jobs)
      .then(() => callback(null, '图片获取成功'))
      .catch(err => callback(err))
  }, err => {
    callback(err)
  })
}

