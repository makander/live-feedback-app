/* eslint-disable import/order */
/* eslint-disable global-require */
/* eslint-disable import/first */
/* eslint-env node, mocha, chai, sinon */
import User from "../models/User";
import { expect, should } from "chai";

process.env.NODE_ENV = "test";
process.env.API_BASE = "/api";

const request = require("supertest");

const hostUrl = "http://localhost:5000";
const newUser = {
  "name": "Christian Test",
  "email": "christian-test@anneblom.se",
  "password": "secret",
  "password2": "secret"
};

async function findUser() {
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

describe("User delete", function() {
  it("deletes user", function() {
    findUser().then((user) => {
      console.log(user);
      user.should.have.property('email');
    }).catch(err => {
      console.log(err);
    });
  });
});