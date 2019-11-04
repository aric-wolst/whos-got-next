// MongoDB Connection Config.
const localconfig = require("../localconfig");
const mongoURI = "mongodb+srv://" + localconfig.mongoDBUser + ":" + localconfig.mongoDBPass + "@whosgotnextcluster-m3xes.mongodb.net/whosgotnext?retryWrites=true&w=majority";

// Logging
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-backend"});

// MongoDB Modules.
const mongoose = require("mongoose");

// Data Models.
const userSchema = require("../model/user.js");
const User = mongoose.model("user", userSchema, "user");

class MongoDBConnector {

    constructor() {
        this.db = mongoose.connection;
        this.db.once("open", () => {log.info("Database Connection established");});
        this.db.on("error", () => {log.error("Mongo DB connection error");});
    }

    async connect() {
        return mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    }

    // MongoDB Data Funtions.
    async create(obj) {
        return obj.save();
    }
}

class MongoDBSingleton {
  constructor() {
      if (!MongoDBSingleton.instance) {
          MongoDBSingleton.instance = new MongoDBConnector();
      }
  }

  sharedInstance() {
      return MongoDBSingleton.instance;
  }
}

module.exports = new MongoDBSingleton();
