/**
 * 首页 - 小程序核心获客入口
 */

Page({
  data: {
    // 新人礼包
    newUserCoupon: {
      discount: 0.033, // 3.3 折
      originalPrice: 299,
      price: 9.9,
      show: false
    },
    // 热门项目
    hotProjects: [],
    // 拼团活动
    groupActivities: [],
    // 客户评价
    reviews: [],
    // 距离
    distance: '1.2km'
  },

  onLoad() {
    this.getNewUserCoupon()
    this.getHotProjects()
    this.getGroupActivities()
    this.getReviews()
  },

  // 获取新人礼包
  async getNewUserCoupon() {
    const { data } = await wx.request({
      url: '/api/member/is-new-user',
      success: (res) => {
        if (res.data.is_new_user) {
          this.setData({ 'newUserCoupon.show': true })
        }
      }
    })
  },

  // 获取热门项目
  async getHotProjects() {
    const { data } = await wx.request({
      url: '/api/project/hot',
      success: (res) => {
        this.setData({ hotProjects: res.data })
      }
    })
  },

  // 获取拼团活动
  async getGroupActivities() {
    const { data } = await wx.request({
      url: '/api/activity/group',
      success: (res) => {
        this.setData({ groupActivities: res.data })
      }
    })
  },

  // 获取客户评价
  async getReviews() {
    const { data } = await wx.request({
      url: '/api/review/list',
      success: (res) => {
        this.setData({ reviews: res.data })
      }
    })
  },

  // 领取新人礼包
 领取新人礼包 () {
    wx.showModal({
      title: '新人专享',
      content: `原价¥${this.data.newUserCoupon.originalPrice}，新人仅需¥${this.data.newUserCoupon.price}`,
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/booking/booking?project_id=1'
          })
        }
      }
    })
  },

  // 查看项目详情
  查看项目详情 (e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/project/detail?id=${id}`
    })
  },

  // 参与拼团
  参与拼团 (e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/activity/group?id=${id}`
    })
  },

  // 评价详情
  查看评价 (e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/review/detail?id=${id}`
    })
  }
})