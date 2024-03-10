import mongoose, { Model, Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(
    email: string,
    excludeUserId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisterUser = Omit<IUser, "role" | "isEmailVerified">;

export type NewCreatedUser = Omit<IUser, "isEmailVerfied">;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}