const app = getApp();
var baseUrl = app.globalData.host;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'SPANISH', value: 'SPANISH' },
      { name: 'FRENCH', value: 'FRENCH'},
      { name: 'JAPANESE', value: 'JAPANESE' },
      { name: 'ITALIAN', value: 'ITALIAN' },
      { name: 'KOREAN', value: 'KOREAN' },
      { name: 'ENGLISH', value: 'ENGLISH' },
      { name: 'MANDARIAN', value: 'MANDARIAN' },
    ],

    arrow: '<-'
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);


    if (e.detail.value.username && e.detail.value.password && e.detail.value.name && e.detail.value.surname && e.detail.value.email && e.detail.value.language){
      var that = this;

      const requestTask = wx.request({
        method: 'POST',
        url: baseUrl + 'signup',
        data: {
          'username': e.detail.value.username,
          'password': e.detail.value.password,
          'name': e.detail.value.name,
          'surname': e.detail.value.surname,
          'email': e.detail.value.email,
          'language': e.detail.value.language
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);

          if (res.data.userData) {
            wx.navigateTo({
              url: '../verification/verification?email=' + e.detail.value.email,
            })
          } else {

            if (res.data.error2) {
              wx.showModal({
                title: 'Caution',
                content: 'Repeated Username.',
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

            if (res.data.error1) {
              wx.showModal({
                title: 'Caution',
                content: 'You are not a nottingham user.Please turn to the application.',
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

            if (res.data.error3) {
              wx.showModal({
                title: 'Caution',
                content: 'Repeated email.',
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

          }

          

          


        },
        fail: function (res) {
          console.log('err' + ':' + res);

        }
      })
    } else {
      wx.showModal({
        title: 'Caution',
        content: 'Please fill-up the the required fields.',
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