/* eslint-disable import/prefer-default-export */
import passport from "passport";
import Room from "../../../models/Room";

export const getSessions = async function(req, res, next) {
  return passport.authenticate("jwt", async (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ ok: false, error: "Token is invalid" });
    }
    try {
      const result = await Room.find({ author_id: user._id }, function(
        error,
        docs
      ) {
        if (!error) {
          return docs;
        }
        throw error;
      });
      return res.status(200).json({ ok: true, data: result });
    } catch (error) {
      return res.json(error);
    }
  })(req, res, next);
};

export const getSession = async function(req, res, next) {
  return passport.authenticate("jwt", async (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.json({ ok: false, error: "Token is invalid" });
    }
    try {
      const result = await Room.findOne(
        { room_name: req.params.id },
        (error, docs) => {
          if (!error) {
            return docs;
          }
          return false;
        }
      );
      return res.json({ ok: true, data: result });
    } catch (error) {
      return res.json({ ok: false, data: error });
    }
  })(req, res, next);
};
