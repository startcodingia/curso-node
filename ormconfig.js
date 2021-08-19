module.exports = [
  {
    name: 'development',
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    synchronize: true,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migrations/*.ts']
  },
  {
    name: 'production',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
    migrations: ['dist/migrations/*.js'],
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
];