const app = getApp();
var baseUrl = app.globalData.host;
var topic_id_new = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind: '',
    index: '',
    postData: [],
    user_id: '',
    post_username: '',
    token: '',
    parent_id: '',
    username: '',
    language: '',
    topic_id: '',
    post_post_id: '',
    index1: '',
    topic_tag: '',
    profile_photo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      kind: options.id,
      index: options.index,//reply's index
      index1: options.index1,//comment's index
      topic_tag: options.topic_tag
    })

    if(options.topic_tag == 0){
      wx.getStorage({
        key: 'topicsData',
        success: function (res) {
          console.log(res);


          that.setData({
            postData: res.data[that.data.index],
            topic_id: res.data[that.data.index].topic_id
          })
        }
      })
    } else if (options.topic_tag == 1){
      wx.getStorage({
        key: 'naaTopicsData',
        success: function (res) {
          console.log(res);


          that.setData({
            postData: res.data[that.data.index],
            topic_id: res.data[that.data.index].topic_id
          })
        }
      })
    }
    

    wx.getStorage({
      key: 'postedReply',
      success: function (res) {
        console.log(res);


        that.setData({
          // parent_id: res.data[0].post_id
          post_post_id: res.data[options.index1].post_id
          //used as children post's parent id
        })

        console.log("post_post_id: " + res.data.post_post_id)
      }
    })

    wx.getStorage({
      key: 'userData',
      success: function (res) {
        console.log(res);


        that.setData({
          user_id: res.data.user_id,
          post_username: res.data.username,
          token: res.data.token,
          username: res.data.username,
          language: res.data.language,
          profile_photo: res.data.photo
        })

        console.log(that.data.username)
      },
    })
  },

//reply to subject
  sendNotification: function () {
    var that = this;

    console.log("sendNotification-accesstoken:" + app.globalData.access_token)

    wx.request({
      url: baseUrl + 'sendTemplateMessage',
      method: 'POST',
      data: {
        'access_token': app.globalData.access_token,
        'type': 100
        //100: post to subject
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },






  //logic in parent post and children post:
  // Parent.topic_id = topic.topic_id(parent => parent_id = 0)
  // Children.topic_id = topic.topic_id 
  // Children.parent_id = parent.post_id


  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value.user_post);

    var that = this;


    console.log('console: ' + that.data.kind);
    if (that.data.kind == 0) {
      //parent post

      topic_id_new = that.data.topic_id;
      console.log("topic_id_new: " + topic_id_new)
      
      wx.request({
        method: 'post',
        url: baseUrl + 'postNewTopicReply',
        data: {
          
          'topic_id': topic_id_new,//
          
          'user_id': that.data.user_id,
          'username': that.data.username,
          'token': that.data.token,
          'parent_id': '0',
          'user_post': e.detail.value.user_post,
          'language': that.data.language,
          'post_id': '',
          'photo':that.data.profile_photo

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res);


          //store the data in local
          // wx.setStorage({
          //   key: 'userData',
          //   data: res.data.userData,
          // })



          if (res.data.success) {
            wx.showModal({
              title: 'SUCCESS',
              content: 'Post successfully',
              showCancel: false,

              confirmText: "确定",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm");

                  that.sendNotification();


                  wx.reLaunch({
                    url: '../forum/forum',
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
      })
    } else if (that.data.kind == 1) {
      //children post
      //logic in parent post and children post:
      // Parent.topic_id = topic.topic_id(parent => parent_id = 0)
      // Children.topic_id = topic.topic_id 
      // Children.parent_id = parent.post_id
      console.log("parent_id: " + that.data.post_post_id)
        wx.request({
        method: 'POST',
        url: baseUrl + 'postNewTopicReply',//change here
        data: {
          'topic_id': that.data.topic_id,//

          'user_id': that.data.user_id,
          'username': that.data.username,
          'token': that.data.token,
          'parent_id': that.data.post_post_id,
          'user_post': e.detail.value.user_post,
          'language': that.data.language,
          'post_id': '',
          'photo': that.data.profile_photo
        },
        header: {
          'content-type': 'json' // 默认值
        },
        success: function (res) {
          console.log(res.data);

          if (res.data.success) {
            wx.showModal({
              title: 'SUCCESS',
              content: 'Post successfully',
              showCancel: false,

              confirmText: "确定",
              confirmColor: "#0f0",
              success: function (res) {
                if (res.confirm) {
                  console.log("confirm");

                  wx.reLaunch({
                    url: '../forum/forum',
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