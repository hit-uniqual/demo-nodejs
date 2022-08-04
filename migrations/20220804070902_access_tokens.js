exports.up = (knex) =>
  knex.schema.createTable('access_tokens', (table) => {
    table.string('id').primary()
    table.integer('userId').unsigned()
    table.boolean('revoked').defaultTo(false)
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.timestamp('expiresAt')
    table.foreign('userId').references('users.id')
  })

exports.down = (knex) => knex.schema.dropTable('access_tokens')