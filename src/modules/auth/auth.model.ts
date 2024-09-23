import mongoose, { Schema } from "mongoose";
import { UserProps } from "./auth.interface";

const userSchema = new Schema<UserProps>(
    {
        name: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        photo: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model<UserProps>("user", userSchema);

export default UserModel;
