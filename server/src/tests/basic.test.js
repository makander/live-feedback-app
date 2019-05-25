/* eslint-disable consistent-return */
/* eslint-disable import/order */
/* eslint-disable global-require */
/* eslint-disable import/first */
/* eslint-env node, mocha, chai, sinon */
import User from "../models/User";
import mongoose from "mongoose";

require("should-http");

process.env.NODE_ENV = "test";
process.env.API_BASE = "/api";

const hostUrl = "http://localhost:5000";
const server = require("../server");
const request = require("supertest")(server);
const should = require("should");
const assert = require("assert");

const newUser = {
  "name": "Christian Test",
  "email": "christian-test@anneblom.se",
  "password": "secret",
  "password2": "secret"
};

describe("GET /", function() {
  it("responds with 404", function(done) {
    request.get('/')
      .expect(404, done);
  });
});

describe("Database tests", function () {
  before(function (done) {

    function clearDB() {
      const promises = [
        User.deleteMany({}).exec(),
    ];

      Promise.all(promises)
        .then(() => {
          done();
        })
    }

    if (mongoose.connection.readyState === 0) {
      mongoose.connect(process.env.MONGO_TEST_CONNECTION, { useNewUrlParser: true }, function (err) {
        if (err) {
          throw err;
        }
        return clearDB();
      });
    } else {
      return clearDB();
    }
  });

  describe("User tests", function() {
    it("should create user", function (done) {
      request.post(`/api/users/register`)
        .send(newUser)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.ok.should.equal(true);
          done();
        })
    });

    it("should return token on login", function (done) {
      function tokenIsSet(res) {
        if (!('token' in res.body.data)) throw new Error("missing JWT token");
      }

      request.post("/api/users/login")
        .send({ email: newUser.email, password: newUser.password })
        .expect(200)
        .expect(tokenIsSet)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.ok.should.equal(true);
          done();
        });
    });

    it("should fail when logging in with incorrect credentials", function (done) {
      request.post("/api/users/login")
        .send({ email: "bla@bla.com", password: "hejhej"})
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.ok.should.equal(false);
          done();
        });
    });

    it("should send correct logout message", function(done) {
      request.get("/api/users/logout")
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.msg.should.equal("Successfully logged out");
          done();
        });
    });
  });
})