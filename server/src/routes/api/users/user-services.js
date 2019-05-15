import User from "../../../models/User";

class UserServices {
  // eslint-disable-next-line consistent-return
  register = async function(req, res, next) {
    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(400).json({ email: "Email already exists" });
      }

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      const savedUser = await newUser.save();
      return res.status(200).json({ ok: true, data: savedUser });
    } catch (err) {
      next(err);
    }
  };

  // eslint-disable-next-line consistent-return
  login = async function(req, res, next) {
    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return existingUser;
      }
      return res.status(400).json({ ok: false, data: "no such user" });
    } catch (err) {
      next(err);
    }
  };
}

export default new UserServices();
