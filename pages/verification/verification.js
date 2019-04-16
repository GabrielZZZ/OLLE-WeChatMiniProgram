const app = getApp();
var baseUrl = app.globalData.host;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    userData: []
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    var that = this;



    if (e.detail.value.validation) {
      console.log(e.detail.value.validation)
      console.log(that.data.email)
      const requestTask = wx.request({
        method: 'POST',
        url: baseUrl + 'verifyAccount',
        data: {
          'valCode': e.detail.value.validation,
          'email': that.data.email,
          'name': ''
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);


          if (res.data.success) {
            wx.showModal({
              title: 'Success',
              content: 'Welcome!',
              showCancel: false,

              confirmText: "确定",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm");
                  wx.switchTab({
                    url: '../forum/forum'
                  })


                } else if (res.cancel) {
                  console.log("cancle")
                }
              }
            })
            
          } else {
            wx.showModal({
              title: 'Caution',
              content: 'Invalid code. Try again.',
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


  resend: function(){
    var that = this;
    console.log(that.data.email)
    wx.request({
      method: 'POST',
      url: baseUrl + 'generateNewValidationCode',
      data: {
        'email': that.data.userData.email,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);


        if (res) {
          wx.showModal({
            title: 'Success',
            content: 'Email successfully sent!',
            showCancel: false,

            confirmText: "确定",
            confirmColor: "#0f0",
            success: function (res) {
              if (res.confirm) {
                console.log("confirm");
               
              } else if (res.cancel) {
                console.log("cancel")
              }
            }
          })

        } else {
          wx.showModal({
            title: 'Email not sent',
            content: 'Email could not send.',
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

    if(options.email){
      that.setData({
        email: options.email
      })
    } else {
      wx.getStorage({
        key: 'userData',
        success: function (res) {
          that.setData({
            email: res.data.email,
            userData: res.data
          })
        },
      })
    }

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