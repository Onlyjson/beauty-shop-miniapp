const sequelize = require('../config/database');
const DataTypes = sequelize.DataTypes;

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '项目名称'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '项目描述'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '价格'
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '原价'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: '时长（分钟）'
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '主图 URL'
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '图片列表 JSON'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '分类'
  },
  isHot: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '是否热门'
  },
  isRecommend: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '是否推荐'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '状态 0-下架 1-上架'
  }
}, {
  tableName: 'projects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['category'] },
    { fields: ['is_hot'] }
  ]
});

// 应用会员折扣
Project.prototype.applyMemberDiscount = function(memberLevel) {
  const discounts = {
    silver: 0.95,
    gold: 0.90,
    diamond: 0.85
  };
  const discount = discounts[memberLevel] || 0.95;
  return parseFloat((this.price * discount).toFixed(2));
};

module.exports = Project;