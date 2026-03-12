const sequelize = require('../config/database');
const DataTypes = sequelize.DataTypes;

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '用户 ID'
  },
  project_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '项目 ID'
  },
  staff_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    comment: '美容师 ID'
  },
  appointmentTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '预约时间'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    comment: '预约时长（分钟）'
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    comment: '状态 pending/confirmed/completed/cancelled/no_show'
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注'
  },
  actualStartTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '实际开始时间'
  },
  actualEndTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '实际结束时间'
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id', 'appointment_time'] },
    { fields: ['staff_id', 'appointment_time'] },
    { fields: ['status'] }
  ]
});

// 检查时间冲突
Booking.checkConflict = async (staffId, startTime, duration) => {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration);

  const conflict = await Booking.findOne({
    where: {
      staff_id: staffId,
      status: {
        [sequelize.Op.ne]: 'cancelled'
      },
      appointment_time: {
        [sequelize.Op.lt]: endTime
      },
      '$actualStartTime$': {
        [sequelize.Op.ne]: null
      }
    }
  });

  return !!conflict;
};

// 确认预约
Booking.prototype.confirm = async function() {
  return await this.update({ status: 'confirmed' });
};

// 完成预约
Booking.prototype.complete = async function() {
  return await this.update({
    status: 'completed',
    actualEndTime: new Date()
  });
};

// 取消预约
Booking.prototype.cancel = async function() {
  return await this.update({ status: 'cancelled' });
};

module.exports = Booking;