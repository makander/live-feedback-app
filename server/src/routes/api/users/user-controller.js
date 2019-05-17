import passport from "passport";
import UserServices from "./user-services";

// Load validation
// eslint-disable-next-line no-unused-vars
import { validateRegisterInput, validateLoginInput } from "../../../validation";

export const register = async function(req, res, next) {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const result = await UserServices.register(req, res, next);
    if (!result.ok) {
      return res.status(400).json(result.error);
    }
    req.login();
    return res.status(200).json({ ok: true, data: result.data.toRegJSON() });
  } catch (error) {
    return res.json(error);
  }
};

export const login = async (req, res, next) => {
  return passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ ok: false, error: "You are not authorized" });
    }
    return res.json({ ok: true, data: user.toAuthJSON() });
  })(req, res, next);
};

export const validateUser = async (req, res, next) => {
  return passport.authenticate("jwt", (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ ok: false, error: "Token is invalid" });
    }
    return res.json({ ok: true, data: "Token is valid" });
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logout();
  res.status(200).json({ msg: "Successfully logged out" });
};

export const getUser = function(req, res, next) {
  res.json({ ok: true, data: req.user.toRegJSON() });
  return next();
};

export const secret = function(req, res) {
  res.json({
    ok: true,
    data: `Welcome ${req.user.username} to our secret content!`
  });
};
