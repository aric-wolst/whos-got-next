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

*Missing explanation of how to run automated tests (currently there are none).*

### Break down into end to end tests

*Missing description of tests (currently there are none).*

## Built With

* node.js (https://nodejs.org/en/) - JavaScript Runtime
* npm (https://www.npmjs.com) - Package manager.
* express.js (https://expressjs.com) - Lightweight framework for setting up an HTTP REST server more easily.
* mongoose (https://mongoosejs.com/) - Schema-based framework for mongoDB (provides validation, type-casting and more).
