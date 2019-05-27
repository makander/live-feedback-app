/* eslint-disable no-unused-expressions */
/* eslint-env node, mocha, chai, sinon */
import { request, loginWithDefaultUser, cleanExceptDefaultUser, defaultUser, getDefaultUser } from "./common.test";
import User from "../models/User";

describe("# Auth APIs", () => {
  const apiBase = process.env.API_BASE || "/api";
  const newUser = {
    "name": "Christian Test",
    "email": "christian-test@anneblom.se",
    "password": "secret",
    "password2": "secret"
  };

    it("Should be true", () => {
      true.should.be.true;
    })

    it("Should create user", () => {
      User.deleteOne(newUser).then(() => {
        console.log("done!");
      })
      return request.post(`${apiBase}/users/register`)
        .send(newUser)
        .expect(200)
        .then(res => {
          res.body.ok.should.be.true;
        });
    });

    it("Should retrieve the token", () => {
      return cleanExceptDefaultUser().then(() => {
        return loginWithDefaultUser().then(res => {
          res.status.should.equal(200);
          res.body.ok.should.be.true;
          res.body.data.token.should.not.be.empty;
        }).catch(err => {
          return err;
        }).catch(err => {
          return err;
        });
      });
    });

    it("Should not login with the correct user but incorrect password", () => {
      return request.post(`${apiBase}/users/login`)
        .send({ "email": newUser.email, "password": "hej" })
        .expect(401);
    });

    it("Should return invalid credentials error", () => {
      return request.post(`${apiBase}/users/login`)
        .send({ "email": newUser.email, "password": "" })
        .expect(401)
        .then(() => {
          return request.post(`${apiBase}/users/login`)
            .send({ "email": newUser.email, "password": "hejigen" })
            .expect(401);
        });
    });
});