const Joi = require("joi");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

//color model
const Color = sequelize.define(
  "colors",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      required: true,
    },
    product_id: {
      // Products ID
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "products",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "colors",
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "belong_to_product",
        using: "BTREE",
        fields: [{ name: "product_id" }],
      },
    ],
  }
);

//joi validation
function validateColor(color) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    product_id: Joi.string().guid(),
  });
  return schema.validate(color);
}

//id generation
Color.beforeCreate((color) => (color.id = Sequelize.UUIDV4));

exports.Color = Color;
exports.validateColor = validateColor;
