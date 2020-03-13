// pages/appointTechnician/appointTechnician.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noaccreditPhone:false,      //未注册
    leftList:[],
    leftIdx:0,
    chooseIcon: '../../images/chooseGray_2@2x.png',
    chooseIcon2: '../../images/choose_2@2x.png',
    technicianIdx: [],
    proList:[],
    isShow:false,
    dialogCont:'',      //预约信息内容字段
    chooseList:[],      //存放已选的项目
    count:[],           //存放右边已经选择的数量左边显示
    dialogdata:{},       //最后预约提交数据
    BASE_url: app.globalData.BASE_url
  },
  /**获取手机号授权成功 */
  loginPhone(e) {
    console.log(e);
    this.setData({
      noaccreditPhone: false,
      user: e.detail
    })
    // this.onLoad();    //刷新页面
  },
  /**
   * 左边选择菜单
   */
  chooseMenu:function (event) {
    var that = this;
    let idx = event.target.dataset.index;
    that.setData({
      leftIdx:idx
    })
    that.rightproject(idx)
  },
  /**
   * 选择具体项目
   */
  chooseProlistItem: function (event) {
    let that = this;
    //- 当前左右点击的顺序
    let index = event.currentTarget.dataset.index;    //right idnex
    let idx = event.currentTarget.dataset.idx;    //left idx
    //- 当前点击的id，name
    let projectid = event.currentTarget.dataset.projectid;
    let projectname = event.currentTarget.dataset.projectname;
    let technicianIdx = that.data.technicianIdx;    
    technicianIdx[idx] = index;

    let chooseList = that.data.chooseList;//- 保存的选择的项数据
    let count = that.data.count;//- 所有左边的点击数
    let countnow = count[idx];


  


    let list = that.data.proList;//- 所有右边二维项目数据
    let data_right = list[idx];//- 当前点击左边显示的二维项目数据
    for(var i=0;i<data_right.length;i++){
      if(i == +index){
         if(data_right[i].isselect){
           //- 取消选中
           data_right[i].isselect = false;//- 选中状态取消
           //- 在选中数组中取消当前取消的数据内容
           for(var i=0;i<chooseList.length;i++){
            if(chooseList[i].leftindex == idx && chooseList[i].rightindex == index){
              chooseList.splice(i,1);
            }
           }
           //- 更改当前左边对应的count
           countnow--;
           count[idx] = countnow;

         }else{
           //- 确认选中
           data_right[i].isselect = true;
           //- 最后要显示的数据
            let newdata = {
              leftindex: idx,
              rightindex: index,
              projectid: projectid,
              projectname: projectname
            };
            chooseList.push(newdata);
            countnow++;
            count[idx] = countnow;

         }
        
      }
    }
    list[idx] = data_right;//- 保存当前左边点击更改右边二维项目数据

    //- 设置保存数据
    that.setData({
      technicianIdx: technicianIdx,
      chooseList: chooseList,
      proList: list,
      count: count
    })

    // console.log(that.data.proList)
  },
  /**
   * 显示弹窗组件
   */
  showDialog: function() {
    var that = this;
    var chooseList = that.data.chooseList;
    if(chooseList.length == 0){
      app.showToast({
        title: '请选择项目',
        duration: 1500,
      })
      return;
    }
    var apponitmentdata;
    var projectdata = that.data.chooseList;
    var projectname=[];
    var projectId=[];
    for(var i=0;i<projectdata.length;i++){
      projectname.push(projectdata[i].projectname);
      projectId.push(projectdata[i].projectid);
    }
    projectname = projectname.join('/');
    projectId = projectId.join('/');

    app.getStorage({
      key: 'apponitmentdata',
      success: function(res){
        apponitmentdata = res.data;
        var data = res.data;
        var userdata = wx.getStorageSync('user');
        that.setData({
          isShow:true,
          dialogCont:{
            shopName: data.shopname,
            technician: data.Technicianname,
            projectName:projectname,
            proTimedate: data.calendar,
            proTimetime: data.start+'-'+data.end
          },
          dialogdata:{
            customer_id: userdata.uid, 
            shop_id: apponitmentdata.shopid,
            shop_name: apponitmentdata.shopname,
            employee_id: apponitmentdata.Technicianid,
            Employee: apponitmentdata.Technicianname,
            PlanWakeUpDate: apponitmentdata.calendar +" "+ apponitmentdata.start,
            PlanWakeUpDateEnd: apponitmentdata.calendar +" "+ apponitmentdata.end,
            ProjectId: projectId,
            lprojectname: projectname
          },

        });
      }
    });
  },
  /**
   * 隐藏弹窗，并回调事件
   */
  dialogEvent: function(e) {
    var that = this;
    let user = wx.getStorageSync('user');     //手机号授权登录注册后的用户信息
    console.log(user);
    if (user == '') {
      this.setData({
        noaccreditPhone: true
      })
      return false;
    }
    var data = that.data.dialogdata
    that.setData({
      isShow: false
    });
    app.request({
      url: app.getApi('appointment/appoint'),
      data: {
        customer_id: data.customer_id, 
        shop_id: data.shop_id,
        shop_name: data.shop_name,
        employee_id: data.employee_id,
        Employee: data.Employee,
        PlanWakeUpDate: data.PlanWakeUpDate,
        PlanWakeUpDateEnd: data.PlanWakeUpDateEnd,
        ProjectId: data.ProjectId,
        lprojectname: data.lprojectname
      },
      success: function(){
        app.showToast({
          title: '预约成功!',
          duration: 1500,
          error: function(error) {
            app.showToast({
              title: error.msg,
              duration: 1500,
            })
          },
          success: function(){
            setTimeout(function(){
              wx.switchTab({
                url: '../mine/mine',
              })
            },1500)
          },
          fali: function(){
            setTimeout(function(){
              wx.redirectTo({
                url: '../mine/mine',
              })
            },1500)
          }
        })
      }
    });
  },
  dialogEvent_close: function(e) {
    var that = this;
    that.setData({
      isShow: false
    });
  },
  //- 右边项目数据处理渲染
  rightproject: function(opt) {
    var that = this;
    var projectdata = that.data.leftList;
    var list = that.data.proList;
    var data = projectdata[opt].project;

    list[opt] = data;
    
    that.setData({
      proList: list
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setTitle();
    var that = this;
    app.request({
      url: app.getApi('appointment/project_list'),
      data: {},
      success: function(res){
        var data = res.list;
        var count = that.data.count;
        for(var i=0;i<data.length;i++){
          count.push(0);
        }
        that.setData({
          leftList: data,
          count: count
        })
        that.rightproject(0);
      }
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
    return (app.share());
  }
})