import { Knex } from 'knex';
import Table from '../../resources/enums/Table';

export function up(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.createTable(Table.WALLETS, (table) => {
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
      .integer('currency_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(Table.CURRENCIES)
      .onDelete('NO ACTION')
      .onUpdate('CASCADE');
    table.bigInteger('balance');
    table.unique(['user_id', 'currency_id'], {
      indexName: 'unqidx_user_wallet_currency'
    });
    table.timestamps(false, true);
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  knex.schema.table(Table.WALLETS, (table) =>
    table.dropUnique(['user_id', 'currency_id'], 'unqidx_user_wallet_currency')
  );
  return knex.schema.dropTable(Table.WALLETS);
}
