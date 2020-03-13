// pages/seckillList/seckillList.js
var app = getApp();
let wxUser = wx.getStorageSync('wxUser');
var WxParse = require('../../wxParse/wxParse.js')     //html转换成小程序标签模板
let user = wx.getStorageSync('user');
let _time = 0;//- 记录倒计时定时器时间
let timeFun = null;//- 记录倒计时定时器方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    noaccredit: false,
    indicatorDots: true,
    indicatorDotsActive: 'white',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    btnIdx: '',//- nav选中序列
    cover: false,
    BASE_url: app.globalData.BASE_url,
    ad_list: '',//- 广告列表
    nav_list: '',//- nav列表
    day: '',//- 天
    hour: '',//- 小时
    minute: '',//- 分钟
    second: '',//- 秒
    Listdata: '',//- 活动列表数据
    type: '',//- 显示类型：0 秒杀中，-1结束，1即将开始
  },
  /**
   * 选择活动
   */
  chooseCatch: function (e) {
    let that = this;
    let _index = e.currentTarget.dataset.index;
    let start = e.currentTarget.dataset.start;
    let end = e.currentTarget.dataset.end;
    let type = e.currentTarget.dataset.type;
    this.setData({
      btnIdx: _index,
      type: type
    });

    that.clearData();
    that.gettimecount(start, end);
    that.getProjectList(start);

  },
  /**
   * 查看规则
   */
  showCover: function () {
    this.setData({
      cover: true
    })
  },
  /**
  * 隐藏规则
  */
  hideCover: function () {
    this.setData({
      cover: false
    })
  },
  /**
  * 子组件反馈传值页面跳转
  */
  fartherPage_go: function (e) {
    let _type = e.detail.type;
    switch (_type) {
      case 1:
        console.log("前往抢购");
        let ProjectId = e.detail.ProjectId;
        let seckillId = e.detail.seckillId;
        wx.navigateTo({
          url: '../seckillProject/seckillProject?GoodId=' + ProjectId + '&seckillId=' + seckillId
        });
        break;
      case 2:
        console.log("前往提醒");
        let id = e.detail.seckillId;
        this.remind(id);
        break;
      case 3:
        console.log("前往结束");
        wx.showToast({
          title: '很遗憾~~，活动已结束,下回再来',//提示文字
          duration: 1500,//显示时长
          mask: true,//是否显示透明蒙层，防止触摸穿透，默认：true
          icon: 'none', //图标，支持"success"、"loading"  
        })
        break;


    }
  },
  /**
   * 获取图片广告信息
   */
  getadList: function () {
    let that = this;
    app.request({
      url: app.getApi('Advertisement/ad_list'),
      data: {
        flag: 'SpikeActivity'
      },
      success: function (res) {
        let data = res.list;
        console.log(data);
        that.setData({
          ad_list: data
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 获取nav时间轴
   */
  getnavList: function () {
    let that = this;
    app.request({
      url: app.getApi('Activity/time_activity_list'),
      data: {},
      success: function (res) {
        let data = res.list;
        var arr = []
        for (let i in data) {
          arr.push(data[i]); //属性
        }
        console.log(arr);
        if (arr.length > 0) {
          let countnav = 1;
          let selectidx = '';
          for (let i = 0; i < arr.length; i++) {
            let startday = arr[i].StartTime.substr(8, 2);
            let starttime = arr[i].StartTime.substr(11, 5);
            arr[i].startday = startday;
            arr[i].start_time = starttime;
            if (countnav == 1 && arr[i].type != -1) {
              //- 按钮判断是否第一选中状态
              that.setData({
                btnIdx: i,
                type: arr[i].type
              });
              selectidx = i;
              countnav = 2;
            }
          }
          console.log(selectidx)
          if (selectidx == '') {
            selectidx = 0;
            that.setData({
              btnIdx: 0,
              type: arr[0].type
            });
          }
          that.setData({
            nav_list: arr
          });
          that.gettimecount(arr[selectidx].StartTime, arr[selectidx].EndTime);
          that.getProjectList(arr[selectidx].StartTime);
        }

      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 获取nav时间轴倒计时
   */
  gettimecount: function (start, end) {
    let that = this;
    app.request({
      url: app.getApi('Activity/remain_time'),
      data: {
        StartTime: start,
        EndTime: end
      },
      success: function (res) {
        let data = res.list.data;
        let _time = data.list.remain_time;//-秒
        timeFun = setInterval(function () {
          _time--;
          that.count(_time);
        }, 1000);

      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 倒计时计算
   */
  count: function (time) {
    let that = this;
    let d,
      h,
      m,
      s;
    //定义变量 d,h,m,s保存倒计时的时间  
    if (time >= 0) {
      d = Math.floor(time / 60 / 60 / 24); //- 日
      h = Math.floor(time / 60 / 60 % 24); //- 时  
      m = Math.floor(time / 60 % 60);    //- 分  
      s = Math.floor(time % 60);      //- 秒
    } else {
      clearInterval(timeFun);
    }
    //将0-9的数字前面加上0，例1变为01
    d = checkTime(d);
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    function checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }
    that.setData({
      day: d,
      hour: h,
      minute: m,
      second: s
    })
    //递归每秒调用countTime方法，显示动态时间效果
    time--;
  },
  /**
   * 获取活动列表数据
   */
  getProjectList: function (start) {
    // app.showToast({
    //   title: '加载中',//提示文字
    //   icon: 'loading', //图标，支持"success"、"loading"   
    // })
    let that = this;
    app.request({
      url: app.getApi('Activity/goods_activity_list'),
      data: {
        page: 1,
        list_rows: 30,
        StartTime: start
      },
      success: function (res) {
        that.setData({
          Listdata: res.list.data
        })
        app.hideToast();

      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 清除定时器展示数据
   */
  clearData: function (check) {
    let that = this;
    clearInterval(timeFun);
    that.setData({
      day: '',//- 天
      hour: '',//- 小时
      minute: '',//- 分钟
      second: '',//- 秒
      Listdata: '',//- 活动列表数据
    });
  },
  /**
   * 活动提醒
   */
  remind: function (id) {
    let that = this;
    app.request({
      url: app.getApi('Activity/remind_me'),
      data: {
        customer_id: that.data.uid,
        sub_activity_id: id
      },
      success: function (res) {
        wx.showToast({
          title: '提醒成功',//提示文字
          duration: 1500,//显示时长
          mask: true,//是否显示透明蒙层，防止触摸穿透，默认：true
          icon: 'success', //图标，支持"success"、"loading"  
        })

      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
    * 获取活动规则
    */
  get_rules: function () {
    let that = this;
    app.request({
      url: app.getApi('Activity/activity_about'),
      data: {},
      success: function (res) {
        let data = res.list.ActivityContent;
        if (data) {
          WxParse.wxParse('article', 'html', data, that, 5);   //插件，转换html标签
        }

      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    let that = this;
    let user = wx.getStorageSync('user');         //已注册用户信息
    // app.showToast({
    //   title: '加载中',//提示文字
    //   icon: 'loading', //图标，支持"success"、"loading"   
    // })
    that.getadList();
    that.getnavList();
    that.get_rules();
    that.setData({
      uid: user.uid
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
  onShareAppMessage: function () {

  }
})