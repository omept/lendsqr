import { Model } from 'objection';

import Table from '../resources/enums/Table';
import TransactionType from './TransactionType';
import User from './User';
import Wallet from './Wallet';

class TransactionLogs extends Model {
  id!: number;
  userId!: number;
  amount!: number;
  transactionTypeId!: number;
  fromWalletId!: number;
  toWalletId!: number;
  createdAt!: string;
  updatedAt!: string;
  user?: User;
  fromWallet?: Wallet;
  toWallet?: Wallet;
  transactionType?: TransactionType;

  static get tableName(): string {
    return Table.TRANSACTION_LOGS;
  }

  static relationMappings = {
    tansactionType: {
      relation: Model.BelongsToOneRelation,
      modelClass: TransactionType,
      join: {
        from: 'transaction_logs.transaction_type_id',
        to: 'transaction_types.id'
      }
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'transaction_logs.user_id',
        to: 'users.id'
      }
    },
    senderWallet: {
      relation: Model.BelongsToOneRelation,
      modelClass: Wallet,
      join: {
        from: 'transaction_logs.from_wallet_id',
        to: 'wallets.id'
      }
    },
    recipientWallet: {
      relation: Model.BelongsToOneRelation,
      modelClass: Wallet,
      join: {
        from: 'transaction_logs.to_wallet_id',
        to: 'wallets.id'
      }
    }
  };

  $beforeInsert() {
    this.createdAt = new Date().toJSON().slice(0, 19).replace('T', ' ');
    this.updatedAt = new Date().toJSON().slice(0, 19).replace('T', ' ');
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toJSON().slice(0, 19).replace('T', ' ');
  }
}

export default TransactionLogs;
