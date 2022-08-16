import { Knex } from 'knex';
import TransactionTypes from '../../resources/enums/TransactionTypes';
import Table from '../../resources/enums/Table';

export function seed(knex: Knex): Promise<any> {
  return knex(Table.TRANSACTION_TYPES)
    .del()
    .then(() => {
      return Promise.all([
        knex(Table.TRANSACTION_TYPES).insert([
          {
            name: TransactionTypes.WITHDRAW
          },
          {
            name: TransactionTypes.TOP_UP
          }
        ])
      ]);
    });
}
