/* eslint-disable import/prefer-default-export */
import roomData from "../../../models/RoomData";

export const getSessionData = async function(req, res) {
  try {
    const result = await roomData.find({}, function(err, docs) {
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
