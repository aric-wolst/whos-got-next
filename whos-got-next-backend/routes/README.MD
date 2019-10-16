# API Documentation

## Open Endpoints

### `POST /users`
Creates a new user.
**Parameters** User (see datamodel)
**Success Responses** `200 OK` Returns created User object.
**Error Responses** `400 BAD REQUEST` User object isn't valid.

### `GET /users/:userId`
Get profile for user with `:userId`.
**Parameters** None
**Success Responses** `200 OK` Returns User object.
**Error Responses** `400 BAD REQUEST` No user is found.


## Authenticated Endpoints
