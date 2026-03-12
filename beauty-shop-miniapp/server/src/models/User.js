const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const DataTypes = sequelize.DataTypes;

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: sequelize DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '微信 OpenID'
  },
  unionid: {
    type: sequelize DataTypes.STRING(100),
    allowNull: true,
    comment: '微信 UnionID'
  },
  phone: {
    type: sequelize DataTypes.STRING(20),
    allowNull: true,
    comment: '手机号'
  },
  nickname: {
    type: sequelize DataTypes.STRING(50),
    allowNull: true,
    comment: '昵称'
  },
  avatar: {
    type: sequelize DataTypes.TEXT,
    allowNull: true,
    comment: '头像 URL'
  },
  gender: {
    type: sequelize DataTypes.TINYINT,
    defaultValue: 0,
    comment: '性别 0-未知 1-男 2-女'
  },
  birthday: {
    type: sequelize DataTypes.DATEONLY,
    allowNull: true,
    comment: '生日'
  },
  status: {
    type: sequelize DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态 0-禁用 1-正常'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['openid'] },
    { fields: ['phone'] }
  ]
});

// 关联会员表
User.hasOne(require('./Member'), { foreignKey: 'user_id', as: 'member' });
require('./Member').belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 静态方法：创建用户
User.createWithMember = async (data) => {
  const t = await sequelize.transaction();
  try {
    const user = await User.create(data, { transaction: t });
    const member = await require('./Member').create({
      user_id: user.id,
      points: 0,
      balance: 0,
      total_consumption: 0,
      order_count: 0
    }, { transaction: t });
    await t.commit();
    return { ...user.toJSON(), member: member.toJSON() };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// 实例方法：获取会员信息
User.prototype.getMember = async function() {
  return await require('./Member').findOne({
    where: { user_id: this.id },
    include: []
  });
};

module.exports = User;