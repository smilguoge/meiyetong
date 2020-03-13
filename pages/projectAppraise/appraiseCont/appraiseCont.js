// pages/projectAppraise/appraiseCont/appraiseCont.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    MDID: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    assess_data:{},
    service_stars:0,  //服务水平
    technology_stars:0,  //技术水平
    Effect_stars:0,  //项目效果
    appraise_text:'',//评价的文字
    tel:''
  },
  ready(){
    var that = this;
    console.log(that.data.MDID)
    app.request({
      url: app.getApi('consume/info'),
      data: {
        MDID: that.data.MDID
      },
      success: function (res) {
        that.setData({
          assess_data:res
        })
        that.get_phone(res.info[0].ShopId)
      },
      fail: function (error) {
        app.showToast({
          title: error.msg,
          duration: 1500
        })
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭
    closeAllcollage() {
      console.log(this.data.MDID)
      this.triggerEvent("closeAllcollage");
    },
    //点击星星
    change_stars(e){
      var service_tpye = e.target.dataset.type//点击的是哪个类型的
      var that = this
      var id = e.target.id//点击第几个星星
      var num = e.target.dataset.index+1
      var stars = 0
      if(id){
        stars = num-1
      }else{
        switch (service_tpye) {
          case 'service':
            stars = that.data.service_stars + num
            break;
          case 'technology':
            stars = that.data.technology_stars + num
            break;
          case 'Effect':
            stars = that.data.Effect_stars + num
            break;
        }
      }
      switch (service_tpye){
        case 'service':
          that.setData({
            service_stars: stars
          });
          break;
        case 'technology':
          that.setData({
            technology_stars: stars
          });
          break;
        case 'Effect':
          that.setData({
            Effect_stars: stars
          });
          break;
      }
    },
    //评价
    appraise(e){
      var text = e.detail.value
      this.setData({
        appraise_text : text
      })
    },
    //提交评价
    submit_appraise(){
      var that = this
      // that.triggerEvent("closeAllcollage", 1);
      // return
      app.request({
        url: app.getApi('consume/evaluate_add'),
        data: {
          MDID: that.data.MDID,
          Comment: that.data.appraise_text,
          ServiceScore: that.data.service_stars,
          PointScore: that.data.technology_stars,
          ProScore: that.data.Effect_stars
        },
        success: function (res) {
          app.showToast({
            title: '评价成功',
            duration: 1500
          })
        },
        fail: function (error) {
          app.showToast({
            title: error.msg,
            duration: 1500
          })
        }
      })
      that.triggerEvent("closeAllcollage",1);
    },
    //获取到手机号
    get_phone(e){
      var that = this
      app.request({
        url: app.getApi('Consume/shop_tel'),
        data: {
          ShopId: e
        },
        success: function (res) {
          that.setData({
            tel: res.tel
          })
        },
        fail: function (error) {
          app.showToast({
            title: error.msg,
            duration: 1500
          })
        }
      })
    },
    //拨打电话
    call(){
      wx.makePhoneCall({
        phoneNumber: this.data.tel
      })
    },
  }
})
