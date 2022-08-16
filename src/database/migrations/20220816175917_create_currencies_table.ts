import { Knex } from 'knex';
import Table from '../../resources/enums/Table';

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(Table.CURRENCIES, (table) => {
    table.increments('id').primary();
    table.string('name', 30);
    table.string('code', 30);
    table.timestamps(true, true);
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(Table.CURRENCIES);
}
