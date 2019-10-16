// MongoDB Connection Config.
const localconfig = require('../localconfig')
const mongoURI = "mongodb+srv://" + localconfig.mongoDBUser + ":" + localconfig.mongoDBPass + "@whosgotnextcluster-m3xes.mongodb.net/whosgotnext?retryWrites=true&w=majority";

// MongoDB Modules.
const mongoose = require('mongoose')

// Data Models.
const userSchema = require('../model/user.js')
const User = mongoose.model('user', userSchema, 'user')

class MongoDBConnector {

    constructor() {
        this.db = mongoose.connection;
        this.db.once('open', () => {console.log('Database Connection established')});
        this.db.on('error', () => {console.error('Mongo DB connection error');})
    }

    async connect() {
        return mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true});
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

module.exports = new MongoDBSingleton()