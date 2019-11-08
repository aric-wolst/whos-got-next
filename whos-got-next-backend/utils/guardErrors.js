/*
 *                            Guard Errors Module
 *
 * This module is responsible for sending error responses and logging the errors.
 */

 // Logging
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-error-guard"});

/*
 * Description. Checks for errors and sends an error-response for the first found error.
 * @return {Boolean} true if an error was found. Otherwise false.
 * @param {Array<Error>}  errors  List of error objects.
 * @param {Boolean}  error.condition  Condition which throws error.
 * @param {Number}  error.status    Status of error response.
 * @param {String}  error.message    Description of error.
 */
function guardErrors(errors, response) {
    for (const error of errors.filter((e) => e.condition)) {
        response.status(error.status).send(error.message);
        log.error(error.message);
        return true;
    }
    return false;
}

/*
 * Description. Checks whether there is an error and sends a 400-response if there is.
 * @return {Boolean} true if an error was found. Otherwise false.
 * @param {String}  error  Description of error.
 */
function guardDefaultError(error, response) {
    if (error) {
        response.status(400).send(error);
        log.error(error);
        return true;
    }
    return false;
}

module.exports = {guardErrors, guardDefaultError};
