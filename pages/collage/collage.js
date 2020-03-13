// pages/collage/collage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImg:[],
    hotCollage:[],        //热销拼团列表
    indicatorDots: false,
    indicatorDotsActive:'white',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    collageMenu:[{
      icon:'../../images/collageindex_all@2x.png',
      text:'全部'
    }, {
        icon: '../../images/collageindex_pro@2x.png',
      text: '项目'
    }, {
        icon: '../../images/collageindex_product@2x.png',
      text: '产品分类'
    }, {
        icon: '../../images/collageindex_card@2x.png',
      text: '卡项'
    }],
    collageMenuIdx:0,
    collageList:new Array(6),
    noaccredit:false
    // isCollage:[true,false,false,false],
  },
  /**
   * 选择menu选项
   */
  chooseMenu: function(event) {
    let that = this;
    let idx = event.currentTarget.dataset.index;
    let _type;
    this.setData({
      collageMenuIdx:idx,
    });
    if(idx == 1) {
      _type = 2;
    } else if (idx == 2) {
      _type = 3;
    } else if (idx == 3) {
      _type = 1;
    }else{
      _type = 0
    }
    that.getHotSpelling(_type);   //热销

    that.getNotHotSpelling(_type);    //非热销

  },
  /**
   * 跳转到拼团详情
   */
  toCollageDetal (event) {
    let id = event.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../collageDetail/collageDetail?id='+id,
    })
  },
  /**获取拼团列表数据 */
  getSpelling (opt,callback) {
    let that = this;
    let _opt = opt || {};
    let param = {
      Type: _opt.Type,     //1：卡项 2：项目 3：产品 （全部传0或不传）
      IsHot: _opt.IsHot,       //是否热门(0是热门1是非热门默认可不传)
      page: _opt.page || 1,         //第几页,默认第1页
      list_rows: _opt.rows || 10    //一页有几个,默认10条
    }
    app.request({
      url: app.getApi('spelling/index'),
      data: param,
      success: function (res) {
        console.log(res);
        let _data = res.list.data;        //数据列表
        
        callback(_data);
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**获取热销拼团列表 */
  getHotSpelling (_type) {
    let that = this;
    that.getSpelling({
      Type:_type,
      IsHot: 0
    },(data) => {
      data.forEach(value => {
        if (value.Cover == "") {

        } else {
          value.Cover = app.getImgUrl(value.Cover);
        }

      });
      that.setData({
        hotCollage: data
      })
    })
  },
  /**获取非热销拼团列表 */
  getNotHotSpelling(_type) {
    let that = this;
    that.getSpelling({
      Type: _type,
      IsHot: 1
    }, (data) => {
      data.forEach(value => {
        if (value.Cover == "") {

        } else {
          value.Cover = app.getImgUrl(value.Cover);
        }

      });
      that.setData({
        collageList: data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    let that = this;
    // 拼团首页广告
    app.request({
      url: app.getApi('advertisement/ad_list'),
      data:{
        flag:'index'
      },
      success: function (res) {
        console.log(res);
        let bannerlist = res.list;
        bannerlist.forEach(value=>{
          value.plug_ad_pic = app.getImgUrl(value.plug_ad_pic);
        })
        that.setData({
          bannerImg:res.list
        })
      },
      fail: function (error) {
        console.log(error);
      }
    });


    that.getHotSpelling(0);   //初始页面的时候展示拼团数据，IsHot=0为热销
    

    that.getNotHotSpelling(0);   //初始页面的时候展示拼团数据，IsHot=1为非热销
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  login () {
    this.setData({
      noaccredit: false
    })
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
    return (app.share());
  }
})