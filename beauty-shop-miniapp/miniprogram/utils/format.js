// utils/format.js - 格式化工具

// 格式化日期
function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// 格式化时间
function formatTime(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  
  return `${hour}:${minute}`;
}

// 格式化日期时间
function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`;
}

// 格式化价格
function formatPrice(price) {
  if (!price && price !== 0) return '¥0';
  return `¥${parseFloat(price).toFixed(2)}`;
}

// 格式化时长
function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}小时`;
  }
  return `${hours}小时${mins}分钟`;
}

// 格式化距离
function formatDistance(meters) {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// 格式化会员等级
function formatMemberLevel(level) {
  const levels = {
    silver: '银卡会员',
    gold: '金卡会员',
    diamond: '钻石会员'
  };
  return levels[level] || '普通会员';
}

// 格式化预约状态
function formatBookingStatus(status) {
  const statuses = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消',
    no_show: '未到店'
  };
  return statuses[status] || status;
}

// 格式化订单状态
function formatOrderStatus(status) {
  const statuses = {
    unpaid: '待支付',
    paid: '已支付',
    refunded: '已退款',
    closed: '已关闭'
  };
  return statuses[status] || status;
}

// 格式化会员折扣
function formatMemberDiscount(level) {
  const discounts = {
    silver: '95 折',
    gold: '9 折',
    diamond: '85 折'
  };
  return discounts[level] || '95 折';
}

// 获取星期
function getWeekday(date) {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[new Date(date).getDay()];
}

// 计算年龄
function getAge(birthday) {
  if (!birthday) return null;
  const birth = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const month = now.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  formatPrice,
  formatDuration,
  formatDistance,
  formatMemberLevel,
  formatBookingStatus,
  formatOrderStatus,
  formatMemberDiscount,
  getWeekday,
  getAge
};