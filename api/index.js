import express from 'express';
import { Server } from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import passport from 'passport';
import mongoose from 'mongoose';
import { photoRoutes, userRoutes } from './modules';

// ENVIRONMENT VARIABLES
const port = process.env.PORT || 8000;
const mode = process.env.NODE_ENV;
let db;

const app = express();

// MIDDLEWARE
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', port);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'); // eslint-disable-line
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use((err, req, res, next) => {
  if (res.headersSent) next(err);
  res.status(err.status || port).render('500');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(compression());

// SERVER ROUTING
app.use('/api/v1', [photoRoutes, userRoutes]);

// NODE ENVIRONMENT SETUP
// NOTE: At this point in time all tests are ran on backend.
// no need to require a webpack build to run testing.
switch (mode) {
  case 'test': {
    db = 'mongodb://localhost/photography-dev';
    break;
  }
  case 'production': {
    app.use(express.static('dist'));
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
    db = process.env.MONGO_URL;
    break;
  }
  default: {
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const webpackConfig = require('../webpack.config');

    app.use(webpackMiddleware(webpack(webpackConfig)));
    db = 'mongodb://localhost/photography-dev';
    break;
  }
}

// DATABASE
mongoose.Promise = global.Promise;
mongoose.connect(db);
mongoose.connection
  .once('open', () => console.log(`Connected to MongoDb: running on ${db}`))
  .on('error', err => console.warn('Warning', err));


// EXPRESS SERVER
export const server = Server(app);
server.listen(port, err => {
  if (err) console.log(`Error happened: ${err}`);
  console.log(`Server listening on http://localhost:${port} in ${mode}.`);
});
