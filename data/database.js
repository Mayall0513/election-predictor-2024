import mysql from 'mysql2/promise';

const databasePool = new mysql.createPool(
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
);

export default databasePool;