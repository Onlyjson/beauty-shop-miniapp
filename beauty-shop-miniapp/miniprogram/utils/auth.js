// utils/auth.js - 认证工具

const app = getApp();

// 获取用户信息
async function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        resolve(res.userInfo);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 获取手机号
async function getPhoneNumber() {
  return new Promise((resolve, reject) => {
    wx.getPhoneNumber({
      success: (res) => {
        resolve(res.code);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 登录
async function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 检查是否登录
function checkLogin() {
  return !!app.globalData.token;
}

// 设置登录状态
function setLoginStatus(token, userInfo, memberInfo) {
  app.setToken(token);
  app.setUserInfo(userInfo);
  app.globalData.memberInfo = memberInfo;
  wx.setStorageSync('memberInfo', memberInfo);
}

module.exports = {
  getUserInfo,
  getPhoneNumber,
  login,
  checkLogin,
  setLoginStatus
};