/*
*                            Push Notification Module
*
* This module is responsible for sending push notifications.
* NOTE: This module is strongly inspired by the example at https://github.com/expo/expo-server-sdk-node,
* which explains how to send push notifications with expo.
*/

const { Expo } = require("expo-server-sdk");

// Logging
const bunyan = require("bunyan");
const log = bunyan.createLogger({name: "whosgotnext-backend"});

/*
* Description. Private function which logs push notification receipts and any possible errors.
* @param {Array}   receipts   List of receipt objects.
*/
async function readReceipts(receipts) {
    // The receipts specify whether Apple or Google successfully received the
    // notification and information about an error, if one occurred.
    log.info(receipts);

    for (let errorReceipt of receipts.filter((receipt) => {receipt.status === "error";})) {
        const receiptHasDetails = (errorReceipt.details && errorReceipt.details.error);
        const error = receiptHasDetails ? "The error code is " + errorReceipt.details.error : "There was an error sending a notification: " + errorReceipt.message;
        log.error(error);
    }
}

/*
* Description. Private helper function, which retrieves receipts from
* the Expo service and parses them to the readReceipts() function.
* @param {Array}   receiptIds   List of receipt ids.
* @param {Expo}   expo   Expo SDK Client.
*/
async function retrieveReceipts(expo, receiptIds) {
    // Batch the receipt ids in chunks to reduce the number of requests.
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    // Retrieve batches of receipts from the Expo service.
    // (one chunk of receipts at a time to spread out the load).
    for (let chunk of receiptIdChunks) {
        try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            readReceipts(receipts);
        } catch (error) {
            log.error(error);
        }
    }
}

/*
* Description. Private helper function to send push notifications via the Expo service.
* Returns array of receipt ids, which is used to get notification receipts.
* @param {Array}   chunks   List of batches of push notifications.
* @param {Expo}   expo   Expo SDK Client.
*/
async function sendPushNotificationChunks(chunks, expo) {
    // Sending a notification produces a ticket, which contains a receipt ID,
    // which we later use to get the receipt.
    let tickets = [];

    // Send the chunks (one chunk at a time to spread the load
    // out over time) to the Expo push notification service.
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            log.info(ticketChunk);
            tickets.push(...ticketChunk);
            // NOTE: Error codes are listed in the Expo documentation:
            // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
        } catch (error) {
            log.error(error);
        }
    }

    // Filter the tickets for receipt IDs.
    let receiptIds = tickets.filter((ticket) => {ticket.id;}).map((ticket) => {ticket.id;});

    return receiptIds;
}

/*
* Description. Send Push Notification to a list of users.
* @param {Array}   pushTokens   List of pushTokens (each token represents a user who has opted in).
* @param {String}  pushTitle    Title of push notification.
* @param {String}  pushBody     Message body of push notification.
*/
async function sendNotifications(pushTokens, pushTitle, pushBody) {
    // Create a new Expo SDK client
    let expo = new Expo();

    // Create the messages that we want to send to clients.
    let messages = [];
    for (let pushToken of pushTokens) {
        // Check that all our push tokens appear to be valid Expo push tokens.
        if (!Expo.isExpoPushToken(pushToken)) {
            log.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
        messages.push({
            to: pushToken,
            sound: "default",
            body: pushBody,
            title: pushTitle
        });
    }

    // Batch the notifications to reduce the number of requests and to compress them
    // (notifications with similar content will get compressed).
    const chunks = expo.chunkPushNotifications(messages);

    // Send the push notifications.
    const receiptIds = await sendPushNotificationChunks(chunks, expo);

    // Retrieve and read the receipts for the push notifications.
    retrieveReceipts(expo, receiptIds);
}

module.exports = sendNotifications;
