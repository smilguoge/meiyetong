// components/payType/payType.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spellingDetial:{
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
    cancelPay() {
      this.triggerEvent('cancelPay');
    },
    // 微信支付
    wxpayEvent () {
      let that = this;
      let spellingDetial = this.data.spellingDetial;
      let user = wx.getStorageSync('user');
      console.log(spellingDetial);
      let payParam = '';
      switch (spellingDetial.Type) {//CardClassId卡项  project_id项目 goods_id产品
        case '1':
          payParam = {
            openid: user.openid,      //用户openid
            customer_id: user.uid,    //用户id
            quantity: 1,   //购买数量，1
            price: spellingDetial.OriginalPrice,     //价格
            CardClassId: spellingDetial.ProjectId,//CardClassId卡项  project_id项目 goods_id产品
            IsMinProgram: 1,
            spelling_id: spellingDetial.id,
            customer_spelling_id: that.data.customer_spelling_id
          }
          break;
        case '2':
          payParam = {
            openid: user.openid,      //用户openid
            customer_id: user.uid,    //商品id
            quantity: 1,   //购买数量，1
            price: spellingDetial.Price,     //价格
            CardClassId: spellingDetial.ProjectId,//CardClassId卡项  project_id项目 goods_id产品
            IsMinProgram: 1,
            spelling_id: spellingDetial.id,
            customer_spelling_id: that.data.customer_spelling_id
          }
          break;
        case '3':
          payParam = {
            openid: user.openid,      //用户openid
            customer_id: user.uid,    //用户id
            quantity: 1,   //购买数量，1
            price: spellingDetial.Price,     //价格
            CardClassId: spellingDetial.ProjectId,//CardClassId卡项  project_id项目 goods_id产品
            IsMinProgram: 1,
            spelling_id: spellingDetial.id,
            customer_spelling_id: that.data.customer_spelling_id
          }
          break;
        default:
          console.log('2')
          break;
      }
      
      app.request({
        url: app.getApi('Wxpay/pintuan_pay'),
        data:payParam,
        success: function (res) {
          console.log(res);
          let prepay_id = res.jsApiParameters.package.split("=")[1];
          // 微信支付接口
          wx.requestPayment({
            timeStamp: res.jsApiParameters.timeStamp,
            nonceStr: res.jsApiParameters.nonceStr,
            package: res.jsApiParameters.package,
            signType: res.jsApiParameters.signType,
            paySign: res.jsApiParameters.paySign,
            success: function (res) {    //支付成功
              console.log(res);
              let _jsonData = {
                openid: user.openid,
                template_id: 'QWXCWbNFZwNfRSoLPG984vF7sKHTW23OzlILoJcljt8',
                formid: prepay_id,
                page: "",
                spelling_name: spellingDetial.ProjectName + '拼团成功',
                customer_name: user.Name,
                price: spellingDetial.Price
              }
              wx.request({
                url: app.getApi('message/MinSendPintuanSuccess'),
                data: _jsonData,
                success: function (res) {
                  console.log(res)
                  wx.switchTab({      //跳转到“我的”页面
                    url: '../mine/mine',
                  })
                },
                fail: function (err) {
                  console.log('request fail ', err);
                }
              })
            },
            fail: function (error) {   //支付失败
              console.log(error);
              
              wx.showToast({
                title: '支付失败',
                icon:'none'
              })
            }
          })
        },
        fail: function (error) {
          console.log(error);
        }
      })
      
    }
  }
})
