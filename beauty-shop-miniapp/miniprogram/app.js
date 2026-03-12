// app.js
App({
  onLaunch: function () {
    // 初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      this.cloud = wx.cloud;
    }

    // 检查登录状态
    this.checkLogin();

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.systemInfo = systemInfo;
  },

  globalData: {
    baseUrl: 'http://localhost:3000', // 后端 API 地址
    userInfo: null,
    token: null,
    memberInfo: null
  },

  // 检查登录状态
  checkLogin: function () {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      // 验证 token 是否有效
      this.getUserInfo();
    }
  },

  // 获取用户信息
  getUserInfo: function () {
    const token = this.globalData.token;
    if (!token) return;

    wx.request({
      url: this.globalData.baseUrl + '/api/users/profile',
      method: 'GET',
      header: {
        'authorization': 'Bearer ' + token
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.globalData.userInfo = res.data.data;
        }
      },
      fail: () => {
        // token 失效，清除
        wx.removeStorageSync('token');
        this.globalData.token = null;
      }
    });
  },

  // 设置用户信息
  setUserInfo: function (userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  },

  // 设置 token
  setToken: function (token) {
    this.globalData.token = token;
    wx.setStorageSync('token', token);
  },

  // 清除登录信息
  clearLoginInfo: function () {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    this.globalData.token = null;
    this.globalData.userInfo = null;
  }
});