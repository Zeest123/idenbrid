
const asyncHandler = require("express-async-handler");
const { expressValidatorError } = require("../../../middleware/commonMiddleware");
const { Users } = require("../../../models/users");
const { UserPictures, validateUserPicture } = require("../../../models/userPictures");


const createProfilePic = asyncHandler(async (req, res) => {

    if (!req.result.permission_settings.user_create_view_and_edit) {
        res.status(400);
        throw new Error("You are not allowed to perform this action");
    }

    expressValidatorError(req);
    const user_id = req.body.user_id;

    if((req.files == undefined) || (req.files == null)) {
        res.status(400);
        throw new Error("No image was sent");
    }
    let profile_pic = req.files.profile_pic;
    //
    if(Array.isArray(profile_pic)) {
        profile_pic = profile_pic[0];
    }
    //
    profile_pic = {
        file_name: profile_pic.name,
        file_data: profile_pic.data,
        file_size: profile_pic.size,
        file_mimetype: profile_pic.mimetype,
        user_id: user_id
    };
    //
    const { error } = validateUserPicture(profile_pic);
    if (error) {
        res.status(400);
        throw new Error(error);
    }


    ///////////////////////////////////////////////////////////////////

    const sharp = require('sharp');

    const image = sharp(profile_pic.file_data);
    
    const image_metadata = await image.metadata();

    if(image_metadata.width > 640) {
        image.resize(640);
        //
        let processed_buffer = await image.toBuffer({resolveWithObject: true});
        if(processed_buffer) {
            profile_pic.file_data = processed_buffer.data;
            profile_pic.file_size = processed_buffer.info.size;
        } else {
            res.status(400);
            throw new Error("Could not process the profile_pic");
        }
    }
    
    ///////////////////////////////////////////////////////////////////


    // try to insert into DB now
    try {
        const userExists = await Users.findByPk(user_id);
        if (!userExists) {
            res.status(400);
            throw new Error(
              "this User does not exist"
            );
        }
        //
        const profilePicExists = await UserPictures.findOne({
            where: {
                user_id: user_id
            }
        });
        if (profilePicExists) {
            res.status(400);
            throw new Error(
              "this User already has a profile_pic"
            );
        }
        //
        const profilePicCreated = await UserPictures.create(profile_pic);
        if (!profilePicCreated) {
            res.status(400);
            throw new Error(
              "profile_pic creation failed"
            );
        }
        //
        profilePicCreated.file_data = profilePicCreated.file_data.toString('base64');
        return res.status(200).json(profilePicCreated);
    } catch (error) {
        res.status(
            error.statusCode
              ? error.statusCode
              : res.statusCode
              ? res.statusCode
              : 500
          );
          throw new Error(
            `${
              error.statusCode !== 400 && res.statusCode !== 400
                ? "Something went wrong in profile_picture creation: "
                : ""
            }${error.message}`
          );
    }

});

const retrieveProfilePic = asyncHandler(async (req, res) => {

    if (!req.result.permission_settings.user_view) {
        res.status(400);
        throw new Error("You are not allowed to perform this action");
    }

    expressValidatorError(req);
    const user_id = req.body.user_id;

    try {
        const userExists = await Users.findByPk(user_id);
        if (!userExists) {
            res.status(400);
            throw new Error(
              "this User does not exist"
            );
        }
        //
        const profilePicFound = await UserPictures.findOne({
            where: {
                user_id: user_id
            }
        });
        if (!profilePicFound) {
            res.status(400);
            throw new Error(
            "this User does not have a profile_pic"
            );
        }
        //
        profilePicFound.file_data = profilePicFound.file_data.toString('base64');
        return res.status(200).json(profilePicFound);
    } catch (error) {
        res.status(
            error.statusCode
              ? error.statusCode
              : res.statusCode
              ? res.statusCode
              : 500
          );
          throw new Error(
            `${
              error.statusCode !== 400 && res.statusCode !== 400
                ? "Something went wrong in profile_picture retrieval: "
                : ""
            }${error.message}`
          );
    }

});

const updateProfilePic = asyncHandler(async (req, res) => {

    if (!req.result.permission_settings.user_view_and_edit) {
        res.status(400);
        throw new Error("You are not allowed to perform this action");
    }

    expressValidatorError(req);
    const user_id = req.body.user_id;

    if((req.files == undefined) || (req.files == null)) {
        res.status(400);
        throw new Error("No image was sent");
    }
    let profile_pic = req.files.profile_pic;
    //
    if(Array.isArray(profile_pic)) {
        profile_pic = profile_pic[0];
    }
    //
    profile_pic = {
        file_name: profile_pic.name,
        file_data: profile_pic.data,
        file_size: profile_pic.size,
        file_mimetype: profile_pic.mimetype,
        user_id: user_id
    };
    //
    const { error } = validateUserPicture(profile_pic);
    if (error) {
        res.status(400);
        throw new Error(error);
    }


    ///////////////////////////////////////////////////////////////////

    const sharp = require('sharp');

    const image = sharp(profile_pic.file_data);
    
    const image_metadata = await image.metadata();

    if(image_metadata.width > 640) {
        image.resize(640);
        //
        let processed_buffer = await image.toBuffer({resolveWithObject: true});
        if(processed_buffer) {
            profile_pic.file_data = processed_buffer.data;
            profile_pic.file_size = processed_buffer.info.size;
        } else {
            res.status(400);
            throw new Error("Could not process the profile_pic");
        }
    }
    
    ///////////////////////////////////////////////////////////////////


    // try to insert into DB now
    try {
        const userExists = await Users.findByPk(user_id);
        if (!userExists) {
            res.status(400);
            throw new Error(
              "this User does not exist"
            );
        }
        //
        const profilePicExists = await UserPictures.findOne({
            where: {
                user_id: user_id
            }
        });
        if (!profilePicExists) {
            res.status(400);
            throw new Error(
            "this User does not have a profile_pic"
            );
        }
        //
        let profilePicUpdated = await UserPictures.update(profile_pic, {
            where: {
                user_id: user_id
            }
        });
        if (profilePicUpdated[0] == 0) { // if no rows affected
            res.status(400);
            throw new Error(
              "profile_pic updation failed"
            );
        }
        //
        profilePicUpdated = await UserPictures.findOne({
            where: {
                user_id: user_id
            }
        });
        //
        profilePicUpdated.file_data = profilePicUpdated.file_data.toString('base64');
        return res.status(200).json(profilePicUpdated);
    } catch (error) {
        res.status(
            error.statusCode
              ? error.statusCode
              : res.statusCode
              ? res.statusCode
              : 500
          );
          throw new Error(
            `${
              error.statusCode !== 400 && res.statusCode !== 400
                ? "Something went wrong in profile_picture updation: "
                : ""
            }${error.message}`
          );
    }

});


module.exports = {
    createProfilePic,
    retrieveProfilePic,
    updateProfilePic
};
