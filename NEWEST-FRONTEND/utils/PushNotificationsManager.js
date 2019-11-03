import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import backendRequest from "./RequestManager";

export default async function registerForPushNotificationsAsync(userId) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS.
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions.
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device.
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to the backend server from where we can retrieve it to send push notifications.
  backendRequest("/users/" + userId + "/save-expo-push-token/" + encodeURIComponent(token),{},"PUT").then(user => {console.log("saved user: " + user)})
}
