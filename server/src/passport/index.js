/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User";

/** Local strategy for singup and login */
const localOpts = {
  usernameField: "email",
  passwordField: "password"
};

const localLogin = new LocalStrategy(
  localOpts,
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "No user with that email" });
      }
      if (!user._comparePassword(password)) {
        return done({ message: "Incorrect password" }, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: process.env.JWT_SECRET || "secret"
};

const jwtValidation = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(localLogin);
passport.use(jwtValidation);

export const authLocal = passport.authenticate("local", { session: false });
export const authJwt = passport.authenticate("jwt", { session: false });
