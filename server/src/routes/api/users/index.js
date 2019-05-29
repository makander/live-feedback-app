import { Router } from "express";

import * as UserController from "./user-controller";

const routes = new Router();

// @route POST api/users/register
// @desc Register user
// @access Public
routes.post("/register", UserController.register);
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
routes.post("/login", UserController.login);

routes.get("/logout", function(req, res) {
  req.logout();
  res.status(200).json({ msg: "Successfully logged out" });
});

routes.get("/validate", UserController.validateUser);

export default routes;
