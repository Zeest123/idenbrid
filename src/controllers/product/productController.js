const sequelize = require("../../config/database");
const asyncHandler = require("express-async-handler");
// // const { Users, validateUser } = require("../../models/users");

// const { expressValidatorError } = require("../../middleware/commonMiddleware");
const {
  productCreation,
  colorCreation,
  toneCreation,
  addPicByToneId,
  getAllProductsMiddleware,
  getProductMiddleware,
  //   getUserByIdMiddleware,

  //   userUpdation,
  //   getUserByEmailAndCNIC,
  //   encryptPassword,
  //   refactorUsersData,
  //   getAllusersMiddleware,
  //   getUserByIdWithDetailMiddleware,
} = require("./productHelper");
const { validateProduct } = require("../../models/products");
const { validateColor } = require("../../models/color");
const { validateTones } = require("../../models/tones");
// const {
//   addProfilePicByUserID,
//   updateProfilePicByUserID,
// } = require("./profilePicture/profilePicHelper");

// @desc Create new product
// @route POST /product
// @access Private
const createProduct = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  const prodectData = JSON.parse(req.body.productData);
  const product_pic = req?.files;

  const t = await sequelize.transaction();

  try {
    // Create the main product

    const product = {
      title: prodectData.title,
      description: prodectData.description,
    };
    //  Validate Product
    if (product) {
      const { error } = validateProduct(product);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }
    }
    const productDetail = await productCreation(product, t);
    if (!productDetail) {
      throw new Error("Product could not be created.");
    }

    await Promise.all(
      prodectData.colorCombination.map(async (data, index) => {
        const colorData = {
          name: data.name,
          product_id: productDetail.id,
        };

        // Validate Color
        const { error } = validateColor(colorData);
        if (error) {
          throw new Error(error.details[0].message);
        }

        const colorDetails = await colorCreation(colorData, t);
        if (!colorDetails) {
          throw new Error("Color could not be created.");
        }

        await Promise.all(
          data.tones.map(async (toneData, toneIndex) => {
            const tone = {
              color_id: colorDetails.id,
              name: toneData.name,
            };

            // Validate Tone
            const { error } = validateTones(tone);
            if (error) {
              throw new Error(error.details[0].message);
            }

            const toneDetails = await toneCreation(tone, t);
            if (!toneDetails) {
              throw new Error(
                `Tone could not be created at index ${toneIndex}.`
              );
            }

            addPicByToneId(
              toneDetails.id,
              product_pic[
                `colorCombination[${index}].tones[${toneIndex}].shade`
              ]
            );
          })
        );
      })
    );

    // Commit the transaction after all operations succeed
    await t.commit();
    return res.status(200).json({ message: "Product created successfully!" });
  } catch (error) {
    await t.rollback();
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
          ? "Something went wrong in user creation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get products data
// @route GET /product
// @access Private
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    //get all products
    const products = await getAllProductsMiddleware();

    if (!products) {
      res.status(400);
      throw new Error("No products found");
    }

    res.status(200).json({
      products,
    });
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
          ? "Something went wrong while fetching products: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get product data by id
// @route GET /product/id
// @access Private
const getProductDetail = asyncHandler(async (req, res) => {
  try {
    //get all products
    const products = await getProductMiddleware(req.params.id);

    if (!products) {
      res.status(400);
      throw new Error("No product found");
    }

    res.status(200).json({
      products,
    });
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
          ? "Something went wrong while fetching product: "
          : ""
      }${error.message}`
    );
  }
});

// const updateUserProfile = asyncHandler(async (req, res) => {
//   // if (!req.result.permission_settings.user_create_view_and_edit) {
//   //   res.status(400);
//   //   throw new Error("You are not allowed to perform this action");
//   // }

//   //validate param data
//   expressValidatorError(req);

//   const userDetail = JSON.parse(req.body.userData);

//   const profile_pic = req.files ? req.files.userImage : null;

//   userDetail.updated_by = req.params.id;

//   //validate userDetail
//   if (userDetail) {
//     const { error } = validateUser(userDetail);
//     if (error) {
//       res.status(400);
//       throw new Error(error.details[0].message);
//     }
//   }

//   const t = await sequelize.transaction();
//   try {
//     //check if user exist with param id
//     const userExistsById = await getUserByIdMiddleware(req.params.id);
//     if (!userExistsById) {
//       res.status(400);
//       throw new Error("The user ID you entered does not exist");
//     }

//     //check if user email and cnic already exist
//     if (
//       userExistsById.email !== userDetail.email ||
//       (userDetail.CNIC && userExistsById.CNIC !== userDetail.CNIC)
//     ) {
//       const userExists = await getUserByEmailAndCNIC(
//         userDetail,
//         userExistsById.id
//       );

//       // if yes then throw error
//       if (userExists) {
//         res.status(400);
//         throw new Error(
//           "User already exists with same email address or CNIC number"
//         );
//       }
//     }

//     //update user
//     const updateUser = await userUpdation(userDetail, userExistsById.id, t);
//     if (!updateUser) {
//       res.status(400);
//       throw new Error(
//         "User could not be updated. Rollback occur during upadting store"
//       );
//     }

//     if (profile_pic) {
//       await updateProfilePicByUserID(req.params.id, profile_pic, t);
//     }

//     await t.commit();
//     return res
//       .status(200)
//       .json({ message: "UserProfile updated successfully!" });
//   } catch (error) {
//     await t.rollback();
//     res.status(
//       error.statusCode
//         ? error.statusCode
//         : res.statusCode
//         ? res.statusCode
//         : 500
//     );
//     throw new Error(
//       `${
//         error.statusCode !== 400 && res.statusCode !== 400
//           ? "Something went wrong in user_profile updation: "
//           : ""
//       }${error.message}`
//     );
//   }
// });

// @desc Get user data by ID
// @route GET /api/users/:id
// @access Private
// const getUserById = asyncHandler(async (req, res) => {
//   if (
//     !req.result.permission_settings.user_view ||
//     req.params.id === req.result.id
//   ) {
//     res.status(400);
//     throw new Error("You are not allowed to perform this action");
//   }
//   //validate input data
//   expressValidatorError(req);

//   try {
//     //find only one user with added by, updated by, and permission settings
//     const user = await getUserByIdWithDetailMiddleware(req.params.id);

//     if (!user) {
//       res.status(400);
//       throw new Error("User don't exist");
//     }

//     // {
//     //  createdAt: "2023-06-20T06:21:50.000Z",
//     //  file_data: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBw",
//     //  type: file_mimetype: "image/jpeg",
//     //  name:  file_name: "showcase.jpg",
//     //  size: file_size: 37958,
//     //  updatedAt: "2023-06-20T06:21:50.000Z",
//     // }

//     if (user.user_has_profile_pic) {
//       user.user_has_profile_pic.file_data = `data:${
//         user.user_has_profile_pic.file_mimetype
//       };base64,${user.user_has_profile_pic.file_data.toString("base64")}`;
//     }
//     res.status(200).json({
//       user,
//     });
//   } catch (error) {
//     res.status(
//       error.statusCode
//         ? error.statusCode
//         : res.statusCode
//         ? res.statusCode
//         : 500
//     );
//     throw new Error(
//       `${
//         error.statusCode !== 400 && res.statusCode !== 400
//           ? "Something went wrong while fetching user data: "
//           : ""
//       }${error.message}`
//     );
//   }
// });

module.exports = {
  createProduct,
  getAllProducts,
  getProductDetail,
  //   getAllUsers,
  //   getUserById,
  //  updateUserProfile,
};
