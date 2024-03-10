import express from "express";
const users = express.Router();

users.get("/", (req, res) => {
  return res.status(200).end();
});
export default users;
