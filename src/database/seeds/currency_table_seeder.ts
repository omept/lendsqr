import { Knex } from 'knex';
import Table from '../../resources/enums/Table';

export function seed(knex: Knex): Promise<any> {
  return knex(Table.CURRENCIES)
    .del()
    .then(() => {
      return Promise.all([
        knex(Table.CURRENCIES).insert([
          {
            name: 'Naira',
            code: 'NGN'
          }
        ])
      ]);
    });
}
