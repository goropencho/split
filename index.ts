require("dotenv").config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import config from "./src/configs/config";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import { User as UserModel } from "./src/models/user";
import { expressMiddleware } from "@apollo/server/express4";
import { GraphQLError } from "graphql";
const app = express();
await mongoose.connect(config.DB_URL);
const httpServer = http.createServer(app);

const typeDefs = `#graphql
  type User{
    _id: ID!
    username: String
    password: String
    email: String
  }
  type Query{
    users: [User]
    user(_id:ID!):User
  }
  type Mutation {
    addUser(username: String, password: String, email: String): User
  }
  `;

const resolvers = {
  Query: {
    users: (_parent: any, _args: any, { dataSourses }) => {
      return dataSourses.users.getUsers();
    },
    user: (_parent: any, { _id }, { dataSourses }) => {
      return dataSourses.users.getUser(_id).then((res: UserDocument) => {
        if (!res) {
          throw new GraphQLError(`User with User Id ${_id} does not exist.`);
        }
        return res;
      });
    },
  },
  Mutation: {
    addUser: (_parent: any, { username, password, email }, { dataSourses }) => {
      return dataSourses.users
        .addUser(username, password, email)
        .then((res: { insertedIds: ObjectId[] }) => ({
          _id: res.insertedIds[0],
          username,
          password,
          email,
        }));
    },
  },
};

app.get("/", (req: Request, res: Response) => {
  return res.status(200).end();
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
