// MongoDB Connection Config.
let mongoURI;
if (process.env.NODE_ENV !== "test") {
    const localconfig = require("../localconfig");
    mongoURI = "mongodb+srv://" + localconfig.mongoDBUser + ":" + localconfig.mongoDBPass + "@whosgotnextcluster-m3xes.mongodb.net/whosgotnext?retryWrites=true&w=majority";
}

// Get the URL for the in-memory mongoDB Test Database.
if (process.env.NODE_ENV === "test") {
    mongoURI = process.env.MONGO_URL;
}

// Logging
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-backend"});

// MongoDB Modules.
const mongoose = require("mongoose");

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
