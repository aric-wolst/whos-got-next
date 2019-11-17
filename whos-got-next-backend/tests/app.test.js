// Logging.
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-app-Test"});

// MongoDB Connector.
const MongoDBConnector = require("../utils/mongoDBConnector");

// Server Instance.
const app = require("../app");

// Supertest.
const supertest = require("supertest");
const request = supertest(app);

// Setup the mongoDB Connection before running any tests.
beforeAll(() => {
    const mDBConnector = MongoDBConnector.sharedInstance();
    return mDBConnector.connect();
});

// Test that authentication works.
test("Get root endpoint without request token", async (done) => {
  log.info("Root Authentication Test");

  // Sends GET Request to root endpoint.
  const response = await request.get("/");
  // Without a request token, we expect an error response.
  expect(response.status).toBe(400);
  done();
});

// *************************************************************************
//
// Test with in memory mongodb database.
// The code/test below should probably be implemented in another fashion
// (e.g.) under the userManager.test.js by mocking dependencies, but for now
// this illustrates that the in memory mongodb database works.

// MongoDB Modules.
const mongoose = require("mongoose");
const userSchema = require("../model/user.js");
const User = mongoose.model("user", userSchema, "user");

const userData = {authentication: {type: "facebookId", identifier: "1111111111111111", token: "AAAAAAAAAAA"}, firstName: "John", lastName: "Snow", birthday: "1993-12-24", description: "Hi there. I am from the North!", sports: [{sport: "Basketball", level: 1}, {sport: "Volleyball", level: 3}]};

test("Save user successfully", async (done) => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    done();
});
