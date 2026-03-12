-- 美容院数据库初始化脚本
-- 创建日期：2026-03-12

-- 创建数据库
CREATE DATABASE IF NOT EXISTS beauty_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beauty_shop;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户 ID',
  openid VARCHAR(100) UNIQUE NOT NULL COMMENT '微信 OpenID',
  unionid VARCHAR(100) COMMENT '微信 UnionID',
  phone VARCHAR(20) COMMENT '手机号',
  nickname VARCHAR(50) COMMENT '昵称',
  avatar TEXT COMMENT '头像 URL',
  gender TINYINT DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女',
  birthday DATE COMMENT '生日',
  status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-正常',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_openid (openid),
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 会员表
CREATE TABLE IF NOT EXISTS members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '会员 ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户 ID',
  level VARCHAR(20) DEFAULT 'silver' COMMENT '会员等级 silver/gold/diamond',
  points INT DEFAULT 0 COMMENT '积分',
  balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '余额',
  total_consumption DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计消费',
  order_count INT DEFAULT 0 COMMENT '订单数',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员表';

-- 项目表
CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '项目 ID',
  name VARCHAR(100) NOT NULL COMMENT '项目名称',
  description TEXT COMMENT '项目描述',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  original_price DECIMAL(10,2) COMMENT '原价',
  duration INT DEFAULT 60 COMMENT '时长（分钟）',
  image TEXT COMMENT '主图 URL',
  images TEXT COMMENT '图片列表 JSON',
  category VARCHAR(50) COMMENT '分类',
  is_hot TINYINT DEFAULT 0 COMMENT '是否热门',
  is_recommend TINYINT DEFAULT 0 COMMENT '是否推荐',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 0-下架 1-上架',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_category (category),
  INDEX idx_hot (is_hot)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务项目表';

-- 预约表
CREATE TABLE IF NOT EXISTS bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '预约 ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户 ID',
  project_id INT UNSIGNED NOT NULL COMMENT '项目 ID',
  staff_id INT UNSIGNED COMMENT '美容师 ID',
  appointment_time DATETIME NOT NULL COMMENT '预约时间',
  duration INT DEFAULT 60 COMMENT '预约时长（分钟）',
  status VARCHAR(20) DEFAULT 'pending' COMMENT '状态 pending/confirmed/completed/cancelled/no_show',
  remark TEXT COMMENT '备注',
  actual_start_time DATETIME COMMENT '实际开始时间',
  actual_end_time DATETIME COMMENT '实际结束时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_user_time (user_id, appointment_time),
  INDEX idx_staff_time (staff_id, appointment_time),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约记录表';

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '订单 ID',
  order_no VARCHAR(50) UNIQUE NOT NULL COMMENT '订单号',
  user_id INT UNSIGNED NOT NULL COMMENT '用户 ID',
  type VARCHAR(20) DEFAULT 'service' COMMENT '类型 service 服务 product 商品',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '订单金额',
  discount_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
  final_amount DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  payment_method VARCHAR(20) COMMENT '支付方式 wechat/alipay/cash',
  payment_time DATETIME COMMENT '支付时间',
  status VARCHAR(20) DEFAULT 'unpaid' COMMENT '状态 unpaid/paid/refunded/closed',
  items JSON COMMENT '订单商品列表',
  remark TEXT COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status),
  INDEX idx_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 优惠券表
CREATE TABLE IF NOT EXISTS coupons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '优惠券 ID',
  name VARCHAR(100) NOT NULL COMMENT '优惠券名称',
  type VARCHAR(20) DEFAULT 'discount' COMMENT '类型 discount 折扣 amount 满减',
  value DECIMAL(10,2) NOT NULL COMMENT '优惠值',
  min_amount DECIMAL(10,2) COMMENT '最低消费金额',
  valid_days INT NOT NULL COMMENT '有效期（天）',
  start_time DATETIME COMMENT '开始时间',
  end_time DATETIME COMMENT '结束时间',
  total_count INT DEFAULT 0 COMMENT '总数量',
  issued_count INT DEFAULT 0 COMMENT '已发放数量',
  limit_per_user INT DEFAULT 1 COMMENT '每人限领数量',
  is_active TINYINT DEFAULT 1 COMMENT '是否启用',
  description TEXT COMMENT '使用说明',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券模板表';

-- 用户优惠券表
CREATE TABLE IF NOT EXISTS user_coupons (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户 ID',
  coupon_id INT UNSIGNED NOT NULL COMMENT '优惠券 ID',
  coupon_code VARCHAR(50) UNIQUE NOT NULL COMMENT '券码',
  status VARCHAR(20) DEFAULT 'unused' COMMENT '状态 unused/used/expired',
  used_order_id INT UNSIGNED COMMENT '使用订单 ID',
  used_at DATETIME COMMENT '使用时间',
  expire_time DATETIME NOT NULL COMMENT '过期时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';

-- 员工表
CREATE TABLE IF NOT EXISTS staffs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '员工 ID',
  name VARCHAR(50) NOT NULL COMMENT '姓名',
  phone VARCHAR(20) COMMENT '手机号',
  position VARCHAR(50) COMMENT '职位',
  avatar TEXT COMMENT '头像',
  description TEXT COMMENT '简介',
  is_active TINYINT DEFAULT 1 COMMENT '是否在职',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_position (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工表';

-- 客户标签表
CREATE TABLE IF NOT EXISTS customer_tags (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '标签 ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户 ID',
  tag VARCHAR(50) NOT NULL COMMENT '标签名',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_tag (user_id, tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户标签表';

-- 评价表
CREATE TABLE IF NOT EXISTS reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '评价 ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户 ID',
  booking_id INT UNSIGNED NOT NULL COMMENT '预约 ID',
  rating TINYINT NOT NULL COMMENT '评分 1-5',
  content TEXT COMMENT '评价内容',
  images TEXT COMMENT '评价图片 JSON',
  is_anonymous TINYINT DEFAULT 0 COMMENT '是否匿名',
  status VARCHAR(20) DEFAULT 'pending' COMMENT '状态 pending/approved/rejected',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';