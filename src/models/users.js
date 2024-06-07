const Joi = require("joi");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

//user model
const Users = sequelize.define(
  "users",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      required: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      required: true,
      unique: "users_email_unique",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "users_email_unique",
        unique: true,
        using: "BTREE",
        fields: [{ name: "email" }],
      },
    ],
  }
);

//joi validation
function validateUser(user) {
  const schema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

//id generation
Users.beforeCreate((user) => (user.id = Sequelize.UUIDV4));

exports.Users = Users;
exports.validateUser = validateUser;
