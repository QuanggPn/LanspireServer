module.exports = (sequelize, Sequelize) => {
  const TimeFrame = sequelize.define(
    'TimeFrame',
    {
      idTimeFrame: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        field: 'idtimeframe',
      },
      startingTime: {
        type: Sequelize.TIME,
        field: 'startingtime',
      },
      endingTime: {
        type: Sequelize.TIME,
        field: 'endingtime',
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        field: 'isdeleted',
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,

      timestamps: false,

      createdAt: false,

      updatedAt: false,
    }
  );
  TimeFrame.associate = function (models) {
    TimeFrame.belongsToMany(models.Class, {
      through: models.ClassTime,
      as: 'class',
      foreignKey: 'idTimeFrame',
    });
  };
  return TimeFrame;
};
