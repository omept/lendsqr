import { Knex } from 'knex';
import Table from '../../resources/enums/Table';

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(Table.TRANSACTION_TYPES, (table) => {
    table.increments('id').primary();
    table.string('name', 30);
    table.timestamps(false, true);
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(Table.TRANSACTION_TYPES);
}
