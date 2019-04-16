const app = getApp();
var baseUrl = app.globalData.host;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: 'uhuehduehfuehuf',
    description: 'hhh',
    startTime: '2019.2.28',
    endTime: '2019.2.28',
    event_id: '',
    user_id: '',
    token: ''
  }, 

  editEvent: function(){
    wx.navigateTo({
      url: '../calendarCreate/calendarCreate?id='+1,
    })
  },

  deleteEvent: function(){
    var that = this;

    const requestTask = wx.request({
      method: 'POST',
      url: baseUrl + 'deleteCalendarEvent',
      data: {
        'event_id': that.data.event_id,
        'user_id': that.data.user_id,
        'token': that.data.token

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);


        if (res.data.deleted) {
          wx.showModal({
            title: 'Success',
            content: 'Event deleted successfully!',
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      title: options.title,
      description: options.description,
      startTime: options.startTime,
      endTime: options.endTime,
      event_id: options.event_id

    })

    wx.getStorage({
      key: 'userData',
      success: function(res) {
        that.setData({
          user_id: res.data.user_id,
          token: res.data.token
        })
      },
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