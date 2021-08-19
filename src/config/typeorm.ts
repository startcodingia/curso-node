import { createConnection } from 'typeorm';
import path from 'path';

import { environment } from './environment';

export async function connect() {
    if (process.env.NODE_ENV === 'production') {
        return await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [path.join(__dirname, '/../**/**.entity{.ts,.js}')],
            synchronize: true,
            extra: {
                ssl: {
                    rejectUnauthorized: false
                }
            }
        })
    } else {
        return await createConnection({
            type: 'postgres',
            port: Number(environment.DB_PORT),
            username: environment.DB_USERNAME,
            password: environment.DB_PASSWORD,
            database: environment.DB_DATABASE,
            entities: [path.join(__dirname, '/../**/**.entity{.ts,.js}')],
            synchronize: true,
            extra: {
                ssl: {
                    rejectUnauthorized: false
                }
            }
        })
    }

    console.log("Database running");
}