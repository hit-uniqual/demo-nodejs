exports.up = (knex) =>
  knex.schema.createTable('refresh_tokens', (table) => {
    table.string('id').primary();
    table.string('accessTokenId');
    table.boolean('revoked').defaultTo(false);
    table.timestamp('expiresAt');
    table.foreign('accessTokenId').references('access_tokens.id');
  });

exports.down = (knex) => knex.schema.dropTable('refresh_tokens');