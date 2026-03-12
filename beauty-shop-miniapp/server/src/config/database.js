const { Sequelize } = require('sequelize');
const logger = require('./logger');

// 数据库配置
const sequelize = new Sequelize(
  process.env.DB_NAME || 'beauty_shop',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// 测试连接
sequelize.authenticate()
  .then(() => logger.info('✅ MySQL 连接成功'))
  .catch(err => logger.error('❌ MySQL 连接失败:', err));

module.exports = sequelize;