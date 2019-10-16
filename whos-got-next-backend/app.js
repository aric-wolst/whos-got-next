const express = require('express');
const MongoDBConnector = require('./utils/mongoDBConnector')

// Module definitions.
const userManager = require('./routes/userManager.js');

const mDBConnector = MongoDBConnector.sharedInstance()
mDBConnector.connect().then(startApp).catch((err) => {console.error(err);})

function startApp() {
	// Set up the express app.
	const app = express();
	
	// Make use of modules.
	app.use('/users', userManager);

	app.get('/', (req, res) => {
		res.status(200).send({
		    success: 'true',
		    message: 'Hurray!! You successfully established an API connection!'
		})
	});

	var server = app.listen(8081, () => {
		var host = server.address().address
		var port = server.address().port
		console.log("server app listening at http://:%s",port);
	});
}
