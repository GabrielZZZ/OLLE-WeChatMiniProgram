const app = getApp();
var baseUrl = app.globalData.host;

Page({

  
  data: {
    changeVariable: '',
    kind: '',
    user_id: ''
  },

  
  onLoad: function (options) {
    var that = this;
    that.setData({
      kind: options.kind,
      user_id: options.user_id
    })

    console.log("kind is " + that.data.kind);
  },


  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);

    var that = this;

    that.setData({
      changeVariable: e.detail.value.name
    })

    //console.log('console: ' + that.data.changeVariable);
    if(that.data.kind == 0)
    {
      //change is the name
      wx.request({
        method: 'POST',
        url: baseUrl + 'updateName',
        data: {
          'data': e.detail.value.name,
          'user_id': that.data.user_id
        },
        header: {
          'content-type': 'json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          
          
          //store the data in local
          wx.setStorage({
            key: 'userData',
            data: res.data.userData,
          })


          
          if (res.data.userData) {
            wx.showModal({
              title: 'SUCCESS',
              content: 'Data modified successfully',
              showCancel: false,

              confirmText: "Confirm",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm");

                  wx.reLaunch({
                    url: '../myOlle/myOlle',
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
          wx.showModal({
            title: 'Caution',
            content: 'Fatal Error! Contact system administrators!',
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
      })
    } else if(that.data.kind == 1) {
      //change is the surname
      wx.request({
        method: 'POST',
        url: baseUrl + 'updateSurname',//change here
        data: {
          'data': e.detail.value.name,
          'user_id': that.data.user_id
        },
        header: {
          'content-type': 'json' // 默认值
        },
        success: function (res) {
          console.log(res.data);


          //store the data in local
          //change here
          wx.setStorage({
            key: 'userData',
            data: res.data.userData,
          })



          if (res.data.userData) {
            wx.showModal({
              title: 'SUCCESS',
              content: 'Data modified successfully',
              showCancel: false,

              confirmText: "Confirm",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm");

                  wx.reLaunch({
                    url: '../myOlle/myOlle',
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
          wx.showModal({
            title: 'Caution',
            content: 'Fatal Error! Contact system administrators!',
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
      })
    } else if (that.data.kind == 2) {
      //change is the surname
      wx.request({
        method: 'POST',
        url: baseUrl + 'updateUsername',//change here
        data: {
          'data': e.detail.value.name,
          'user_id': that.data.user_id
        },
        header: {
          'content-type': 'json' // 默认值
        },
        success: function (res) {
          console.log(res.data);


          //store the data in local
          //change here
          wx.setStorage({
            key: 'userData',
            data: res.data.userData,
          })



          if (res.data.userData) {
            wx.showModal({
              title: 'SUCCESS',
              content: 'Data modified successfully',
              showCancel: false,

              confirmText: "Confirm",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm");

                  wx.reLaunch({
                    url: '../myOlle/myOlle',
                  })


                } else if (res.cancel) {
                  console.log("cancle")
                }
              }
            })
          } else {

            
            wx.showModal({
              title: 'Caution',
              content: 'Username already exits. Try another one.',
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
          wx.showModal({
            title: 'Caution',
            content: 'Fatal Error! Contact system administrators!',
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
      })
    }


    



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