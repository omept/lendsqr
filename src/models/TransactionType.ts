import { Model } from 'objection';

import Table from '../resources/enums/Table';

class TransactionType extends Model {
  id!: number;
  name!: string;
  createdAt!: string;
  updatedAt!: string;

  static get tableName(): string {
    return Table.TRANSACTION_TYPES;
  }

  $beforeInsert() {
    this.createdAt = new Date().toJSON().slice(0, 19).replace('T', ' ');
    this.updatedAt = new Date().toJSON().slice(0, 19).replace('T', ' ');
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toJSON().slice(0, 19).replace('T', ' ');
  }
}

export default TransactionType;
