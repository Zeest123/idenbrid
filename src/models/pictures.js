const DataTypes = require("sequelize").DataTypes;
const sequelize = require("../config/database");
const Joi = require("joi");

const Pictures = sequelize.define(
  "pictures",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_data: {
      type: DataTypes.BLOB("medium"), // 16mb max
      allowNull: false,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tone_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "tones",
        key: "id",
      },
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "pictures",
    timestamps: true,
    //paranoid: true, //don't set paranoid true when you have to delete anything or there is no active key
  }
);

function validatePicture(picture) {
  const schema = Joi.object({
    id: Joi.string().guid(),
    file_name: Joi.string().required(),
    file_data: Joi.any().required(),
    file_size: Joi.number().integer().max(4194304).required(), // 4 mb
    file_mimetype: Joi.string().valid("image/png", "image/jpeg").required(),
    tone_id: Joi.string().guid().required(),
  });
  return schema.validate(picture);
}

Pictures.beforeCreate((picture) => (picture.id = DataTypes.UUIDV4));

exports.Pictures = Pictures;
exports.validatePicture = validatePicture;
