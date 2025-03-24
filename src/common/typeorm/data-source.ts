import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './src/common/database/database_orm.sqlite',
  migrations: [__dirname + '/migrations/*.ts'],
});
