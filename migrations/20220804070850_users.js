exports.up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.increments('id').unsigned().primary()
    table.string('firstName').nullable()
    table.string('lastName').nullable()
    table.string('email')
    table.string('password')
    table.integer('passwordVerificationCode')
    table.timestamp('passwordVerificationExpiryTime')
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').nullable()
    table.unique('email')
  })

exports.down = (knex) => knex.schema.dropTable('users')