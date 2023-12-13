const joi = require("joi");

module.exports.campgroundSchema = joi
  .object({
    title: joi.string().required(),
    price: joi.number().required().min(0),
    description: joi.string().required(),
    location: joi.string().required(),
    // image: joi.string().required(),
  })
  .required();

module.exports.reviewSchema = joi
  .object({
    rating: joi.number().required().min(0).max(5),
    description: joi.string().required(),
  })
  .required();
