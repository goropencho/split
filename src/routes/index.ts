import express from "express";
import users from "./users.route";
import auth from "./auth.route";
const routes = express.Router();

routes.use("/users", users);
routes.use("/auth", auth);

export default routes;
