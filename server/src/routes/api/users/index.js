import { Router } from "express";
import passport from "passport";

import * as UserController from "./user-controller";

const routes = new Router();

// @route POST api/users/register
// @desc Register user
// @access Public
routes.post("/register", UserController.register);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
routes.post("/login", (req, res, next) => {
  return passport.authenticate("local", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ ok: false, error: "You are not authorized" });
    }
    return res.json({ ok: true, data: user.toAuthJSON() });
  })(req, res, next);
});

routes.get("/validate", (req, res, next) => {
  return passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      console.log(res);
      return res.json({ ok: false, error: "Token is invalid" });
    }
    console.log(res);
    return res.json({ ok: true, data: "Token is valid" });
  })(req, res, next);
});

export default routes;
