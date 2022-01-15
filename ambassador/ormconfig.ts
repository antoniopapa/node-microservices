export = {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": parseInt(process.env.PORT),
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entity/*.ts"
    ]
}
