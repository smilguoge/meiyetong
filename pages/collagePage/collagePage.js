// pages/collagePage/collagePage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spelling_id: '',     //拼团id
    spellingDetail: '',    //商品详情
    spellingList: [],      //拼团人数
    num: 0,      //还需要拼团人数
    endTime: 0,      //拼团结束时间
    diffTime: '',   //计时器
    isLeader: false,     //默认本人不是团长
    customer_spelling_id: '',    //本页面团长id
    isSuccess: false,      //拼团未成功
    noaccredit: true,
    noaccreditPhone: true,
    noaccreditshop: true,
    isShare: false,    //是否分享进来
    order_sn: '',
    options: '',
  },
  /**获取授权成功 */
  login() {
    // this.setData({
    //   noaccredit: false
    // })
    this.onLoad();
  },
  /**获取手机号授权成功 */
  loginPhone(e) {
    let that = this;
    // this.setData({
    //   noaccreditPhone: false,
    // });
    this.onLoad()
  },
  /**获取门店授权成功 */
  loginshop(e) {
    // let options = that.data.options;
    // this.setData({
    //   noaccreditshop: false,
    // })
    // this.isShareCollage(options);
    this.onLoad();    //刷新页面
  },
  /**
   * 确认拼团
   */
  toPayment() {
    wx.navigateTo({
      // url: '../payment/payment?spellingDetial=' + JSON.stringify(this.data.spellingDetail) + '&&customer_spelling_id=' + this.data.customer_spelling_id,
      url: '../payment/payment?spellingId=' + this.data.spellingDetail.id + '&&customer_spelling_id=' + this.data.customer_spelling_id + '&&order_sn=' + this.data.order_sn,
    })
  },
  /**
   * 返回首页
   */
  toIndexpage() {
    console.log(1111)
    wx.switchTab({
      url: '../mine/mine',
      fail(e) {
        console.log(e)
      }
    })
    // wx.navigateTo({
    //   url: '../collage/collage',
    //   fail(e){
    //     console.log(e)
    //   }
    // })
  },
  isShareCollage(options) {
    let that = this;
    let user = wx.getStorageSync('user');
    let shareUid = options.shareUid;

    // 是否分享进来
    if (typeof (shareUid) == 'undefined' || shareUid == 'undefined') {
      console.log('不是分享')
    } else {
      console.log('分享')
      this.setData({
        isShare: true
      })
    }
    let spelling_id = options.spelling_id || "";    //拼团id
    let order_sn = options.order_sn || '';    //订单号
    that.setData({
      spelling_id: spelling_id,
      order_sn: order_sn
    })
    console.log(options);


    let param = {
      customer_id: user.uid,         //用户id
      customer_spelling_id: spelling_id,      //拼团id
      order: order_sn
    }
    app.request({
      url: app.getApi('Spelling/spelling_detail'),
      data: param,
      success: function (res) {
        console.log(res);

        // 当前本人是否 团长
        let leaderId = res.list[0].customer_id;
        if (leaderId == user.uid || res.isjoin == 1) {
          console.log('本人团长或者已参与拼团');
          that.setData({
            isLeader: true
          })
        } else {
          console.log('no');
        }
        let detail = res.detail;    //详情
        let endTime = res.time;     //拼团结束时间
        that.countDownTime(endTime);
        let diffTime = setInterval(() => {
          endTime--;
          let str = that.countDownTime(endTime);
          that.setData({
            endTime: str
          });
          if (endTime < 0) {
            clearInterval(diffTime);
            that.setData({
              endTime: str
            });
          }
        }, 1000);
        if (res.number == 0) {   //剩余0个人，表示已拼团成功
          that.setData({
            isSuccess: true
          });
          clearInterval(diffTime);    //结束倒计时
        }
        detail.bigPic = app.getImgUrl(detail.BigPic);
        that.setData({
          spellingDetail: detail,
          spellingList: res.list,
          num: res.number,
          diffTime: diffTime,
          customer_spelling_id: spelling_id
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  /**
* 绑定上下级
*/
  bingdRelation: function (shareUid) {
    console.log(shareUid)
    var uid = wx.getStorageSync('user').uid;
    app.request({
      url: app.getApi('login/updateIntroducer'),
      data: { superiorid: shareUid, Id: uid },
      sync: true,
      success: function (data) {

      },
      fail: function (error) {
        console.log(error.msg);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let that = this;
    console.log(options);
    var user = wx.getStorageSync('user');         //已注册用户信息
    if (options && options.shareUid) {
      that.bingdRelation(options.shareUid)
    }
    if (user == '') {   //未授权登录过
      that.setData({
        noaccredit: true,
        noaccreditPhone: true,
        noaccreditshop: true,
      })
    } else {
      //- 以下授权登录过
      //- 说明没有电话
      if (user.telphone == undefined || !user.telphone || user.telphone == '') {
        that.setData({
          noaccredit: false,
          noaccreditPhone: true,
        })
      }
      //- 说明有电话
      if (user.telphone) {
        that.setData({
          noaccredit: false,
          noaccreditPhone: false,
        })
      }
      //- 说明有门店
      if (user.shopid) {
        that.setData({
          noaccreditshop: false,
        })
      }
      //- 说明没有门店
      if (user.shopid == undefined || !user.shopid || user.shopid == '') {
        that.setData({
          noaccreditshop: true,
        })
      }
      that.setData({
        //- 用户数据保存
        user: user,
      })
    }
    that.setData({
      options: options
    })
    // let scene = decodeURIComponent(options.scene);
    that.isShareCollage(options);

  },
  /**倒计时 */
  countDownTime(intDiff) {
    if (intDiff > 0) {
      let day = Math.floor(intDiff / (60 * 60 * 24));
      let hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
      let minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
      let second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;

      intDiff--;

      let str = day + '天' + hour + '时' + minute + '分' + second + '秒';
      return str;
    } else {
      console.log('计时结束');
    }
  },

  /**返回首页 */
  toIndex() {
    wx.navigateTo({
      url: '../mine/mine'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let diffTime = this.data.diffTime;
    clearInterval(diffTime);
    this.setData({
      diffTime: diffTime
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let user = wx.getStorageSync('user');
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我正在拼' + this.data.spellingDetail.ProjectName,        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/collagePage/collagePage?shareUid=' + user.uid + '&spelling_id=' + this.data.spelling_id + '&order_sn=' + this.data.order_sn,        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
  }
})