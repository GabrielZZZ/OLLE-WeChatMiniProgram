const app = getApp();
var baseUrl = app.globalData.host;
var util = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    endDate: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    kind: ''//kind = 0: create event||kind = 1: edit event
  },

  bindStartDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },

  bindEndDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },

  bindStartTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
  },

  bindEndTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },


//send notifactions
  sendNotification: function () {
    var that = this;

    console.log("sendNotification-accesstoken:" + app.globalData.access_token)

    wx.request({
      url: baseUrl + 'sendTemplateMessage',
      method: 'POST',
      data: {
        'access_token': app.globalData.access_token,
        'type': 222
        //222: create a new event
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },




  
  dealFormIds: function (formId) {

    // if(app.globalData.gloabalFomIds){
    //   app.gloabalData.gloabalFomIds = '';
    // }

    app.globalData.gloabalFomIds = formId; //保存推送码并赋值给全局变量
  },


  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    let formId = e.detail.formId;
    console.log("formID: " + e.detail.formId);

    this.dealFormIds(formId); //处理保存推送码


    var that = this;
    var startTimeNew = e.detail.value.startDate + ' ' + e.detail.value.startTime;
    var endTimeNew = e.detail.value.endDate + ' ' + e.detail.value.endTime;
    console.log(new Date(startTimeNew).toISOString());

    // startTimeNew = util.formatTime(new Date(startTimeNew));
    // endTimeNew = util.formatTime(new Date(endTimeNew));

    // startTimeNew = new Date(startTimeNew).toISOString();
    // endTimeNew = new Date(endTimeNew).toISOString();

    // startTimeNew = util.formatTime(startTimeNew);
    // endTimeNew = util.formatTime(endTimeNew);

    // console.log("startTimeNew: "+startTimeNew);
    // console.log("endTimeNew: " + endTimeNew);


    if (e.detail.value.title && e.detail.value.description) {

      var module_kind;

      if(that.data.kind == 0){
        module_kind = 'storeCalendarEvent'
      }else{
        module_kind = 'updateCalendarEvent'
      }

      const requestTask = wx.request({
        method: 'POST',
        url: baseUrl + module_kind,
        data: {
          'title': e.detail.value.title,
          'description': e.detail.value.description,
          // 'start_time': util.formatTime(new Date(e.detail.value.startDate + ' ' + e.detail.value.startTime)),
          'startTime':startTimeNew,
          // 'end_time': util.formatTime(new Date(e.detail.value.endDate + ' ' + e.detail.value.endTime))
          'endTime': endTimeNew

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);


          if (res.data.stored) {
            wx.showModal({
              title: 'Success',
              content: 'Event created successfully!',
              showCancel: false,

              confirmText: "Confirm",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm");

                  that.sendNotification();


                  wx.reLaunch({
                    url: '../calander/calander',
                  })
                } else if (res.cancel) {
                  console.log("cancle")
                }
              }
            })
          } else if (res.data.updated){
            wx.showModal({
              title: 'Success',
              content: 'Event updated successfully!',
              showCancel: false,

              confirmText: "Confirm",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm");

                  wx.reLaunch({
                    url: '../calander/calander',
                  })
                } else if (res.cancel) {
                  console.log("cancle")
                }
              }
            })
          }

        },
        fail: function (res) {
          console.log('err' + ':' + res);

        }
      })
    } else {
      wx.showModal({
        title: 'Caution',
        content: 'Please complete all input fields.',
        showCancel: false,

        confirmText: "确定",
        confirmColor: "#0f0",
        success: function (res) {
          if (res.confirm) {
            console.log("confirm")
          } else if (res.cancel) {
            console.log("cancle")
          }
        }
      })
    }




  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      kind: options.id

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
    
  },

  
})