import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { z } from "zod";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async(user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken
    user.save({validateBeforeSave:false})
    return {accessToken, refreshToken}
}


const signupController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((fields) => fields?.trim() == "")) {
    throw new ApiError(400, "All fileds are required");
  }

  const doesUserAlreadyExists = await User.findOne({
    $or:[{username},{email}]
  })

  if(doesUserAlreadyExists){
    throw new ApiError(400, 'user with this username or email already exists')
  }

  const requiredBody = z.object({
    username: z
      .string()
      .min(3, "Username is too short")
      .max(20, "Username is too long"),
    password: z
      .string()
      .min(8, "Password should contain atleast 8 characters")
      .regex(
        /[A-Z]/,
        "Password should contain atleast one upper case character"
      )
      .regex(
        /[a-z]/,
        "Password should contain atleast one lower case character"
      )
      .regex(/[0-9]/, "Password should contain atleast one numeric character")
      .regex(
        /[\W_]/,
        "Password should contain atleast one special case character"
      ),
    email: z.string().email()
  });

  const validateBody = requiredBody.safeParse(req.body);
  if(!validateBody.success){
    throw new ApiError(400, 'Error occured while validating the body, Please full fill all the requriement')
  }

  const user = await User.create({
    username,
    email,
    password
  })

  return res
  .status(200)
  .json(
    new ApiResponse(200, user.username, 'User created successfully')
  )

});

const loginController = asyncHandler(async(req, res) => {
    const {username, password} = req.body;
    
    const user = await User.findOne({username})

    if(!user){
        throw new ApiError(400, "user with this username does not exists in the database")
    }

    const checkPassword = await user.isPasswordCorrect(password)
    console.log(checkPassword)
    if(!checkPassword){
        throw new ApiError(400, 'Incorrect password')
    }
    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user)

    const cookieOption = {
        httpOnly:true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .json(
        new ApiResponse(200, user?.refreshToken,'User logged In successfully')
    )

})

export { signupController, loginController };
