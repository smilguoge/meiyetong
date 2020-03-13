// pages/proAndCartClass/proAndCartClass.js
let app = getApp();
let user = wx.getStorageSync('user');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _type:2,      //产品2，卡项3
    _listUrl: '',      //list请求接口地址
    _kindUrl: '',      //kind请求接口地址
    leftIdx:0,
    kindlist:[],
    listByKind:[],
    GoodsKindNo:'',   //产品编号
    CardKindNo:'',      //卡编号
    pageNo:1,   //分页
    noList:false,     //无列表数据
  },
  /**
   * 左边选择事件
   */
  chooseMenu(e) {
    let that = this;
    app.showToast({
      title: '加载中',//提示文字
      icon: 'loading', //图标，支持"success"、"loading"   
    })
    let idx = e.currentTarget.dataset.index;
    let kindlist = that.data.kindlist;
    let GoodsKindNo = kindlist[idx].GoodsKindNo || kindlist[idx].CardKindNo;
    let CardKindNo = kindlist[idx].CardKindNo;
    that.getListByKind(GoodsKindNo, 1);
    that.setData({
      leftIdx:idx,
      pageNo: 1,
      GoodsKindNo: GoodsKindNo,
      CardKindNo: CardKindNo
    })
  },
  /**
   * 跳转项目卡项产品详情页面
   */
  toProjectdetail(e) {
    let goodsid = e.currentTarget.dataset.goodsid;
    let _type = this.data._type;    //项目1 产品2 卡项3
    console.log(goodsid);
    wx.navigateTo({
      url: '../projectDetail/projectDetail?goodsid=' + goodsid + '&&_type=' + _type,
    })
  },
  /**
   * 获取列表项
   */
  getKindList() {
    let that = this;
    let _kindUrl = that.data._kindUrl;
    app.showToast({
      title: '加载中',//提示文字
      icon: 'loading', //图标，支持"success"、"loading"   
    })
    let param = {
      customer_id:user.uid
    }
    app.request({
      url: app.getApi(_kindUrl),
      data: param,
      success: function (res) {
        
        let list = res.list;
        let GoodsKindNo = list[0].GoodsKindNo || list[0].CardKindNo;
        that.setData({
          kindlist: list,
          GoodsKindNo: GoodsKindNo
        })
        that.getListByKind(GoodsKindNo,1);
      },
      fail: function (error) {
        console.log(error);
      },
      complete () {
        app.hideToast();
      }
    })
  },
  /**
   * 按类型获取列表
   */
  getListByKind(GoodsKindNo,pageNo) {
    let that = this;
    let _listUrl = that.data._listUrl;
    let param = {
      GoodsKindNo: GoodsKindNo,
      CardKindNo: GoodsKindNo,
      customer_id:user.uid,
      page: pageNo,
      list_rows:10
    }
    app.request({
      url: app.getApi(_listUrl),
      data: param,
      success: function (res) {
        
          let listData = res.list.data;
          let listByKind = that.data.listByKind;    //已有的列表
          console.log(listByKind);
          if(pageNo==1) {
            if (res.list.data == ''){
              that.setData({
                noList: true
              })
            }else{
              listByKind = listData;
            }
            console.log('pageno=1');

          }else{
            if (res.list.data == ''){
              wx.showToast({
                title: '暂无更多数据',
                icon:'none'
              })
            }else{
              listByKind = listByKind.concat(listData);
            // listByKind = [listByKind, ...listData];
            }
            
            console.log('pageno=n');
          }
          that.setData({
            noList: false,
            listByKind: listByKind
          })

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
    console.log(options);
    let _listUrl, _kindUrl;
    switch(options.type) {
      case '2':
        _kindUrl = 'Goods/Goods_kind_list';
        _listUrl = 'Goods/Goods_list_by_kind';
        break;
      case '3':
        _kindUrl = 'card/card_kind_list';
        _listUrl = 'card/card_list_by_kind';
        break;
      default:
        console.log(options.type);
        break;
    }
    this.setData({
      _type: options.type,
      _kindUrl: _kindUrl,
      _listUrl: _listUrl
    })
    this.getKindList();
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
    app.setTitle();
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
   * scroll组件上拉触底事件
   */
  bindscrolltolower() {
    let that = this;
    let pageNo = that.data.pageNo;
    let GoodsKindNo = that.data.GoodsKindNo;
    pageNo++;
    app.showToast({
      title: '加载中',//提示文字
      icon: 'loading', //图标，支持"success"、"loading"   
    })
    that.getListByKind(GoodsKindNo, pageNo);
    that.setData({
      pageNo: pageNo
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return (app.share());
  }
})