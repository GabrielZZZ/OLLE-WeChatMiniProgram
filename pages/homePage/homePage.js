const app = getApp();
var baseUrl = app.globalData.host;
var util = require('../../utils/util.js');
var imageUtil = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData:[],
    user_id: '',
    token: '',
    role: app.globalData.role,
    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    indicatordots: true,
    duration: 1000,
    profile_photo: '',
    imgUrls: [
      {
        link: '/pages/index/index',
        url: '../images/OLLE1.jpeg'
      }, {
        link: '/pages/logs/logs',
        url: '../images/OLLE1.jpeg'
      }, {
        link: '/pages/index/index',
        url: '../images/OLLE1.jpeg'
      }
    ],
    indicatorDots: true,  //小点
    autoplay1: true,  //是否自动轮播
    interval: 3000,  //间隔时间
    duration: 3000,  //滑动时间
  },

  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },

  pageEdit: function(){
    wx.navigateTo({
      url: '../pageEdit/pageEdit',
    })
  },

  showDetails: function (e) {
    var that = this;
    console.log(e)
    var index = e;
    console.log("id: " + that.data.pageData[index].page_id);
    wx.navigateTo({
      url: '../pageDetails/pageDetails?imageUrl=' + encodeURIComponent(that.data.pageData[index].imageUrl) + '&imageUrl2=' + encodeURIComponent(that.data.pageData[index].imageUrl2) + '&imageUrl3=' + encodeURIComponent(that.data.pageData[index].imageUrl3) + '&title=' + encodeURIComponent(that.data.pageData[index].page_title) + '&detail=' + encodeURIComponent(that.data.pageData[index].page_detail) + '&page_id=' + encodeURIComponent(that.data.pageData[index].page_id) + '&index=' + encodeURIComponent(index) + '&post_username=' + encodeURIComponent(that.data.pageData[index].post_username) + '&videoUrl=' + encodeURIComponent(that.data.pageData[index].videoUrl) + '&profile_photo=' + encodeURIComponent(that.data.pageData[index].profile_photo) + '&fileUrl=' + encodeURIComponent(that.data.pageData[index].fileUrl) 
      //the length is limited
      //therefore encodeURI here and decode at the receievr side
    })
  },

  dealFormIds: function (formId) {

    // if(app.globalData.gloabalFomIds){
    //   app.gloabalData.gloabalFomIds = '';
    // }

    app.globalData.globalFormIds = formId; //保存推送码并赋值给全局变量
  },

  formSubmit(e) {
    var that = this;
    var index = e.detail.target.id;

    console.log('form发生了submit事件，携带数据为：', e.detail);
    console.log("id: " + index);

    

    let formId = e.detail.formId;
    console.log("formID: " + e.detail.formId);

    this.dealFormIds(formId); //处理保存推送码
    that.showDetails(index);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({
      role: app.globalData.role
    })

    console.log("(homepage)The role is : " + that.data.role);

    wx.request({
      method: 'GET',
      url: baseUrl + 'getPages',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);

        // var index = res.data.length;

        that.setData({
          pageData: res.data.pageData
        })

        wx.setStorage({
          key: 'pageData',
          data: res.data.pageData,
        })

        console.log(that.data.pageData);
      },
      fail: function (res) {
        console.log("err: " + res)
      }
    })
    console.log(app.globalData.user_id)

    that.saveFormIds();

  },

  saveFormIds: function () {
    var formIds = app.globalData.globalFormIds; // 获取gloabalFomIds
    if (formIds && formIds != 'the formId is a mock one') {//gloabalFomIds存在的情况下 将数组转换为JSON字符串
      formIds = JSON.stringify(formIds);
      app.globalData.globalFormIds = false;
    }

    // var date_now = util.formatDate(new Date());

    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var year = date.getFullYear();
    //获取月份  
    var month = date.getMonth() + 1;
    //获取当日日期 
    var day = date.getDate();

//roughly calculate
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
    {
      if(day+7 > 31)
      {
        //move to next month
        month++;
        day = day+7-31;
      }else{
        day += 7;

      }

      if(month == 12)
      {
        //move to next year
        month = 1;
        year++;

      }
    } else if (month == 2){
      if (day + 7 > 27) {
        //move to next month
        month++;
        day = day + 7 - 27;
      } else {
        day += 7;

      }
    } else {
      if (day + 7 > 30) {
        //move to next month
        month++;
        day = day + 7 - 30;
      } else {
        day += 7;

      }

    }
  
   

    var date_expire = year + '-' + month + '-' + day
    console.log("expire_date:" + date_expire);



    if (formIds && formIds != 'the formId is a mock one'){
      wx.request({//通过网络请求发送openId和formIds到服务器
        url: baseUrl + 'saveFormId',
        method: 'POST',
        data: {
          'openId': app.globalData.openId,
          'formIds': formIds,
          'expire_date': date_expire
        },
        success: function (res) {
          console.log(res.data)
        }
      });
    }
    
  },

  sendNotification: function(){
    var that = this;

    console.log("sendNotification-accesstoken:" + app.globalData.access_token)

    wx.request({
      url: baseUrl + 'sendTemplateMessage',
      method: 'POST',
      data: {
        'access_token': app.globalData.access_token,
        'type': 0
        //0: mannualy send notification; only used for test now
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
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
    wx.reLaunch({
      url: 'homePage'
    })
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