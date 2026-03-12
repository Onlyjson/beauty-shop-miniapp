const sequelize = require('../config/database');
const User = require('./User');
const Member = require('./Member');
const Project = require('./Project');
const Booking = require('./Booking');
const Order = require('./Order');

// 关联关系
User.hasOne(Member, { foreignKey: 'user_id', as: 'member' });
Member.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Project.hasMany(Booking, { foreignKey: 'project_id', as: 'bookings' });
Booking.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// 同步数据库（开发环境）
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true })
    .then(() => console.log('✅ 数据库同步完成'))
    .catch(err => console.error('❌ 数据库同步失败:', err));
}

module.exports = {
  sequelize,
  User,
  Member,
  Project,
  Booking,
  Order
};