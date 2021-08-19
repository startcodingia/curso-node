import dotenv from 'dotenv';

dotenv.config()

export const environment = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_SSL: process.env.DB_SSL === 'true' ? true : false, 
    JWT_SECRET: process.env.JWT_SECRET || 'Default',

}