import { validationResult } from 'express-validator';

/**
 * Middleware: validate request using express-validator rules.
 * Returns 422 with validation errors if any rules fail.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}
