exports.up = (knex) => knex.schema.table('users', (table) => {
    table.string('profilePicture').nullable().after('id')
})

exports.down = (knex) => knex.schema.table('users', (table) => {
    table.dropColumn('profilePicture')
})