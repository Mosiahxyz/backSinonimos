//login na database

export const sqlConfig = {

    user: 'sa',
    password: 'sa',
    database: 'Projeto_sinonimos',
    server: 'localhost',// meu ip
    port: 1433,


options: {

        enableArithAbort: true,
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs

},


connectionTimeout: 5000, 
pool: {

        max: 10,
        min: 0,
        idleTimeoutMillis: 30000

},

}