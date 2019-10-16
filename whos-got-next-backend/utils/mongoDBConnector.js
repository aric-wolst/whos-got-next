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

        // return new Promise(async (resolve,reject) => {
        //     // Connect to MongoDB Atlas Cluster.
        //     try {
        //         await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true});
        //     } catch (e) {
        //         reject('Mongo DB connection error:' + e);
        //     }
        //
        //     this.db = mongoose.connection;
        //     // this.db.on('error', );
        //     this.db.once('open', resolve(this));
        // });
    }

    // MongoDB Data Funtions.
    async create(obj) {
        return obj.save();
    	// return new Promise((resolve,reject) => {
        //     obj.save((err, savedObj) => {
        // 		if (err) {
        //             reject(err);
        //             return console.error(err);
        //         }
        // 		console.log(obj._id + " saved to " + obj.collection.name + " collection.");
        //         resolve(savedObj);
        // 	})
        // })
    }

    async createUser() {
        const user = new User({ email: "sam@mail.com", firstName: "John", lastName: "Doe" });
        return user.save((err, savedUser) => {
    		if (err) return console.error(err);
            console.log("user saved");
    		// console.log(obj + " saved to " + obj.collection + " collection.");
            // return savedObj;
    	})
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
