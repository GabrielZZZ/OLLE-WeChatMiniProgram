const app = getApp();
var baseUrl = app.globalData.host;
var array = [];
var imageUtil = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicsData: [],
    user_id: '',
    token: '',
    topic_type: false,
    naaTopicsData: [],
    role: app.globalData.role,

    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    indicatordots: true,
    duration: 1000,

    profile_photo: '',
    language:'',
    scrollHeight:'',
    imageHeight:''
  },

  computeScrollViewHeight: function() {
    let that = this
    
    //获取屏幕可用高度
    let screenHeight = wx.getSystemInfoSync().windowHeight
    //计算 scroll-view 的高度
    let scrollHeight = screenHeight +  that.data.imageHeight
    console.log("scrollHeight: " + scrollHeight);
    that.setData({
      scrollHeight: scrollHeight
    })
    
  },

  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  changeTopicType: function (e) {
    var that  =  this;
    console.log(`Switch样式点击后是否选中：`, e.detail.value);

    that.setData({
      topic_type: e.detail.value
    })
  },


  showDetails: function (e) {
    var that = this;
    console.log(e) 
   var index = e;

  if(that.data.topic_type == false){
    console.log("fileUrl: " + that.data.topicsData[index].fileUrl);
    wx.navigateTo({
      url: '../forumDetails/forumDetails?week=' + encodeURIComponent(that.data.topicsData[index].topic_week) + '&title=' + encodeURIComponent(that.data.topicsData[index].topic_title) + '&date=' + encodeURIComponent(that.data.topicsData[index].topic_date) + '&detail=' + encodeURIComponent(that.data.topicsData[index].topic_detail) + '&topic_id=' + encodeURIComponent(that.data.topicsData[index].topic_id) + '&index=' + encodeURIComponent(index) + '&imageUrl=' + encodeURIComponent(that.data.topicsData[index].imageUrl) + '&imageUrl2=' + encodeURIComponent(that.data.topicsData[index].imageUrl2) + '&imageUrl3=' + encodeURIComponent(that.data.topicsData[index].imageUrl3)+ '&videoUrl=' + encodeURIComponent(that.data.topicsData[index].videoUrl) + '&fileUrl=' + encodeURIComponent(that.data.topicsData[index].fileUrl) + "&topic_tag=" + 0
      //the length is limited
      //therefore encodeURI here and decode at the receievr side
    })
  }else{
    console.log("fileUrl: " + that.data.naaTopicsData[index].fileUrl);
    wx.navigateTo({
      url: '../forumDetails/forumDetails?week=' + encodeURIComponent(that.data.naaTopicsData[index].topic_week) + '&title=' + encodeURIComponent(that.data.naaTopicsData[index].topic_title) + '&date=' + encodeURIComponent(that.data.naaTopicsData[index].topic_date) + '&detail=' + encodeURIComponent(that.data.naaTopicsData[index].topic_detail) + '&topic_id=' + encodeURIComponent(that.data.naaTopicsData[index].topic_id) + '&index=' + encodeURIComponent(index) + '&imageUrl=' + encodeURIComponent(that.data.naaTopicsData[index].imageUrl) + '&imageUrl2=' + encodeURIComponent(that.data.naaTopicsData[index].imageUrl2) + '&imageUrl3=' + encodeURIComponent(that.data.naaTopicsData[index].imageUrl3)+ '&videoUrl=' + encodeURIComponent(that.data.naaTopicsData[index].videoUrl) + '&fileUrl=' + encodeURIComponent(that.data.naaTopicsData[index].fileUrl) + "&topic_tag=" + 1
      //the length is limited
      //therefore encodeURI here and decode at the receievr side
    })
  }

    
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



  createTopic: function(){

    wx.showModal({
      title: 'Caution',
      content: 'Please choose which kind of topic you want to create:',
      showCancel: true,
      cancelText:"ALL",
      confirmText: "NAA",
      confirmColor: "#0f0",
      success: function (res) {
        if (res.confirm) {
          console.log("NAA");
          wx.navigateTo({
            url: '../createTopic/createTopic?id=' + 1,
          })
        } else if (res.cancel) {
          console.log("ALL");
          wx.navigateTo({
            url: '../createTopic/createTopic?id=' + 0,
          })
        }
      }
    })

  },






  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    //get NORMAL TOPICS
    wx.request({
      method: 'GET',
      url: baseUrl + 'getTopics',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);

        // var index = res.data.length;

        that.setData({
          topicsData: res.data.TopicsData
        })

        wx.setStorage({
          key: 'topicsData',
          data: res.data.TopicsData,
        })

        console.log(that.data.topicsData);
      },
      fail: function (res) {
        console.log("err: " + res)
      }
    })
    
  //get NAA TOPICS
    wx.request({
      method: 'GET',
      url: baseUrl + 'getNaaTopics',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);

        // var index = res.data.length;

        that.setData({
          naaTopicsData: res.data.TopicsData
        })

        wx.setStorage({
          key: 'naaTopicsData',
          data: res.data.TopicsData,
        })

        console.log(that.data.naaTopicsData);
      },
      fail: function (res) {
        console.log("err: " + res)
      }
    })

    that.setData({
      role: app.globalData.role
    })

    wx.getStorage({
      key: 'userData',
      success: function (res) {

        console.log(res)

        that.setData({
          language:res.data.language
        })
      },
    })


    console.log("The role is : " + that.data.role);

    console.log(app.globalData.user_id)
    
    that.saveFormIds();

    that.computeScrollViewHeight();

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
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      if (day + 7 > 31) {
        //move to next month
        month++;
        day = day + 7 - 31;
      } else {
        day += 7;

      }

      if (month == 12) {
        //move to next year
        month = 1;
        year++;

      }
    } else if (month == 2) {
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



    if (formIds && formIds != 'the formId is a mock one') {
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

  sendNotification: function () {
    var that = this;

    console.log("sendNotification-accesstoken:" + app.globalData.access_token)

    wx.request({
      url: baseUrl + 'sendTemplateMessage',
      method: 'POST',
      data: {
        'access_token': app.globalData.access_token
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
      url: 'forum'
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