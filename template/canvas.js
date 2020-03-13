const app = getApp();
/**
   * 显示canvas层
   */
let showCanvas = (detail,that) => {

  console.log(detail);

  var context = wx.createCanvasContext('firstCanvas');
  var my_gradient = context.createLinearGradient(0, 0, 0, 170);

  let canvasImg = '';
  create_erweima();

  context.setFillStyle(my_gradient);

  // context.style.background="white";
  // let detail = detail;    //商品详情内容
  let imgurl = detail.cover || detail.pic || detail.Cover;      //图片地址

  let tit = detail.ProjectName || detail.GoodsName || detail.CardKindName || "美业通商品";    //商品标题
  let price = detail.Price || detail.SellMoney || 0;        //价格
  let shop = '门店：' + (detail.ShopName || "美业通");          //门店

  //获取网络图片本地路径
  wx.getImageInfo({
    src: imgurl,//服务器返回的图片地址
    success: function (res) {
      console.log(res);
      //res.path是网络图片的本地地址
      canvasImg = res.path;
      context.setFillStyle('white')
      context.fillRect(0, 0, 300, 400)

      context.drawImage(canvasImg, 0, 0, 300, 300);

      context.setFontSize(20)
      context.setFillStyle("#fd3d71");
      context.fillText(tit, 20, 340)

      context.setFontSize(12)
      context.setFillStyle("#999999");
      context.fillText(shop, 20, 370)

      context.drawImage(imgurl, 220, 320, 60, 60);

      context.draw();
    },
    fail: function (res) {
      //失败回调
    }
  });

  that.setData({
    isCanvas: true
  })
}
/**
 * 长按 canvas生成图片
 */
let canvas2img = () => {
  //获取相册授权
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            console.log('授权成功')
          }
        })
        return;
      }
    }
  })
  var context = wx.createCanvasContext('firstCanvas');
  wx.canvasToTempFilePath({
    x: 0,
    y: 0,
    canvasId: 'firstCanvas',
    success(res) {
      console.log(res)
      let tempPath = res.tempFilePath;
      wx.saveImageToPhotosAlbum({   //图片保存到本地
        filePath: tempPath,
        success: function (res) {
          console.log(res)
          app.showToast({
            title: '已保存到本地成功，快去分享吧^_^',
            duration: 2000
          })
        },
        fail: function (res) {
          console.log(res)
          console.log('fail')
        }
      })
    },
    fail(error) {
      console.log(error)
    }
  })

}
/**
 * 生成商品信息二维码
 */
let create_erweima = () => {
  console.log(111111)
  wx.request({
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    data: { 
      grant_type: 'client_credential',
      appid: 'wx724830c4e026bb48',
      secret: '8a0c598fd00bd8b90eb3cb9574a0e687' 
    },
    success(res) { 
      console.log(res)
      // wx.request({ // 获取token 
      //   url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=ACCESS_TOKEN', 
      //   data: { appid: 'wx724830c4e026bb48', secret: '8a0c598fd00bd8b90eb3cb9574a0e687' }, 
      //   success(res) { 
      //     wx.request({ // 调用接口C 
      //       url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + res.data.access_token, 
      //       method: 'POST', 
      //       data: { "path": "pages/meiTuan/meiTuan", "width": 430 }, 
      //       success(res) { // res是二进制流，后台获取后，直接保存为图片，然后将图片返回给前台 // 后台二进制怎么转图片？我也不会后台，学会了再贴代码
      //       console.log(3333)
      //         console.log(res); 
      //       } 
      //     }) 
      //   } 
      // })
    }
  })

}
module.exports = {
  showCanvas: showCanvas,
  canvas2img: canvas2img
}