import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const registerValidation = [
  // username status
  body('user_name').notEmpty().withMessage('Username Required'),

  // email status
  body('email').notEmpty().withMessage('Email Required'),
  body('email').isEmail().withMessage('Email Wrong'),

  // password status
  body('password').notEmpty().withMessage('Password Required'),
  body('password').isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
  }),
  (req: Request, res: Response, next: NextFunction) => {
    // catch the error if something error from middleware validator
    const errorValidator = validationResult(req);

    // prisma findunique (username validator)

    // if errorValidator not empty will send the response as error
    if (!errorValidator.isEmpty()) {
      return res.status(400).send({ error: errorValidator.array() });
    }
    // if errorValidator empty will next to controller register
    next();
  },
];
