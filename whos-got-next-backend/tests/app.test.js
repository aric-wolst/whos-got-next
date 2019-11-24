// const MongoDBConnector = require("../utils/mongoDBConnector");
const mongoose = require("mongoose");

// Start Test Server Instance.
const startServer = require("../server");
const supertest = require("supertest");
const requesttoken = "test";
let server;
let request;

// Setup the mongoDB Connection before running any tests.
beforeAll(async (done) => {
    server = await startServer();
    request = supertest.agent(server);
    done();
});

afterAll(async (done) => {
    await server.close();
    await mongoose.connection.close();
    done();
});

describe("App Test", () => {
    // Root Authentication Test Fail.
    test("Get root endpoint without request token should fail", async (done) => {
      request.get("/").expect(400, done);
    });

    // Root Authentication Test Success.
    test("Get root endpoint with request token should succeed", async (done) => {
      request.get("/").set({ requesttoken }).expect(200).end(done);
    });
});

describe("User Manager Test", () => {
    const {type, identifier, token} = {type: "facebookId", identifier: "1111111111111111", token: "AAAAAAAAAAA"};
    const userData = {authentication: {type, identifier, token}, firstName: "John", lastName: "Snow", birthday: "1993-12-24", description: "Hi there. I am from the North!", sports: [{sport: "Basketball", level: 1}, {sport: "Volleyball", level: 3}]};
    let userId;
    const expoPushToken = "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]";

    // Test create user.
    test("Post user with invalid data should fail", async (done) => {
        request.post("/users").set({ requesttoken, Accept: "application/json","Content-Type": "application/json" })
        .send(JSON.stringify({firstName: "John"})).expect(400, done);
    });

    test("Post user with data should succeed", async (done) => {
        const response = await request.post("/users").set({ requesttoken, Accept: "application/json","Content-Type": "application/json" })
        .send(JSON.stringify(userData)).expect(200);

        userId = response.body._id;
        expect(userId).toBeDefined();
        done();
    });

    test("Posting existing user should fail", async (done) => {
        request.post("/users").set({ requesttoken, Accept: "application/json","Content-Type": "application/json" })
        .send(JSON.stringify(userData)).expect(401, done);
    });

    // Test get users/exists.
    test("User should exist in mongoDB after creation", async (done) => {
        request.get("/users/exists").set({ requesttoken })
        .query({type, identifier}).expect(200).then((response) => {
            expect(response.body._id).toBe(userId);
            done();
        });
    });

    // Test get user.
    test("Get user should succeed", async (done) => {
        request.get("/users/" + userId).set({ requesttoken })
        .expect(200).then((response) => {
            expect(response.body._id).toBe(userId);
            done();
        });
    });

    // Test Get self.
    test("Get self should succeed", async (done) => {
        request.get("/users/self").set({ requesttoken })
        .expect(200).then((response) => {
            expect(response.body._id).toBeDefined();
            done();
        });
    });

    // Test put user.
    test("Put non-existing user should fail", async (done) => {
        request.put("/users/A").set({ requesttoken, Accept: "application/json", "Content-Type": "application/json" })
        .send(JSON.stringify({firstName: "Jonathan"}))
        .expect(400, done);
    });

    test("Put user should succeed", async (done) => {
        request.put("/users/" + userId).set({ requesttoken, Accept: "application/json", "Content-Type": "application/json" })
        .send(JSON.stringify({firstName: "Jonathan"}))
        .expect(200).then((response) => {
            expect(response.body.firstName).toBe("Jonathan");
            done();
        });
    });

    // Test save expo push token to user.
    test("Save invalid ExpoPushToken should fail", async (done) => {
        request.put("/users/" + userId + "/save-expo-push-token/" + "x").set({ requesttoken })
        .expect(401, done);
    });

    test("Save ExpoPushToken should succeed", async (done) => {
        request.put("/users/" + userId + "/save-expo-push-token/" + expoPushToken).set({ requesttoken })
        .expect(200).then((response) => {
            expect(response.body._id).toBe(userId);
            expect(response.body.expoPushToken).toBe(expoPushToken);
            done();
        });
    });

    // Test delete user
    test("Delete user should succeed", async (done) => {
        request.delete("/users/" + userId).set({ requesttoken }).expect(200).end(done);
    });

    test("Delete non-existing user should fail", async (done) => {
        request.delete("/users/" + userId).set({ requesttoken }).expect(410).end(done);
    });

    // Test get users/exists.
    test("User should not exist in mongoDB after deletion", async (done) => {
        request.get("/users/exists").set({ requesttoken })
        .query({type, identifier}).expect(200).then((response) => {
            expect(Object.values(response.body).length).toBe(0);
            done();
        });
    });
});

describe("Event Manager Test", () => {
    // Mock event data.
    const expoPushTokens = ["ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]", "ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]", "ExponentPushToken[zzzzzzzzzzzzzzzzzzzzzz]"];
    let userIds = [];
    let eventData, eventId;
    const fakeId = new mongoose.Types.ObjectId();

    beforeAll(async (done) => {
        // Save test users in in-memory database.
        const userSchema = require("../model/user.js");
        const User = mongoose.model("user", userSchema, "user");
        const usersData = [
            {authentication: {type: "facebookId", identifier: "1111111111111111", token: "AAAAAAAAAAA"}, firstName: "John", lastName: "Snow", expoPushToken: expoPushTokens[0], birthday: "1993-12-24", description: "Hi there. I am from the North!", sports: [{sport: "Basketball", level: 1}, {sport: "Volleyball", level: 3}]},
            {authentication: {type: "facebookId", identifier: "2222222222222222", token: "BBBBBBBBBBB"}, firstName: "Emily", lastName: "Watson", expoPushToken: expoPushTokens[1], birthday: "1993-12-24", description: "Hello. I am from the South.", sports: [{sport: "Volleyball", level: 2}]},
            {authentication: {type: "facebookId", identifier: "3333333333333333", token: "CCCCCCCCCCC"}, firstName: "John", lastName: "Locke", expoPushToken: expoPushTokens[3], birthday: "1993-12-24", description: "Guten tag. I am from the West.", sports: [{sport: "Hockey", level: 3}]}
        ];
        for (let userData of usersData) {
            const user = new User(userData);
            const savedUser = await user.save();
            userIds.push(savedUser._id);
        }

        // Create test event JSON.
        eventData = {organizers: [userIds[0]], players: [], duration: 1, timezone: "America/Los_Angeles", name: "Let's play!", description: "Right now!", location: {coordinates: [-123.24895412299878, 49.26156070119955], type:"Point"}, date: Date(), sport: "Basketball"};
        done();
    });

    // Test create event.
    test("Post event with invalid data should fail", async (done) => {
        request.post("/events").set({ requesttoken, Accept: "application/json","Content-Type": "application/json" })
        .send(JSON.stringify({name: "Let's play!"})).expect(400, done);
    });

    test("Post event should succeed", async (done) => {
        request.post("/events").set({ requesttoken, Accept: "application/json","Content-Type": "application/json" })
        .send(JSON.stringify(eventData)).expect(200).then((response) => {
            eventId = response.body._id;
            expect(eventId).toBeDefined();
            done();
        });
    });

    // Test get event.
    test("Get event should succeed", async (done) => {
        request.get("/events/" + eventId).set({ requesttoken })
        .expect(200).then((response) => {
            expect(response.body.organizers[0]._id).toBe(userIds[0].toString());
            expect(response.body._id).toBe(eventId);
            done();
        });
    });

    // Test get nearby events.
    test("Get nearby events should succeed", async (done) => {
        request.get("/events/nearby").set({ requesttoken })
        .query({longitude: eventData.location.coordinates[0], latitude: eventData.location.coordinates[1]}).expect(200).then((response) => {
            expect(response.body.length).toBe(1);
            done();
        });
    });

    // Test put Event.
    test("Put event should succeed", async (done) => {
        request.put("/events/" + eventId).set({ requesttoken, Accept: "application/json", "Content-Type": "application/json" })
        .send(JSON.stringify({name: "New Event Title", sport: "Volleyball"}))
        .expect(200).then((response) => {
            expect(response.body.name).toBe("New Event Title");
            expect(response.body.sport).toBe("Volleyball");
            done();
        });
    });

    // Test join Event.
    test("Join event with non-existing user should fail", async (done) => {
        request.put("/events/" + eventId + "/requests/" + fakeId + "/join").set({ requesttoken })
        .expect(401, done);
    });

    test("Join non-existing event should fail", async (done) => {
        request.put("/events/" + fakeId +"/requests/" + userIds[1] + "/join").set({ requesttoken })
        .expect(402, done);
    });

    test("Join event with user who is already attending should fail", async (done) => {
        request.put("/events/" + eventId + "/requests/" + userIds[0] + "/join").set({ requesttoken })
        .expect(403, done);
    });

    test("Join event should succeed", async (done) => {
        request.put("/events/" + eventId + "/requests/" + userIds[1] + "/join").set({ requesttoken })
        .expect(200).then((response) => {
            expect(response.body._id).toBe(eventId);
            expect(response.body.players.map((player) => player._id)).toContain(userIds[1].toString());
            done();
        });
    });

    // Test leave event.
    test("Leave event with non-existing user should fail", async (done) => {
        request.put("/events/" + eventId + "/requests/" + fakeId + "/leave").set({ requesttoken })
        .expect(401, done);
    });

    test("Leave non-existing event should fail", async (done) => {
        request.put("/events/" + fakeId +"/requests/" + userIds[1] + "/leave").set({ requesttoken })
        .expect(402, done);
    });

    test("Leave event should succeed", async (done) => {
        request.put("/events/" + eventId + "/requests/" + userIds[1] + "/leave").set({ requesttoken })
        .expect(200).then((response) => {
            expect(response.body._id).toBe(eventId);
            expect(response.body.players.map((player) => player._id)).not.toContain(userIds[1].toString());
            done();
        });
    });

    test("Leave event with user who is not attending should fail", async (done) => {
        request.put("/events/" + eventId + "/requests/" + userIds[0] + "/leave").set({ requesttoken })
        .expect(403, done);
    });

    // Test delete event.
    test("Delete event should succeed", async (done) => {
        request.delete("/events/" + eventId).set({ requesttoken }).expect(200).end(done);
    });

    test("Delete non-existing event should fail", async (done) => {
        request.delete("/events/" + eventId).set({ requesttoken }).expect(410).end(done);
    });
});
