# API Documentation

## User Endpoints
`POST /users`
Creates a new user.
**Body** User (see datamodel).
**Example**
```bash
curl -X POST http://34.220.132.159/users/ \
-H 'content-type:application/json' \
-d '{"authentication": {"type": "facebookId", "identifier": "xxxxxxxxxxxxxxxxx", "token": "xxxxxxxxxxxxxxxxx"}, "firstName": "Maria", "lastName": "Raboy", "birthday": "1993-10-07", "description": "Hello world!", "sports": [{"sport": "basketball", "level": 1}, {"sport": "volleball", "level": 3}]}'
```
**Success Responses** `200 OK` Returns created User object.
**Error Responses**
`400 BAD REQUEST` User object isn't valid.
`401 BAD REQUEST` User object already exists.
`402 BAD REQUEST` Facebook Authentication Failed.
`403 BAD REQUEST` No user info provided.

`GET /users/exists`
Get user profile for user with matching authentication query parameters if it exists.
**Body** None.
**Parameters**
`type`: enum, which is either *facebookId* or *email* (depending on which method we use to authenticate the user).
`identifier`: string with actual facebookId or email.
**Example**
```bash
curl -X GET 'http://34.220.132.159/users/exists?type=facebookId&identifier=xxxxxxxxxxxxxxxxx'
```
**Success Responses** `200 OK` Returns User object if it exists. Else it will return a null response. 
**Error Responses** `400 BAD REQUEST` Bad Request.

`GET /users/:userId`
Get profile for user with `:userId`.
**Body** userId.
**Success Responses** `200 OK` Returns User object.
**Error Responses**
`400 BAD REQUEST` Bad Request.
`401 BAD REQUEST` No user matching the `:userId` is found.


`PUT /users/:userId`
Update fields for user with `:userId` (e.g. description, first name and birthday)
**Body** JSON with user fields to update.
**Success Responses** `200 OK` Returns updated User object.
**Error Responses** `400 BAD REQUEST` No user matching the  `:userId` was found.


`DELETE /users/:userId`
DELETE user with `:userId`
**Body** userId.
**Success Responses** `200 OK` User was deleted.
**Error Responses**
`400 BAD REQUEST` Bad Request.
`410 BAD REQUEST` No user matching the `:userId` was found.


`GET /users/self`
Get profile for current user 
**Body** userId.
**Success Responses** `200 OK` Returns User object.
**Error Responses** `400 BAD REQUEST` Bad Request.


`PUT /:userId/save-expo-push-token/:expoPushToken`
Set expo push token for user with `:userId`.
**Body** None.
**Success Responses** `200 OK` Returns updated user object.
**Error Responses**
`400 BAD REQUEST` Bad Request.
`401 BAD REQUEST` Invalid Expo Push Token.

## Event Endpoints
`POST /events`
Creates a new event.
**Body** Event (see datamodel)
**Example**
```bash
curl -X POST http://34.220.132.159/events/ \
-H 'content-type:application/json' \
-d '{"name": "Pickup Basketball", "organizers": ["5da6fec2307334139262c2bd"], "players": ["5da6fec2307334139262c2bd"], "description": "Join us for some basketball tomorrow...", "location": {"type": "Point", "coordinates": [-123.252343, 49.262452]}, "date": "2019-11-30T12:00:00", "pendingPlayerRequests": [], "sport": "basketball"}'
```
**Success Responses** `200 OK` Returns created Event object.
**Error Responses**
`400 BAD REQUEST` Event object isn't valid.
`401 BAD REQUEST` Event location can't be geocoded into an address.

`GET /events/:eventId`
Get info for event with `:eventId`.
**Body** eventId.
**Example**
```bash
curl -X GET http://34.220.132.159/events/5dab3e97f5bf8f09c5e4e163
```
**Success Responses** `200 OK` Returns Event object.
**Error Responses** `400 BAD REQUEST` No event is found.


`PUT /events/:eventId`
Update fields for event with `:eventId` (e.g. name and sport)
**Body** JSON with event fields to update
**Example**
```bash
curl -X PUT http://34.220.132.159/events/5dab3e97f5bf8f09c5e4e163 \
-H 'content-type:application/json' \
-d '{"name": "Pickup Volleyball", "sport": "volleyball"}'
```
**Success Responses** `200 OK` Returns updated Event object.
**Error Responses** `400 BAD REQUEST` No event matching the  `:eventId` was found.


`DELETE /events/:eventId`
DELETE event with `:eventId`.
**Body** None.
**Example**
```bash
curl -X DELETE http://34.220.132.159/events/5dab40bcf5bf8f09c5e4e168
```
**Success Responses** `200 OK` Event was deleted.
**Error Responses** `400 BAD REQUEST` No event matching the  `:eventId` was found.


`GET /events/nearby`
Get nearby events.
**Parameters**
`longitude`: the longitude number.
`latitude` the latitude number.
```bash
curl -X GET 'http://34.220.132.159/events/nearby?longitude=-123.252343&latitude=49.262452'
```
**Success Responses** `200 OK` Returns list of nearby events.
**Error Responses** `400 BAD REQUEST` Bad Request.

`PUT /events/:eventID/requests/:userId/request-to-join`
Request for user with `:userId` to join event with `:eventId`.
**Body** None.
**Example**
```bash
curl -X PUT http://34.220.132.159/events/5dab3e97f5bf8f09c5e4e163/requests/5da6e183e89611f4370b1298/request-to-join
```
**Success Responses** `200 OK` Returns updated Event object.
**Error Responses**
`400 BAD REQUEST` Bad Request.
`401 BAD REQUEST` No user is found with `:userId`.
`402 BAD REQUEST` No event is found with `:eventId`.
`403 BAD REQUEST` User request is already added to event.

`PUT /events/:eventID/requests/:userId/accept`
Accept request from user with `:userId` to join event with `:eventId`.
**Body** None.
**Example**
```bash
curl -X PUT http://34.220.132.159/events/5dab3e97f5bf8f09c5e4e163/requests/5da6e183e89611f4370b1298/accept
```
**Success Responses** `200 OK` Returns updated Event object.
**Error Responses**
`400 BAD REQUEST` Bad Request.
`401 BAD REQUEST` No user is found with `:userId`.
`402 BAD REQUEST` No event is found with `:eventId`.
`403 BAD REQUEST` Event already has accepted request from user.

`PUT /events/:eventID/requests/:userId/decline`
Decline request from user with `:userId` to join event with `:eventId`.
**Body** None.
**Example**
```bash
curl -X PUT http://34.220.132.159/events/5dab3e97f5bf8f09c5e4e163/requests/5da6e183e89611f4370b1298/decline
```
**Success Responses** `200 OK` Returns updated Event object.
**Error Responses**
`400 BAD REQUEST` Bad Request.
`401 BAD REQUEST` No user is found with `:userId`.
`402 BAD REQUEST` No event is found with `:eventId`.
