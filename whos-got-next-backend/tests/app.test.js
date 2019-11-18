const MongoDBConnector = require("../utils/mongoDBConnector");
const mongoose = require("mongoose");

// Start Test Server Instance.
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

const requesttoken = "test";

// Setup the mongoDB Connection before running any tests.
beforeAll(() => {
    const mDBConnector = MongoDBConnector.sharedInstance();
    return mDBConnector.connect();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("App Test", () => {
    // Root Authentication Test Fail.
    test("Get root endpoint without request token should fail", async (done) => {
      request.get("/").expect(400).end(done);
    });

    // Root Authentication Test Success.
    test("Get root endpoint with request token should succeed", async (done) => {
      request.get("/").set({ requesttoken }).expect(200).end(done);
    });
});

describe("User Manager Test", () => {
    const {type, identifier, token} = {type: "facebookId", identifier: "1111111111111111", token: "AAAAAAAAAAA"};
    const userData = {authentication: {type, identifier, token}, firstName: "John", lastName: "Snow", birthday: "1993-12-24", description: "Hi there. I am from the North!", sports: [{sport: "Basketball", level: 1}, {sport: "Volleyball", level: 3}]};

    test("Create user with invalid data should fail", async (done) => {
        request.post("/users").set({ requesttoken, Accept: "application/json","Content-Type": "application/json" })
        .send(JSON.stringify({firstName: "John"})).expect(400).end(done);
    });

    let userID;
    test("Create user with data should succeed", async (done) => {
        console.log("POST user");
        request.post("/users").set({ requesttoken, Accept: "application/json","Content-Type": "application/json" })
        .send(JSON.stringify(userData)).expect(200).then((response) => {
            userID = response.body._id;
            expect(userID).toBeDefined();
            console.log("Did POST user");
            done();
        });
    });

    test("User should exist in mongoDB after creation", async (done) => {
        console.log("GET exists user");
        request.get("/users/exists").set({ requesttoken})
        .query({type, identifier}).expect(200).then((response) => {
            expect(response.body._id).toBe(userID);
            console.log("Did GET exists user");
            done();
        });
    });

    test("Posting existing user should fail", async (done) => {
        request.post("/users").set({ requesttoken, Accept: "application/json","Content-Type": "application/json" })
        .send(JSON.stringify(userData)).expect(401).end(done);
    });

    test("Get user should succeed", async (done) => {
        console.log("GET user");
        request.get("/users/" + userID).set({ requesttoken })
        .expect(200).then((response) => {
            console.log("Did GET user");
            expect(response.body._id).toBe(userID);
            done();
        });
    });

    test("Put user should succeed", async (done) => {
        console.log("PUT user");
        request.put("/users/" + userID).set({ requesttoken, Accept: "application/json", "Content-Type": "application/json" })
        .send(JSON.stringify({firstName: "Jonathan"}))
        .expect(200).then((response) => {
            console.log("Did PUT user");
            expect(response.body.firstName).toBe("Jonathan");
            done();
        });
    });
});
