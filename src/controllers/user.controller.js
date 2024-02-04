import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res)=> {
    // get user details from frontend 
    // validation
    //check if user already exists: username,email
    //check for images ,check for avatar
    //upload them to cloudinary,avatar
    //create user object - create entry in db
    //remove password and referesh token field from response
    //check for user creation 
    //ho gya hai to return kr do response ko

    const {fullName,email,username,password} = req.body
    console.log("email:",email);
    // if(fullName ===""){
    //     throw new ApiError(400,"Full name is required")
    // }
    //same as
    if(
        [fullName,email,username,password].some((field)=>
        field?.trim() ==="")
    ){
        throw new ApiError(400,"All fields are required")
    }
    const existedUser = User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User With email or Username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //avatar is compulsory
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    const user = User.create({
        fullName,
        avatar:avatar.url,// avatar hai hee hai 100% bcz we chek avatar
        coverImage:coverImage?.url || "", // here we are not confirm about coverImage bcz we are not check
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )
} )

export {registerUser}  