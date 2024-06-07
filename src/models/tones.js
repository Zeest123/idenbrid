const Joi = require("joi");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

//tone model
const Tones = sequelize.define(
  "tones",
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
    color_id: {
      // Color ID
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "colors",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "tones",
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "belong_to_color",
        using: "BTREE",
        fields: [{ name: "color_id" }],
      },
    ],
  }
);

//joi validation
function validateTones(tone) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    color_id: Joi.string().guid(),
  });
  return schema.validate(tone);
}

//id generation
Tones.beforeCreate((tone) => (tone.id = Sequelize.UUIDV4));

exports.Tones = Tones;
exports.validateTones = validateTones;
