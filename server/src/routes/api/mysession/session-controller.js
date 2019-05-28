/* eslint-disable import/prefer-default-export */
import Room from "../../../models/Room";
import { validateUser } from "../users/user-controller";

export const getSessionData = async function(req, res) {
  console.log("getsessiondata ", req.body);
  validateUser(req);
  try {
    const result = await Room.find({}, function(err, docs) {
      if (!err) {
        console.log(docs);
        process.exit();
      } else {
        throw err;
      }
    });
    return res.status(200).json({ ok: true, data: result.data.toRegJSON() });
  } catch (error) {
    return res.json(error);
  }
};
