import mongoose, { Schema } from "mongoose";
import { hashSync, compareSync } from "bcrypt-nodejs";
import jwt from "jsonwebtoken";

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  date: {
    type: Date,
    default: Date.now
  }
});

/** Before insert into database, hash the password */
UserSchema.pre("save", async function(next) {
  const user = this;

  try {
    if (!user.isModified("password")) {
      return next();
    }

    user.password = this._hashPassword(user.password);
    return user;
  } catch (e) {
    return next(e);
  }
});

/** User instance methods */
UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },

  _comparePassword(password) {
    return compareSync(password, this.password);
  },

  /** token will send to client for authenication */
  createToken() {
    return jwt.sign(
      {
        sub: this._id,
        ...this.toRegJSON(),
        expiresIn: "1 days",
        issuer: "rent out"
      },
      process.env.JWT_SECRET
    );
  },

  /** Only for singUp and login */
  /** Attach the token into responses */
  toAuthJSON() {
    return {
      user: { ...this.toRegJSON() },
      token: `JWT ${this.createToken()}`
    };
  },

  /** Override the res.json(user) */
  /** Only return below fields (Example: password is not include) */
  toRegJSON() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email
    };
  }
};

const User = mongoose.model("User", UserSchema);

export default User;
