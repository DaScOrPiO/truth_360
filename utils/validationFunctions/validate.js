const ErrorMessage = require("../validation/ErrorMessage");
const {
  campgroundSchema,
  reviewSchema,
} = require("../validation/SchemaValidator");

module.exports.validateCampgrounds = (req, res, next) => {
  const { item } = req.body;
  const result = campgroundSchema.validate(item);
  const { error } = result;
  if (error) {
    const message = error.details.map((el) => el.message);
    throw new ErrorMessage(message, 401);
  } else {
    next();
  }
};

module.exports.validateReviews = (req, res, next) => {
  const { item } = req.body;
  const result = reviewSchema.validate(item);
  const { error } = result;
  if (error) {
    const message = error.details.map((el) => el.message);
    throw new ErrorMessage(message, 400);
  } else {
    next();
  }
};
