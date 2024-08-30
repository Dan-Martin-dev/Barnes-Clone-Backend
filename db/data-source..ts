import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [],              // Define your entities here
  migrations: [],            // Define your migrations here
  synchronize: true,         // Set to true in development only
  logging: false,            // Set to true to enable SQL logging
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
