import Joi from 'joi';

export const signUpSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().max(100).label('Name').required(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .label('Email')
      .required(),
    password: Joi.string().min(6).max(100).label('Password').required()
  });
