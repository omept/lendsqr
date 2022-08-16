import { Knex } from 'knex';

import * as bcrypt from '../../utils/bcrypt';
import Table from '../../resources/enums/Table';

export function seed(knex: Knex): Promise<any> {
  return knex(Table.USERS).then(async () => {
    return Promise.all([
      knex(Table.USERS).insert([
        {
          name: 'George Ndubuisi Onwuasoanya',
          email: 'georgetheprogrammer@gmail.com',
          password: await bcrypt.hash('secret')
        }
      ])
    ]);
  });
}
