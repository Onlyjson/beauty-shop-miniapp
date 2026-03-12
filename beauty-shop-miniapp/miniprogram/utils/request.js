// utils/request.js - 网络请求封装

const app = getApp();

// 封装请求
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token;

    wx.request({
      url: app.globalData.baseUrl + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        ...(token ? { 'authorization': 'Bearer ' + token } : {})
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // 未授权，清除 token 并跳转登录
          app.clearLoginInfo();
          wx.redirectTo({ url: '/pages/user/user' });
          reject({ error: '未授权' });
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        reject(err);
      }
    });
  });
}

// API 接口封装
const api = {
  // 认证
  auth: {
    wechatLogin: (data) => request('/api/auth/wechat', 'POST', data)
  },

  // 用户
  user: {
    getProfile: () => request('/api/users/profile'),
    updateProfile: (data) => request('/api/users/profile', 'PUT', data)
  },

  // 项目
  project: {
    getList: (params) => request('/api/projects', 'GET', params),
    getDetail: (id) => request(`/api/projects/${id}`)
  },

  // 预约
  booking: {
    create: (data) => request('/api/bookings', 'POST', data),
    getList: (params) => request('/api/bookings/my', 'GET', params),
    cancel: (id) => request(`/api/bookings/${id}/cancel`, 'PUT')
  },

  // 订单
  order: {
    create: (data) => request('/api/orders', 'POST', data),
    getList: (params) => request('/api/orders/my', 'GET', params),
    pay: (id, data) => request(`/api/orders/${id}/pay`, 'PUT', data)
  },

  // 会员
  member: {
    getInfo: () => request('/api/members/info'),
    getPointsLog: () => request('/api/members/points-log')
  }
};

// 导出
module.exports = {
  request,
  api
};