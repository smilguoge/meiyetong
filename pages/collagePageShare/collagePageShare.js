// pages/collagePage/collagePage.js
const app = getApp()
let user = wx.getStorageSync('user');
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
    isSuccess: false,      //拼团未成功
  },
 
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let that = this;
    let spelling_id = options.spelling_id;
    console.log(spelling_id)
    console.log(options);
    
    let param = {
      customer_id: user.uid,         //用户id
      customer_spelling_id: spelling_id,      //拼团id
    }
    that.setData({
      spelling_id: spelling_id
    })
    app.request({
      url: app.getApi('Spelling/spelling_detail'),
      data: param,
      success: function (res) {
        console.log(res);
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
          diffTime: diffTime
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
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
    // console.log('2');
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我正在拼' + this.data.spellingDetail.ProjectName,        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/collagePage/collagePage?shareUid=' + user.uid + '&spelling_id=' + this.data.spelling_id,        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    }
    // return (app.share());
  }
})