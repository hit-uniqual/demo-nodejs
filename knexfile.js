require('dotenv').config()

module.exports = {
    client: process.env.DB_CONNECTION || 'mysql',
    port: +process.env.DB_PORT || 3306,
    version: '8.0',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'node',
    },
    migrations: {
        directory: `${__dirname}/migrations`,
    },
    seeds: {
        directory: `${__dirname}/seeds`,
    },
    pool: {
        min: 2,
        max: 10,
    }
}