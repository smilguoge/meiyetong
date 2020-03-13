// components/canvasToimg/canvasToimg.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail:{
      type:JSON,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 隐藏canvas层
   */
    closeCanvas() {
      this.triggerEvent('closeCanvas');
    },
    /**
       * 显示canvas层
       */
    showCanvas() {
      var context = wx.createCanvasContext('firstCanvas');
      var my_gradient = context.createLinearGradient(0, 0, 0, 170);

      let canvasImg = '';

      context.setFillStyle(my_gradient);

      // context.style.background="white";
      let detail = this.data.detail;    //商品详情内容
      let imgurl = detail.cover || detail.pic;      //图片地址

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

      this.setData({
        isCanvas: true
      })
    },
    /**
     * 长按 canvas生成图片
     */
    canvas2img(e) {
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

    },
  }
})
