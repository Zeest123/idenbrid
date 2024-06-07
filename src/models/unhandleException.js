const DataTypes = require("sequelize").DataTypes;
sequelize = require("../config/database");
const UnhandleException = sequelize.define(
  "unhandle_exception",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // id: {
    //   allowNull: false,
    //   type: Sequelize.UUID,
    //   defaultValue: Sequelize.UUIDV4,
    //   primaryKey: true,
    // },
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
    tableName: "unhandle_exception",
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

exports.UnhandleException = UnhandleException;
