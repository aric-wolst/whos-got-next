const express = require("express");
const MongoDBConnector = require("./utils/mongoDBConnector");

const https = require("https");
const fs = require("fs");
const localconfig = require("./localconfig");
const passphrase = localconfig.sslPassphrase;

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
		res.status(200).send("You successfully established an API connection!");
	});

	//Create the https server
	https.createServer({
		key: fs.readFileSync("./key.pem"),
		cert: fs.readFileSync("./cert.pem"),
		passphrase
	}, app).listen(8081, () => {
		//var host = server.address().address;
		//var port = server.address().port;
		log.info("server app listening at https://:8081");
	});
}


const mDBConnector = MongoDBConnector.sharedInstance();
mDBConnector.connect().then(startApp).catch((err) => {log.error(err);});
