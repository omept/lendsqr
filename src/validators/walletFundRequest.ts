import Joi from 'joi';

export const walletFundSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    walletId: Joi.number().min(1).label('Wallet Id').required(),
    amount: Joi.number().min(1).label('Amount').required()
  });
