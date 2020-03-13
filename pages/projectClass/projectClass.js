// pages/projectClass/projectClass.js
const app = getApp();
const user = wx.getStorageSync('user');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kindlist: [],
    listByKind: [],
    pageNo: 1,   //分页
    ProjectKindNo: '',   //项目编号
    leftIdx: 0,
    noList: false,     //无列表数据
    BASE_url: app.globalData.BASE_url,
    
  },
  /**
   * 跳转详情页面
   */
  toProjectdetail(e) {
    let goodsid = e.currentTarget.dataset.goodsid;
    let _type = 1;    //项目1 产品2 卡项3
    console.log(goodsid);
    wx.navigateTo({
      url: '../projectDetail/projectDetail?goodsid=' + goodsid + '&&_type=' + _type,
    })
  },
  /**
   * 菜单项选择
   */
  chooseMenu(e) {
    let that = this;
    app.showToast({
      title: '加载中',//提示文字
      icon: 'loading', //图标，支持"success"、"loading"   
    })
    let idx = e.currentTarget.dataset.index;
    let kindlist = that.data.kindlist;
    let ProjectKindNo = kindlist[idx].ProjectKindNo;
    that.getListByKind(ProjectKindNo, 1);
    that.setData({
      leftIdx: idx,
      pageNo: 1,
      ProjectKindNo: ProjectKindNo,
    })
  },
  /**
   * 获取列表项
   */
  getKindList() {
    let that = this;
    app.showToast({
      title: '加载中',//提示文字
      icon: 'loading', //图标，支持"success"、"loading"   
    })
    let param = {
      customer_id: user.uid
    }
    app.request({
      url: app.getApi('project/project_kind_list'),
      data: param,
      success: function (res) {

        let list = res.list;
        if(list.length<1){
          that.setData({
            noList: true
          })
        }else{
          let GoodsKindNo = list[0].ProjectKindNo;
          that.setData({
            kindlist: list,
            ProjectKindNo: GoodsKindNo
          })
          that.getListByKind(GoodsKindNo);
        }
        
      },
      fail: function (error) {
        console.log(error);
      },
      complete() {
        app.hideToast();
      }
    })
  },
  /**
   * 按类型获取列表
   */
  getListByKind(GoodsKindNo, pageNo) {
    let that = this;
    let param = {
      ProjectKindNo: GoodsKindNo,
      customer_id: user.uid,
      page: pageNo,
      list_rows: 10
    }
    app.request({
      url: app.getApi('project/Project_list_by_kind'),
      data: param,
      success: function (res) {
        if (res.list == '') {
          that.setData({
            noList: true
          })
        } else {
          let listData = res.list.data;
          let listByKind = that.data.listByKind;    //已有的列表

          if (pageNo == 1) {
            listByKind = listData
          } else {
            listByKind = listByKind.concat(listData);
          }
          that.setData({
            noList: false,
            listByKind: listByKind
          })
        }

      },
      fail: function (error) {
        console.log(error);
      },
      complete() {
        app.hideToast();    //请求完成，隐藏加载提示
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKindList();
    app.setTitle();
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
    return (app.share());
  }
})