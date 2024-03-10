import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { roles } from "../../configs/roles";
import { IUserDoc, IUserModel } from "./user.interface";
const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        // if (!validator.isEmail(value)) {
        //   throw new Error("Invalid email");
        // }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.static(
  "isEmailTaken",
  async function (
    email: string,
    excludeUserId: mongoose.ObjectId
  ): Promise<boolean> {
    const user = await this.findOne({ email, _id: { ne: excludeUserId } });
    return !!user;
  }
);

userSchema.method(
  "isPasswordMatch",
  async function (password: string): Promise<boolean> {
    const user = this;
    return bcrypt.compare(password, user.password);
  }
);

export const User = mongoose.model("user", userSchema);
