const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  //   res.send("create review");

  const { rating, title, comment, product: productId } = req.body;

  if (!rating || !title || !comment || !productId) {
    throw new CustomError.BadRequestError("Please provide all fields");
  }

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No product found with id: ${productId}`
    );
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Review already submitted for this product"
    );
  }

  req.body.user = req.user.userId;

  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id: ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const { title, comment, rating } = req.body;
  if (!title || !comment || !rating) {
    throw new CustomError.BadRequestError("Please provide all fields");
  }
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id: ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id: ${reviewId}`);
  }
  checkPermissions(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).json({ msg: `Success! Review deleted` });
};

const getSingleProductReviews = async (req, res) => {
  // check product id
  const { id: productId } = req.params;

  const reviews = await Review.find({ product: productId });

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
