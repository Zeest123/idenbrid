const DataTypes = require("sequelize").DataTypes;
sequelize = require("../config/database");
const LogException = sequelize.define(
  "log_exception",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      required: false,
    },
    level: {
      type: DataTypes.STRING(20),
      allowNull: false,
      required: true,
    },
    meta: {
      type: DataTypes.TEXT,
      allowNull: false,
      required: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      required: true,
    },
  },
  {
    sequelize,
    tableName: "log_exception",
    timestamps: false,
    // paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
    ],
  }
);
exports.LogException = LogException;
