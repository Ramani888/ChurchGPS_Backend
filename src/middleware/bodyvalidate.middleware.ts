import { Request, Response, NextFunction } from 'express';
import Validator from 'validatorjs';
import { StatusCodes } from 'http-status-codes';

enum RouteSource {
  Body,
  Query,
  Params
}

interface ValidationRules {
  [key: string]: string;
}

// Middleware function to validate request body / query / params
export const validateBody = (rules: ValidationRules, source?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if ((!req.body || Object.keys(req.body).length === 0) && !source) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: ['Request body is missing'] });
    }

    let body;
    if (source === RouteSource?.Params) {
      body = req?.params;
    } else if (source === RouteSource?.Query) {
      body = req?.query;
    } else {
      body = req?.body;
    }

    const validator = new Validator(body, rules);

    if (validator.fails()) {
      const errors = validator.errors.all();
      return res.status(StatusCodes.BAD_REQUEST).json({ errors });
    }

    next();
  };
};

// Example rules you can reuse in routes
export const extendedRules: ValidationRules = {
  name: 'required|string',
  isPrivate: 'required|boolean',
  color: 'required|string',
  cardTypeId: 'required|string',
  age: 'numeric|min:0|max:150',
  email: 'required|email',
  // ✅ date fields check only for valid date
  dateOfBirth: 'required|date',
  birthDate: 'required|date'
};
