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

### `PUT /users/:userId`
Update fields for user with `:userId` (e.g. description, first name and birthday)
**Parameters** JSON with user fields to update
**Success Responses** `200 OK` Returns updated User object.
**Error Responses** `400 BAD REQUEST` No user matching the  `:userId` was found.

### `GET /users/self`
Get profile for current user 
**Parameters** None
**Success Responses** `200 OK` Returns User object.
**Error Responses** `400 BAD REQUEST` Bad Request.


## Authenticated Endpoints
