/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import asyncHandler from "../../helpers/asyncHandeler";
import sendResponse from "../../helpers/responseHandler";
import { UserProps } from "./auth.interface";
import uploadImageAndGenerateUrls from "../../helpers/cloudinary";
import UserModel from "./auth.model";
import generateToken from "../../helpers/generateToken";
import verifyRefreshToken from "../../helpers/verifyToken";
import { config } from "../../config";

const createUser = asyncHandler(async (req, res) => {
    const userPayload = req.body as UserProps;
    const photo = req.file;
    let session;

    try {
        // Start session inside try block to handle potential errors
        session = await mongoose.startSession();
        session.startTransaction();

        if (photo) {
            const uploadResult = await uploadImageAndGenerateUrls(
                photo.path,
                userPayload.name
            );
            const photoUrl = uploadResult?.optimizedUrl || "";
            userPayload.photo = photoUrl;
        }

        // Create a new product instance
        const user = new UserModel({ ...userPayload });

        // Save the product using the session
        const result = await user.save({ session });

        // Commit the transaction
        await session.commitTransaction();

        // Send a success response
        sendResponse(res, {
            status: 201,
            success: true,
            message: "User created successfully",
            data: result,
        });
    } catch (error: any) {
        if (session) {
            await session.abortTransaction();
            throw error;
        }
    } finally {
        if (session) {
            await session.endSession();
        }
    }
});

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("Invalid email or password");
    const isMatch = user.password === password;

    if (!isMatch) throw new Error("Invalid email or password");
    const accessToken = generateToken({
        jwtPayload: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: "user",
        },
        expiresIn: config.ACCESS_TOKEN_EXPIRY as string,
        secretToken: config.ACCESS_TOKEN as string,
    });
    const refreshToken = generateToken({
        jwtPayload: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: "user",
        },
        expiresIn: config.REFRESH_TOKEN_SECRET_EXPIRY as string,
        secretToken: config.REFRESH_TOKEN_SECRET as string,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // maxAge: 24 * 60 * 60 * 1000, // 1 day
        // secure: process.env.NODE_ENV === "production",
        // sameSite: "none",
    });

    sendResponse(res, {
        status: 201,
        success: true,
        message: "User login successfully",
        data: user,
        accessToken,
    });
});

const refreshToken = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;



    if (!refreshToken) {
        throw new Error("No token found! Please login again");
    }

    const decodedRefreshToken = await verifyRefreshToken({
        token: refreshToken,
        storedToken: config.REFRESH_TOKEN_SECRET as string,
    });
    console.log(decodedRefreshToken);

    const email = decodedRefreshToken.email as any;
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("there is no user ! please login ");
    // Generate new JWT token
    const accessToken = generateToken({
        jwtPayload: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: "user",
        },
        expiresIn: "1d",
        secretToken: config.ACCESS_TOKEN as string,
    });

    sendResponse(res, {
        status: 201,
        success: true,
        message: "refresh token generate",
        data: null,
        accessToken,
    });
});

export const AuthControllers = {
    createUser,
    loginUser,
    refreshToken,
    // deleteUser,
    // updateUser,
    // getSingleUser,
    // getAllUser,
};
