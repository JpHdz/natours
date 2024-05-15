const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const bookingRouter = express.Router();

bookingRouter.use(authController.protect);
bookingRouter.use(authController.restrictTo('admin', 'lead-guide'));

bookingRouter.get(
  '/checkout-session/:tourID',
  bookingController.getCheckOutSession,
);

bookingRouter
  .route('/')
  .post(bookingController.createBooking)
  .get(bookingController.getAllBookings);

bookingRouter
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = bookingRouter;
