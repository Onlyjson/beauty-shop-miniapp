const sequelize = require('../config/database');
const DataTypes = sequelize.DataTypes;
const { v4: uuidv4 } = require('uuid');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  orderNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '订单号'
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '用户 ID'
  },
  type: {
    type: DataTypes.STRING(20),
    defaultValue: 'service',
    comment: '类型 service 服务 product 商品'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '订单金额'
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: '优惠金额'
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '实付金额'
  },
  paymentMethod: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '支付方式 wechat/alipay/cash'
  },
  paymentTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '支付时间'
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'unpaid',
    comment: '状态 unpaid/paid/refunded/closed'
  },
  items: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '订单商品列表'
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id', 'status'] },
    { fields: ['order_no'] }
  ]
});

// 生成订单号
Order.generateOrderNo = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD${timestamp}${random}`;
};

// 创建订单
Order.createOrder = async (data) => {
  const orderNo = Order.generateOrderNo();
  return await Order.create({
    ...data,
    orderNo
  });
};

// 支付订单
Order.prototype.pay = async function(paymentMethod) {
  return await this.update({
    status: 'paid',
    paymentMethod,
    paymentTime: new Date()
  });
};

// 取消订单
Order.prototype.cancel = async function() {
  return await this.update({ status: 'closed' });
};

module.exports = Order;