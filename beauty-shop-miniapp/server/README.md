# 美容院微信小程序 - 后端服务

## 项目介绍

美容院小程序后端服务，基于 Node.js + Express + MySQL，提供用户管理、预约系统、订单支付等核心功能。

## 技术栈

- **框架**: Node.js + Express
- **数据库**: MySQL + Sequelize ORM
- **认证**: JWT (JSON Web Token)
- **日志**: Winston

## 环境要求

- Node.js >= 16.0.0
- MySQL >= 5.7

## 安装步骤

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=beauty_shop
DB_USER=root
DB_PASSWORD=your-password

JWT_SECRET=your-secret-key
```

### 3. 初始化数据库

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE beauty_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 执行迁移脚本
mysql -u root -p beauty_shop < database/migrations/001_init.sql

# 插入种子数据
mysql -u root -p beauty_shop < database/seeds/initial_data.sql
```

### 4. 启动服务

```bash
# 开发环境
npm run dev

# 生产环境
npm start
```

服务将运行在 `http://localhost:3000`

## API 接口

### 认证接口

#### 微信登录
```http
POST /api/auth/wechat
Content-Type: application/json

{
  "code": "微信小程序登录凭证",
  "nickname": "用户昵称",
  "avatar": "头像 URL",
  "phone": "手机号"
}

响应:
{
  "success": true,
  "token": "JWT token",
  "user": { ... },
  "member": { ... }
}
```

### 项目接口

#### 获取项目列表
```http
GET /api/projects?category=面部护理&isHot=1&page=1&limit=10
```

#### 获取项目详情
```http
GET /api/projects/:id
```

### 预约接口

#### 创建预约
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": 1,
  "staffId": 1,
  "appointmentTime": "2026-03-15 14:00:00",
  "duration": 60,
  "remark": "备注信息"
}
```

#### 获取我的预约
```http
GET /api/bookings/my?status=pending&page=1&limit=10
```

#### 取消预约
```http
PUT /api/bookings/:id/cancel
Authorization: Bearer <token>
```

### 订单接口

#### 创建订单
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    { "projectId": 1, "quantity": 1, "price": 299 }
  ]
}
```

#### 获取我的订单
```http
GET /api/orders/my?status=paid&page=1&limit=10
```

#### 支付订单
```http
PUT /api/orders/:id/pay
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "wechat"
}
```

### 会员接口

#### 获取会员信息
```http
GET /api/members/info
Authorization: Bearer <token>
```

## 数据库表结构

详见 `database/migrations/001_init.sql`

## 项目结构

```
server/
├── src/
│   ├── config/          # 配置文件
│   ├── models/          # 数据模型
│   ├── controllers/     # 控制器
│   ├── routes/          # 路由
│   ├── middleware/      # 中间件
│   ├── utils/           # 工具函数
│   └── server.js        # 入口文件
├── database/            # 数据库脚本
├── logs/                # 日志目录
├── .env.example         # 环境变量示例
├── package.json
└── README.md
```

## 开发计划

### 第一阶段（已完成）
- ✅ 数据库设计
- ✅ 用户认证
- ✅ 项目展示
- ✅ 预约系统
- ✅ 订单支付

### 第二阶段（待开发）
- 优惠券系统
- 营销活动（拼团、秒杀）
- 积分系统
- 评价系统

### 第三阶段（待开发）
- 数据统计报表
- 智能推荐
- 员工管理

## 注意事项

1. 生产环境请修改 JWT_SECRET
2. 请配置正确的数据库连接信息
3. 微信登录需要配置 AppID 和 AppSecret
4. 建议配置 Nginx 反向代理
5. 建议配置 HTTPS

## 联系方式

如有问题，请联系开发团队。