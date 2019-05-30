/* eslint-disable consistent-return */
/* eslint-disable import/order */
/* eslint-disable global-require */
/* eslint-disable import/first */
/* eslint-env node, mocha, chai, sinon */
import User from "../models/User";
import mongoose from "mongoose";

require("should-http");

const hostUrl = "http://localhost:5000";
const server = require("../server");
const request = require("supertest");
const should = require("should");

const testServer = process.env.NODE_ENV === "testing" ? server : hostUrl;
const newUser = {
  name: "Christian Test",
  email: "christian-test@anneblom.se",
  password: "secret",
  password2: "secret"
};

describe("Database tests", function() {
  before(function(done) {
    function clearDB() {
      const promises = [User.deleteMany({}).exec()];

      Promise.all(promises).then(() => {
        done();
      });
    }

    if (mongoose.connection.readyState === 0) {
      mongoose.connect(
        process.env.MONGO_TEST_CONNECTION,
        { useNewUrlParser: true },
        function(err) {
          if (err) {
            throw err;
          }
          return clearDB();
        }
      );
    } else {
      return clearDB();
    }
  });

  describe("User tests", function() {
    it("should return missing name", function(done) {
      request(testServer)
        .post(`/api/users/register`)
        .send({
          email: newUser.email,
          password: newUser.password,
          password2: newUser.password2
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.name.should.equal("Name field is required");
          done();
        });
    });

    it("should return missing email", function(done) {
      request(testServer)
        .post(`/api/users/register`)
        .send({
          name: newUser.name,
          password: newUser.password,
          password2: newUser.password2
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.email.should.equal("Email field is required");
          done();
        });
    });

    it("should return passwords must match", function(done) {
      request(testServer)
        .post(`/api/users/register`)
        .send({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.password2.should.equal("Passwords must match");
          done();
        });
    });

    it("should return password must be longer than 6 characters", function(done) {
      request(testServer)
        .post(`/api/users/register`)
        .send({
          name: newUser.name,
          email: newUser.email,
          password: "test",
          password2: "test"
        })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.password.should.equal(
            "Password must be at least 6 characters"
          );
          done();
        });
    });

    it("should create user", function(done) {
      request(testServer)
        .post(`/api/users/register`)
        .send(newUser)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.ok.should.equal(true);
          done();
        });
    });

    it("should return token on login", function(done) {
      function tokenIsSet(res) {
        if (!("token" in res.body.data)) throw new Error("missing JWT token");
      }

      request(testServer)
        .post("/api/users/login")
        .send({ email: newUser.email, password: newUser.password })
        .expect(200)
        .expect(tokenIsSet)
        .end(function(err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.ok.should.equal(true);
          done();
        });
    });

    it("should fail when logging in with incorrect credentials", function(done) {
      request(testServer)
        .post("/api/users/login")
        .send({ email: "bla@bla.com", password: "hejhej" })
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.ok.should.equal(false);
          done();
        });
    });

    it("should send correct logout message", function(done) {
      request(testServer)
        .get("/api/users/logout")
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          should.exist(res.body);
          res.body.msg.should.equal("Successfully logged out");
          done();
        });
    });
  });
});
