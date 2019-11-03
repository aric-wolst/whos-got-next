import config from "../config";

export default async function backendRequest(endpoint,params,method,body) {
  var url = config.apiUrl + endpoint;
  if (params && Object.entries(params).length > 0) {
    url += "?" + Object.entries(params).map(keyvalue => keyvalue.map(encodeURIComponent).join("=")).join("&");
  }
  console.log("url: " + url)
  return new Promise((resolve,reject) => {
    if (method === "GET") {
      fetch(url).then(response => {return parseAPIResponse(response)}).then(data => resolve(data))
      .catch(err => {console.error(err); reject(err)});
    } else {
      fetch(url, {
        method: method,
        headers: { Accept: "application/json","Content-Type": "application/json"},
        body: JSON.stringify(body)
      }).then(response => {return parseAPIResponse(response)}).then(data => resolve(data))
      .catch(err => {console.error(err); reject(err)});
    }
  })
}

async function parseAPIResponse(response) {
  if (!response.ok) {
    return new Promise((resolve,reject) => {
      response.text().then(text => {
        reject("Backend Request Error: (" + response.status + ") " + text);
      }).catch(err => { reject("Backend Request Error: (" + response.status + ")") })
    });
  }
  if (response.headers.get("content-length") == 0) {
    return new Promise((resolve,reject) => resolve(0));
  }
  return response.json();
}
