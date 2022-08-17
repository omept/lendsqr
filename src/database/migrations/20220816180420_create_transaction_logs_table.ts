import { Knex } from 'knex';
import Table from '../../resources/enums/Table';

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(Table.TRANSACTION_LOGS, (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(Table.USERS)
      .onDelete('NO ACTION')
      .onUpdate('CASCADE');
    table
      .integer('from_wallet_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(Table.WALLETS)
      .onDelete('NO ACTION')
      .onUpdate('CASCADE');
    table
      .integer('to_wallet_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(Table.WALLETS)
      .onDelete('NO ACTION')
      .onUpdate('CASCADE');
    table
      .integer('transaction_type_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(Table.TRANSACTION_TYPES)
      .onDelete('NO ACTION')
      .onUpdate('CASCADE');
    table.timestamps(false, true);
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.dropTable(Table.TRANSACTION_LOGS);
}
