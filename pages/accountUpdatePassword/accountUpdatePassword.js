const app = getApp();
var baseUrl = app.globalData.host;

Page({
  
  data: {
    user_id: ''
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    var that = this;

    if (e.detail.value.oldPassword && e.detail.value.newPassword && e.detail.value.confirmPassword)
    {
      if (e.detail.value.newPassword == e.detail.value.confirmPassword) {
        const requestTask = wx.request({
          method: 'POST',
          url: baseUrl + 'updatePassword',
          data: {
            'oldPass': e.detail.value.oldPassword,
            'newPass': e.detail.value.newPassword,
            'user_id': that.data.user_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data);

            //store the data in local
            wx.setStorage({
              key: 'userData',
              data: res.data.userData,
            })


            if (res.data.updateSuccess) {
              wx.showModal({
                title: 'SUCCESS',
                content: 'Data modified successfully',
                showCancel: false,

                confirmText: "Confirm",
                confirmColor: "#0f0",
                success: function (res) {
                  if (res.confirm) {
                    console.log("confirm");


                    //go back to login page and use new password
                    wx.reLaunch({
                      url: '../login/login',
                    })


                  } else if (res.cancel) {
                    console.log("cancle")
                  }
                }
              })
            } else {
              wx.showModal({
                title: 'Caution',
                content: 'Old password is incorrect. Please try again.',
                showCancel: false,

                confirmText: "Confirm",
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
          fail: function (res) {
            console.log('err' + ':' + res);

          }
        })
      } else {
        wx.showModal({
          title: 'Caution',
          content: 'New password does not match with confirm password.',
          showCancel: false,

          confirmText: "Confirm",
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
    } else {
      wx.showModal({
        title: 'Caution',
        content: 'Please complete all input fields.',
        showCancel: false,

        confirmText: "Confirm",
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
  
  
  
  onLoad: function (options) {
    var that = this;
    that.setData({
      user_id: options.user_id
    })

    // console.log("kind is " + that.data.kind);
  },

  
  onReady: function () {
    
  },

  
  onShow: function () {
    
  },

  
  onHide: function () {
    
  },

  
  onUnload: function () {
    
  },

 
  onPullDownRefresh: function () {
    
  },

  
  onReachBottom: function () {
    
  },

  
  onShareAppMessage: function () {
    
  }
})