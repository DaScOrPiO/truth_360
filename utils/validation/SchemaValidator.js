const joiWithSanitizeHtml = require("joi");

const sanitizeHtml = require("sanitize-html");

const sanitizeHtmlExtension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.sanitizeHtml":
      "{{#label}} must not contain any harmful HTML or script code.",
  },
  rules: {
    sanitizeHtml: {
      validate(value, helpers) {
        const sanitizedValue = sanitizeHtml(value);
        if (sanitizedValue !== value) {
          return helpers.error("string.sanitizeHtml", { value });
        }
        return sanitizedValue;
      },
    },
  },
});

const joi = joiWithSanitizeHtml.extend(sanitizeHtmlExtension);

module.exports.campgroundSchema = joi
  .object({
    title: joi.string().sanitizeHtml().required(),
    price: joi.number().required().min(0),
    description: joi.string().sanitizeHtml().required(),
    location: joi.string().sanitizeHtml().required(),
    // image: joi.string().required(),
  })
  .required();

module.exports.reviewSchema = joi
  .object({
    rating: joi.number().required().min(0).max(5),
    description: joi.string().required(),
  })
  .required();
