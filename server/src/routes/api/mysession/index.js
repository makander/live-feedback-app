import { Router } from "express";

// import * as MySessionController from "./session-controller";

const routes = new Router();

// @route GET api/my-session
// @desc Load Session Data from MongoDB
// @access Private
routes.get("/", () =>
  console.log("QERWERWERWERWERWERWERWERWERWERWERDSFSDFSDFSDFSF")
);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
/* routes.post("/login", (req, res, next) => {
  return passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ ok: false, error: "You are not authorized 2" });
    }
    return res.json({ ok: true, data: user.toAuthJSON() });
  })(req, res, next);
}); */

export default routes;
