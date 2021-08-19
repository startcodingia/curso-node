import { startServer } from './sever';
import { connect } from './config/typeorm';

async function main() {
    connect()
    const port: number = Number(process.env.PORT) || 4000;
    const app = await startServer();
    app.listen(port);
    console.log("App running on port", port);
}

main();