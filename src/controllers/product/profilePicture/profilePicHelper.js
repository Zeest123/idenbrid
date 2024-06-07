const {
  UserPictures,
  validateUserPicture,
} = require("../../../models/userPictures");
const sharp = require("sharp");

// returns base64 encoded image 'Object' that was Created
// OR
// throws 'Error'
const addProfilePicByUserID = async (user_id, profile_pic, t) => {
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
    user_id: user_id,
  };
  //
  const { error } = validateUserPicture(profile_pic);
  if (error) {
    throw new Error(error);
  }
  //
  try {
    const processedProfilePic = await processProfilePic(profile_pic);
    //
    // const profilePicExists = await UserPictures.findOne({
    //   where: {
    //     user_id: user_id,
    //   },
    // });
    // if (profilePicExists) {
    //   throw new Error("this User already has a profile_pic");
    // }
    //
    const profilePicCreated = await UserPictures.create(processedProfilePic, {transaction: t});
    if (!profilePicCreated) {
      throw new Error("profile_pic creation failed");
    }
    //
    profilePicCreated.file_data =
      profilePicCreated.file_data.toString("base64");
    return profilePicCreated;
  } catch (err) {
    throw new Error(err);
  }
};

// returns 'null' if no image found against a user
// OR
// returns base64 encoded image 'Object' that was found in DB
// OR
// throws 'Error'
const getProfilePicByUserID = async (user_id) => {
  try {
    const result = await UserPictures.findOne({
      where: {
        user_id: user_id,
      },
    });
    if (result == null) {
      return null;
    }
    result.dataValues.file_data =
      result.dataValues.file_data.toString("base64");
    return result.dataValues;
  } catch (err) {
    throw new Error(err);
  }
};

// returns base64 encoded image 'Object' that was Created
// OR
// throws 'Error'
const updateProfilePicByUserID = async (user_id, profile_pic, t) => {
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
    user_id: user_id,
  };
  //
  const { error } = validateUserPicture(profile_pic);
  if (error) {
    throw new Error(error);
  }
  //
  try {
    const processedProfilePic = await processProfilePic(profile_pic);
    //
    // const profilePicExists = await UserPictures.findOne({
    //   where: {
    //     user_id: user_id,
    //   },
    // });
    // if (!profilePicExists) {
    //   throw new Error("this User doesn't have a profile_pic");
    // }
    //

    let profilePicUpdated = await UserPictures.upsert(processedProfilePic, {
      where: {
        user_id: user_id,
      },
      transaction: t,
    });

    if (!profilePicUpdated) {
      // if no rows affected
      throw new Error("profile_pic updation failed");
    }
    //
    // profilePicUpdated = await UserPictures.findOne({
    //   where: {
    //     user_id: user_id,
    //   },
    // });
    // //
    // profilePicUpdated.file_data =
    //   profilePicUpdated.file_data.toString("base64");
    return profilePicUpdated;
  } catch (err) {
    throw new Error(err);
  }
};

// returns base64 encoded image 'Object' that was being processed
// OR
// throws 'Error'
const processProfilePic = async (profile_pic) => {
  // profile_pic = req.files.profile_pic;
  try {
    const image = sharp(profile_pic.file_data);
    const image_metadata = await image.metadata();
    if (image_metadata.width > 640) {
      image.resize(640);
      let processed_buffer = await image.toBuffer({ resolveWithObject: true });
      if (processed_buffer) {
        profile_pic.file_data = processed_buffer.data;
        profile_pic.file_size = processed_buffer.info.size;
      } else {
        throw new Error("image processing failed");
      }
    }
    return profile_pic;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  addProfilePicByUserID,
  getProfilePicByUserID,
  updateProfilePicByUserID,
  processProfilePic,
};
