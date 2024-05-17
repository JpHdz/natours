const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewShema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must contain some content'],
    },
    rating: {
      type: Number,
      required: [true, 'A review must contain some rating'],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewShema.index({ tour: 1, user: 1 }, { unique: true });

reviewShema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewShema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
// Once the document is really saved in the DATABASE, post does not have access to next
reviewShema.post('save', function () {
  // this points to current review
  // console.log(this);
  this.constructor.calcAverageRatings(this.tour);
});

reviewShema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(r);
  next();
});
reviewShema.post(/^findOneAnd/, async function () {
  // await this.findOne() does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewShema);

module.exports = Review;

// POST /tour/2344564t/reviews
// GET /tour/2344564t/reviews
// GET /tour/2344564t/reviews/345er3fsd
