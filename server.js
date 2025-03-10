const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION. Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection succesful');
  });

// console.log(process.env.NODE_ENV);
const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION. Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Heroku Stop Process Signal
// process.on('SIGTERM', () => {
//   console.log('SIGTERM RECIVED. Shutting down gracefully');
//   server.close(() => {
//     console.log('Process terminated!');
//   });
// });
