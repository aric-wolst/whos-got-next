const express = require("express");
const MongoDBConnector = require("./utils/mongoDBConnector");
const auth = require("./utils/auth.js");

// Logging
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-backend"});

// Module definitions.
const userManager = require("./routes/userManager.js");
const eventManager = require("./routes/eventManager.js");

function startApp() {
	// Set up the express app.
	const app = express();

	// Make use of modules.
	app.use("/users", userManager);
	app.use("/events", eventManager);

	app.get("/", (req, res) => {
		auth.authenticateRequest(req).then(() => {
			res.status(200).send("You successfully established an API connection!");
		}).catch((error) => {
			res.status(400).send(error);
		});
	});

	app.listen(8081, () => {
		console.log("server app listening at http://localhost:8081/");
	});
}


const mDBConnector = MongoDBConnector.sharedInstance();
mDBConnector.connect().then(startApp).catch((err) => {log.error(err);});
