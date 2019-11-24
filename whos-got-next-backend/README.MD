# Domain
https://whosgotnext.ca/

# Who's Got Next - Backend

Backend project for the Who's Got Next app.

## Getting Started

Just clone the project, navigate to the backend-directory and run `npm install` to install all dependencies.

### Checkout the backend only

The GitHub repository contains both the frontend and backend for Who's Got Next. To only checkout the backend use *sparse checkout* together with *shallow clone*. That is, on your local machine run:
```
git init <repo>
cd <repo>
git remote add origin 'https://github.com/aric-wolst/whos-got-next.git'
git config core.sparsecheckout true
echo "whos-got-next-backend/**" >> .git/info/sparse-checkout
git pull --depth=1 origin master
```

Read more here: https://stackoverflow.com/a/28039894.

## Running the tests
Simply open terminal at the whos-got-next-backend directory and run `npm test`. To get a coverage report run
```
NODE_ENV=production node app.js --coverage
```

## Built With

* node.js (https://nodejs.org/en/) - JavaScript Runtime
* npm (https://www.npmjs.com) - Package manager.
* express.js (https://expressjs.com) - Lightweight framework for setting up an HTTP REST server more easily.
* mongoose (https://mongoosejs.com/) - Schema-based framework for mongoDB (provides validation, type-casting and more).
* expo-server-sdk (https://github.com/expo/expo-server-sdk-node) - Server-side library for working with Expo using Node.js (used for sending push notifications).
* axios (https://github.com/axios/axios) - Promise based client for making HTTP requests.
* bunyan (https://github.com/trentm/node-bunyan) -  Simple and fast JSON logging module.
* jsonwebtoken (https://jwt.io) - Node library for Generation and Authentication of Request tokens used to secure requests.
* moment-timezone (https://momentjs.com/timezone/) - Node library for parsing and displaying dates in any timezone (used for dates in events).