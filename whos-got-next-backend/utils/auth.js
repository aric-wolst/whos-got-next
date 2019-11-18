//Use axios to make http requests to the Facebook Graph API
const axios = require("axios");
const jwt = require("jsonwebtoken");

// Logging
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-authentication"});

//Get facebook app config strings
const localconfig = require("../localconfig");
const appID = localconfig.fbAppID;
const appSecret =localconfig.fbAppSecret;
const key = localconfig.privateKey;

//Get access_token to pass to pass to authentication request
const accessTokenUrl = "https://graph.facebook.com/oauth/access_token?client_id="
                        + appID + "&client_secret=" + appSecret
                        + "&grant_type=client_credentials";

async function authenticateWithFB(inputToken) {
    return new Promise((resolve,reject) => {
        axios.get(accessTokenUrl).then((response) => {
            const appToken = response.data.access_token;
            const authUrl = "https://graph.facebook.com/debug_token?input_token="
                            + inputToken + "&access_token=" + appToken;

            //Authenticate the given user token
            axios.get(authUrl).then(
                resolve()
            ).catch((err) => reject(err));
        }).catch((err) => reject(err));
    });
}

async function authenticateRequest(req) {
    log.info("Authenticating request");
    return new Promise((resolve,reject) => {
        // Retrieve requestToken from header.
        const requestToken = req.headers.requesttoken;

        // No token was found.
        if (!requestToken) {
            log.error("Access denied");
            return reject("Access Denied.");
        }

        // Accept any request token in test environment.
        if (process.env.NODE_ENV === "test") { return resolve(); }

        // Verify the token.
        try {
            jwt.verify(requestToken, key);
            resolve();
        } catch(error) {
            reject("Invalid token");
            log.error("Invalid token");
        }
    });
}

module.exports.authenticateWithFB = authenticateWithFB;
module.exports.authenticateRequest = authenticateRequest;
