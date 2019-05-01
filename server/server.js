import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

import users from './src/routes/api/users';
import { errorLogger, logger } from './src/loggers';

config({ path: './deploy/.env' });

const app = express();
const router = express.Router();

const dbName = process.env.NODE_ENV === 'dev' ? 'database-test' : 'database' 
const db = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@database:27017/${dbName}?authMechanism=SCRAM-SHA-1&authSource=admin`

if (db === undefined) {
  throw Error('No Mongo URI set');
}

app.use(logger);

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

mongoose.connect(db, { useNewUrlParser : true });
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

app.use(router);

// API Routes goes here
router.use("/api/users", users);

app.use(errorLogger);

app.use(function(err, req, res, next) {
  console.error(err); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));