const Joi = require("joi");
const { verifyJwtMiddleware } = require("../controller/user.controller");

const registeroption = {
  validate: {
    payload: Joi.object({
      fullName: Joi.string().min(3).required().messages({
        "string.min": "Name must be at least 3 characters long",
        "any.required": "Name is required",
      }),
      email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
      password: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
      }),
    }),
    failAction: (request, h, error) => {
      return h
        .response({
          statusCode: 400,
          message: error.details[0].message,
        })
        .code(400)
        .takeover();
    },
  },
};

const loginoption = {
  validate: {
    payload: Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
      password: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
      }),
    }),
    failAction: (request, h, error) => {
      return h
        .response({
          statusCode: 400,
          message: error.details[0].message,
        })
        .code(400)
        .takeover();
    },
  },
};

const updateoption = {
  ext: {
    onPreHandler: {
      method: verifyJwtMiddleware, // Correctly define the middleware method
    }, // Apply JWT authorization middleware
  },
  validate: {
    payload: Joi.object({
      name: Joi.string().min(3).required().messages({
        "string.base": '"name" should be a type of string',
        "string.empty": '"name" cannot be an empty field',
        "string.min": '"name" should have at least {#limit} characters',
        "any.required": '"name" is a required field',
      }),
      email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
      phone: Joi.string()
        .pattern(/^[0-9]{10}$/) // Validates 10-digit phone number
        .messages({
          "string.pattern.base":
            '"phone" should be a valid 10-digit phone number',
        }),

      aadhar: Joi.string()
        .length(12) // Aadhar number should be exactly 12 digits
        .pattern(/^[0-9]{12}$/) // Validates 12-digit number
        .messages({
          "string.length": '"aadhar" should have exactly 12 digits',
          "string.pattern.base": '"aadhar" should be a valid 12-digit number',
        }),

      pan: Joi.string()
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/) // Validates PAN number format
        .messages({
          "string.pattern.base": '"pan" should be in the format XXXXX1234X',
        }),

      gender: Joi.string()
        .valid("male", "female", "") // Validates gender field
        .messages({
          "any.only": '"gender" should be one of "Male", "Female", or "Other"',
        }),

      dob: Joi.date()
        .iso() // Validates ISO date format (YYYY-MM-DD)
        .messages({
          "date.base": '"dob" should be a valid date',
        }),

      address: Joi.string().messages({
        "string.base": '"address" should be a type of string',
      }),
    }),
    failAction: (request, h, error) => {
      console.log(error);

      return h
        .response({
          statusCode: 400,
          message: error.details[0].message,
        })
        .code(400)
        .takeover();
    },
  },
};

module.exports = {
  registeroption,
  loginoption,
  updateoption,
};
