const { Color } = require("../../models/color");
const { validatePicture, Pictures } = require("../../models/pictures");
const { Products } = require("../../models/products");
const { Tones } = require("../../models/tones");
const sharp = require("sharp");

const productCreation = (productDetail, t) => {
  return Products.create(productDetail, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const colorCreation = (colorDetail, t) => {
  return Color.create(colorDetail, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
const toneCreation = (toneDetail, t) => {
  return Tones.create(toneDetail, {
    transaction: t,
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const addPicByToneId = async (id, profile_pic, t) => {
  // profile_pic = req.files.profile_pic;
  if (Array.isArray(profile_pic)) {
    profile_pic = profile_pic[0]; // if more than one pics were sent by user
  }
  //
  profile_pic = {
    file_name: profile_pic.name,
    file_data: profile_pic.data,
    file_size: profile_pic.size,
    file_mimetype: profile_pic.mimetype,
    tone_id: id,
  };
  //
  const { error } = validatePicture(profile_pic);
  if (error) {
    throw new Error(error);
  }
  //
  try {
    const processed = await processOnPic(profile_pic);

    const picCreated = await Pictures.create(processed, {
      transaction: t,
    });
    if (!picCreated) {
      throw new Error("profile_pic creation failed");
    }

    picCreated.file_data = picCreated.file_data.toString("base64");
    return picCreated;
  } catch (err) {
    throw new Error(err);
  }
};

const processOnPic = async (pic) => {
  try {
    const image = sharp(pic.file_data);
    const image_metadata = await image.metadata();
    if (image_metadata.width > 640) {
      image.resize(640);
      let processed_buffer = await image.toBuffer({ resolveWithObject: true });
      if (processed_buffer) {
        pic.file_data = processed_buffer.data;
        pic.file_size = processed_buffer.info.size;
      } else {
        throw new Error("image processing failed");
      }
    }
    return pic;
  } catch (err) {
    throw new Error(err);
  }
};

const getAllProductsMiddleware = () => {
  return Products.findAll({
    attributes: ["title", "description"],
    include: [
      {
        model: Color,
        as: "product_has_color",
        attributes: ["id"],
        include: [
          {
            model: Tones,
            as: "color_has_tones",
            attributes: ["id"],
            include: [
              {
                model: Pictures,
                as: "tone_has_pic",
              },
            ],
          },
        ],
      },
    ],
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
const getProductMiddleware = (id) => {
  return Products.findOne({
    where: {
      id: id,
    },
    attributes: ["title", "description"],
    include: [
      {
        model: Color,
        as: "product_has_color",
        include: [
          {
            model: Tones,
            as: "color_has_tones",
            include: [
              {
                model: Pictures,
                as: "tone_has_pic",
              },
            ],
          },
        ],
      },
    ],
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

//
module.exports = {
  productCreation,
  colorCreation,
  toneCreation,
  addPicByToneId,
  getAllProductsMiddleware,
  getProductMiddleware,
};
