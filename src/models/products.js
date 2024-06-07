const Joi = require("joi");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

//product model
const Products = sequelize.define(
  "products",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      required: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      required: true,
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true,
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

//joi validation
function validateProduct(product) {
  const schema = Joi.object({
    title: Joi.string().max(50).required(),
    description: Joi.string().required(),
  });
  return schema.validate(product);
}

//id generation
Products.beforeCreate((product) => (product.id = Sequelize.UUIDV4));

exports.Products = Products;
exports.validateProduct = validateProduct;
