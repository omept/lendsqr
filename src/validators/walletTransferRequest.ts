import Joi from 'joi';

export const walletTransferSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    recipientWalletId: Joi.number()
      .min(1)
      .label('Recipient Wallet Id')
      .required(),
    walletId: Joi.number().min(1).label('Wallet Id').required(),
    amount: Joi.number().min(1).label('Amount').required()
  });
