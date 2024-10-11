import { body, validationResult } from "express-validator";

export const userLoginValidator = [
  body("email")
  .isEmail().withMessage("It must be a valid email")
  .notEmpty().withMessage("It must have an email"),
  body("password")
  .notEmpty().withMessage("It must have a password"),
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