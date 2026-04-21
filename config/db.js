import sql from "mssql"

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    options: {
        encrypt: process.env.NODE_ENV === 'production', // encrypt in prod
        trustServerCertificate: true,
        // instanceName: process.env.DB_INSTANCE, // optional
    },
    pool: {
        max: 50,
        min: 0,
        idleTimeoutMillis: 60000
    },
    requestTimeout: 60000
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        return pool;
    })
    .catch(err => console.log(err))

const getSqlType = (value) => {
    // Helper function to check if a string is a valid date
    const isValidDate = (dateString) => {
        const parsedDate = new Date(dateString);
        return !isNaN(parsedDate.getTime());  // Returns true if it's a valid date
    };

    if (typeof value === 'number' && Number.isInteger(value)) {
        return sql.Int;
    } else if (typeof value === 'number' && !Number.isInteger(value)) {
        return sql.Decimal(18, 2);  // Adjust precision and scale as needed
    } else if (typeof value === 'string') {
        // Check if the string can be parsed into a valid date
        if (isValidDate(value)) {
            return sql.DateTime;  // If it's a valid date string, return DateTime
        }
        return sql.NVarChar;  // Otherwise, treat it as a regular string
    } else if (value instanceof Date) {
        return sql.DateTime;
    } else {
        return sql.NVarChar;  // Default to NVarChar if type is unknown
    }
};

export { sql, poolPromise, getSqlType, config }
// Express$erver@2025