/* eslint-disable import/order */
/* eslint-disable global-require */
/* eslint-disable import/first */
/* eslint-env node, mocha, chai, sinon */
process.env.NODE_ENV = "test";
process.env.API_BASE = "/api";

const request = require("supertest");

const hostUrl = "http://localhost:5000";

describe("GET /", function() {
  it("responds with 404", function(done) {
    request(hostUrl)
      .get('/')
      .expect(404, done);
  });
});