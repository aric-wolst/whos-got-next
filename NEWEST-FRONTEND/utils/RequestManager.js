import config from "../config";
import { Alert, AsyncStorage } from "react-native";


async function parseAPIResponse(response) {
  const requestToken = response.headers.get("requesttoken");
  if (requestToken) { await AsyncStorage.setItem("requestToken", requestToken); }

  if (parseInt(response.headers.get("content-length")) === 0) {
    return new Promise((resolve) => resolve(0));
  }
  if (!response.ok) {
    return new Promise((resolve,reject) => {
      response.text().then((text) => {
        reject("Backend Request Error: (" + response.status + ") " + text);
    }).catch(() => { reject("Backend Request Error: (" + response.status + ")"); });
    });
  }
  return response.json();
}

export default async function backendRequest(endpoint,params,method,body) {
  const requestToken = await AsyncStorage.getItem("requestToken");
  var url = config.apiUrl + endpoint;
  if (params && Object.entries(params).length > 0) {
    url += "?" + Object.entries(params).map((keyvalue) => keyvalue.map(encodeURIComponent).join("=")).join("&");
  }
  return new Promise((resolve) => {
    if (method === "GET") {
      fetch(url, {
        headers: { requesttoken: requestToken }
      }).then((response) => {return parseAPIResponse(response);}).then((data) => resolve(data))
      .catch((err) => Alert.alert("Request Manager Promise Error", err.message));
    } else {
      fetch(url, {
        method,
        headers: { requesttoken: requestToken, Accept: "application/json","Content-Type": "application/json"},
        body: JSON.stringify(body)
      }).then((response) => {return parseAPIResponse(response);}).then((data) => resolve(data))
      .catch((err) => Alert.alert("Request Manager Promise Error",err.message));
    }
  });
}
