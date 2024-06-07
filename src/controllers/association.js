const { Products } = require("../models/products");
const { Color } = require("../models/color");
const { Tones } = require("../models/tones");
const { Pictures } = require("../models/pictures");

module.exports = function () {
  /*----------------------------------------------*/
  //User to User
  Products.hasMany(Color, {
    as: "product_has_color",
    foreignKey: "product_id",
  });
  Color.belongsTo(Products, {
    as: "color_belong_to-product",
    foreignKey: "product_id",
  });
  Color.hasMany(Tones, {
    as: "color_has_tones",
    foreignKey: "color_id",
  });
  Tones.belongsTo(Color, {
    as: "tones_belong_to_color",
    foreignKey: "color_id",
  });

  Tones.hasOne(Pictures, {
    as: "tone_has_pic",
    foreignKey: "tone_id",
  });
  Pictures.belongsTo(Tones, {
    as: "pic_tone",
    foreignKey: "tone_id",
  });
};
