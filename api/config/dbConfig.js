import mongoose from 'mongoose';

if (process.env.NODE_ENV !== 'production') {
  process.env.REACT_APP_MONGODB_URL = 'mongodb://localhost/photography-dev';
}

// CONNECT TO MONGO_DB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.REACT_APP_MONGODB_URL);
mongoose.connection
  .once('open', () => console.log(`Connected to MongoDb: running on ${process.env.REACT_APP_MONGODB_URL}`))
  .on('error', err => console.warn('Warning', err));
