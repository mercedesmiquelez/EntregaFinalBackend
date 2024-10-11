import { body, validationResult } from "express-validator";

export const productDataValidator = [
  body("title")
    .isString()
    .withMessage("Title must be a text")
    .isEmpty()
    .withMessage("Title is ")
    .isLength({ min: 3 })
    .withMessage("Must have at least 3 characters"),
  body("description")
    .isString()
    .withMessage("Description must be a text")
    .isEmpty()
    .withMessage("Must have a description")
    .isLength({ min: 3 })
    .withMessage("Must have at least 3 characters"),
  body("thumbnail").isArray().withMessage("It has to be an array"),
  body("code")
    .isString()
    .withMessage("Title must be a text")
    .isEmpty()
    .withMessage("Title is ")
    .isLength({ min: 3 })
    .withMessage("Must have at least 3 characters"),
  body("stock")
    .isNumeric()
    .withMessage("It must be a number")
    .isLength({min: 1})
    .withMessage("Must have at least 1 character")
    .isEmpty()
    .withMessage("It must have a stock"),
  body("status")
    .isBoolean(),
  body("price")
    .isNumeric()
    .withMessage("It must be a number")
    .isLength({min: 1})
    .withMessage("Must have at least 1 character")
    .isEmpty()
    .withMessage("It must have a price"),
  body("category")
    .isString()
    .withMessage("Category must be a text")
    .isEmpty()
    .withMessage("It must have a category")
    .isLength({ min: 3 })
    .withMessage("Must have at least 3 characters"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formatErrors = errors.array().map( e => {
          return { msg: e.msg, data: e.path }
        } )

        return res.status(400).json({ status: "error", errors: formatErrors });
      }

      next();
    },
];