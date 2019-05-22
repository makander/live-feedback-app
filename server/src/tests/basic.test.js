/* eslint-disable import/order */
/* eslint-disable global-require */
/* eslint-disable import/first */
/* eslint-env node, mocha, chai, sinon */
import User from "../models/User";
import mongoose from "mongoose";

process.env.NODE_ENV = "test";
process.env.API_BASE = "/api";

const hostUrl = "http://localhost:5000";
const request = require("supertest")(hostUrl);

const newUser = {
  "name": "Christian Test",
  "email": "christian-test@anneblom.se",
  "password": "secret",
  "password2": "secret"
};

function findUser() {
  console.log("Hej");

  const foundUser = User.findOne({ email: newUser.email }, function(err, user) {
    if (err) {
      console.log("error: ", err);
      return err;
    }
    if (!user) {
      console.log("user does not exist: ", user);
      return done(null, false, "user does not exist!");
    }
    console.log("USER TYPE ADMIN");
    return done(null, user);
  });
  console.log("da");
  return foundUser;
  // try {
  //   const existingUser = await User.findOne({ email: newUser.email }, function () {
  //     console.log(existingUser);
  //   });
  //   return existingUser.should.have.property('email');
  // } catch(err) {
  //   console.log("error", err);
  // }
  // console.log("existingUser", existingUser);
  // done();
};

describe("GET /", function() {
  it("responds with 404", function(done) {
    request(hostUrl)
      .get('/')
      .expect(404, done);
  });
});

describe("Database", function () {
  beforeEach(function (done) {

    function clearDB() {
      const promises = [
        User.remove().exec(),
    ];

      Promise.all(promises)
        .then(() => {
          done();
        })
    }

    if (mongoose.connection.readyState === 0) {
      mongoose.connect("mongodb://admin:password@database:27017/database?authMechanism=SCRAM-SHA-1&authSource=admin", function (err) {
        if (err) {
          throw err;
        }
        return clearDB();
      });
    } else {
      return clearDB();
    }
  });

  describe("User delete", function() {
    it("creates user", function() {
      return request.post(`api/users/register`)
        .send(newUser)
        .expect(200)
        .then(res => {
          res.body.ok.should.be.true;
        });
    });
  });
})