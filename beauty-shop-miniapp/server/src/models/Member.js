const sequelize = require('../config/database');
const DataTypes = sequelize.DataTypes;

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: true,
    comment: '用户 ID'
  },
  level: {
    type: DataTypes.STRING(20),
    defaultValue: 'silver',
    comment: '会员等级 silver/gold/diamond'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '积分'
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: '余额'
  },
  total_consumption: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    comment: '累计消费'
  },
  order_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '订单数'
  }
}, {
  tableName: 'members',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 获取会员等级折扣
Member.prototype.getDiscount = function() {
  const discounts = {
    silver: 0.95,
    gold: 0.90,
    diamond: 0.85
  };
  return discounts[this.level] || 0.95;
};

// 增加积分
Member.prototype.addPoints = async function(points) {
  return await this.increment('points', { by: points });
};

// 增加消费金额
Member.prototype.addConsumption = async function(amount) {
  return await this.increment(
    { total_consumption: amount, order_count: 1 },
    { by: amount }
  );
};

// 升级会员等级
Member.prototype.upgradeLevel = async function() {
  const newLevel = await this.determineLevel();
  if (newLevel !== this.level) {
    await this.update({ level: newLevel });
    return newLevel;
  }
  return null;
};

// 确定会员等级
Member.determineLevel = async (totalConsumption) => {
  if (totalConsumption >= 10000) return 'diamond';
  if (totalConsumption >= 3000) return 'gold';
  return 'silver';
};

module.exports = Member;