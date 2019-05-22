/* eslint-disable import/order */
/* eslint-disable global-require */
/* eslint-disable import/first */
/* eslint-env node, mocha, chai, sinon */
process.env.NODE_ENV = "test";
process.env.API_BASE = "/api";

import User from "../models/User";

const baseUrl = "http://localhost:5000";

export const request = require("supertest")(baseUrl);
export const chai = require("chai");

export const should = chai.should();

export const defaultUser = {
  "name": "Christian",
  "email": "christian@anneblom.se",
  "password": "secret",
  "password2": "secret"
};

export async function createUser() {
  const UserModel = new User(defaultUser);
  await UserModel.save();
}

export async function getDefaultUser() {
  const users = await User.findOne({ "email": defaultUser.email });
  if (users.length === 0) {
    await createUser();
    return getDefaultUser();
  } 
  return users[0];
};

export async function loginWithDefaultUser() {
  const user = await getDefaultUser();
  return request.post(`${process.env.API_BASE}/users/login`)
    .send({ "email": user.email, "password": user.password })
    .expect(200);
};

export async function cleanExceptDefaultUser() {
  const user = await getDefaultUser();
  await User.deleteMany({ "email": { $ne: user.email }});
};
