import { Model } from 'objection';

import Table from '../resources/enums/Table';

class Currency extends Model {
  id!: number;
  name!: string;
  code!: string;
  createdAt!: string;
  updatedAt!: string;

  static get tableName(): string {
    return Table.CURRENCIES;
  }

  $beforeInsert() {
    this.createdAt = new Date().toJSON().slice(0, 19).replace('T', ' ');
    this.updatedAt = new Date().toJSON().slice(0, 19).replace('T', ' ');
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toJSON().slice(0, 19).replace('T', ' ');
  }
}

export default Currency;
