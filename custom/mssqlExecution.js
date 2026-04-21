import { config, sql } from "../config/db.js";
import fs from "fs"
// const executeTransaction = async (queries) => {
//     let pool;
//     let transaction;
//     const results = []; // Store result sets for SELECT queries 
//     try {
//         pool = await new sql.ConnectionPool(config).connect();
//         transaction = new sql.Transaction(pool);
//         await transaction.begin();

//         for (const queryObj of queries) {
//             const { query, params } = queryObj;
//             const request = transaction.request();

//             // Bind parameters dynamically
//             if (params) {
//                 for (const param of params) {
//                     request.input(param.name, param.type, param.value);
//                 }
//             }

//             const result = await request.query(query);
//             results.push(...result.recordsets || []);

//         }

//         await transaction.commit();
//         return { success: true, results };
//     } catch (error) {
//         console.log(error);
//         fs.appendFileSync('TransactionErrors.txt', `${new Date()} : ${JSON.stringify(queries)} \n\n${JSON.stringify(error)}`)
//         if (transaction) {
//             try {
//                 await transaction.rollback();
//             } catch (rollbackError) {
//                 console.error('Rollback failed:', rollbackError);
//             }
//         }
//         return { success: false, results, error: error.message };
//     } finally {
//         if (pool) {
//             await pool.close();
//         }
//     }
// } 

const executeTransaction = async (queries, maxRetries = 3) => {
    let pool;
    let transaction;
    const results = []; // Store result sets for SELECT queries 
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            pool = await new sql.ConnectionPool(config).connect();
            transaction = new sql.Transaction(pool);
            await transaction.begin();

            for (const queryObj of queries) {
                const { query, params } = queryObj;
                const request = transaction.request();

                // Bind parameters dynamically
                if (params) {
                    for (const param of params) {
                        request.input(param.name, param.type, param.value);
                    }
                }

                const result = await request.query(query);
                results.push(...result.recordsets || []);
            }

            await transaction.commit();
            return { success: true, results };
        } catch (error) {
            console.log(error);

            if (error.number === 1205) {
                // Deadlock detected, retry the transaction
                attempt++;
                console.log(`Deadlock detected. Retrying... Attempt ${attempt}`);
                if (attempt >= maxRetries) {
                    fs.appendFileSync('TransactionErrors.txt', `${new Date()} : ${JSON.stringify(queries)} \n\n${JSON.stringify(error)}`);
                    return { success: false, error: "Deadlock occurred after retries" };
                }
                await new Promise(r => setTimeout(r, 1000)); // Wait before retrying
            } else {
                // Any other error, rollback and propagate
                if (transaction)
                    try {
                        await transaction.rollback();
                    } catch (rollbackError) {
                        console.error('Rollback failed:', rollbackError);
                    }
                fs.appendFileSync('TransactionErrors.txt', `${new Date()} : ${JSON.stringify(queries)} \n\n${JSON.stringify(error)}\n\n`);
                return { success: false, error: error.message };
            }
        } finally {
            if (pool) {
                await pool.close();
            }
        }
    }
};

const getSPParameters = async (spName, pool) => {
    const result = await pool.request()
        .input('spName', sql.NVarChar, spName)
        .query(`
            SELECT p.name
            FROM sys.parameters p
            INNER JOIN sys.objects o ON p.object_id = o.object_id
            WHERE o.type = 'P' AND o.name = @spName
        `);
    return result.recordset.map(row => row.name.replace('@', '').toLowerCase());
};
const getParamValue = (input) => {
    if (input === undefined || input === null || input === '') {
        return null;
    }

    if (typeof input === 'object') {
        try {
            return JSON.stringify(input);
        } catch (err) {
            console.error("Failed to stringify input:", err);
            return null;
        }
    }
    return input;
};

const executeSP = async (queries) => {
    const { spName, userDetails, body, headers } = !Array.isArray(queries) ? queries : {}; // Extract spName, userDetails, and body from queries 

    let pool;
    const results = []; // Store result sets for SELECT queries
    const output = {}; // Store output parameters
    try {
        pool = await new sql.ConnectionPool(config).connect();
        if (spName && userDetails && body) {
            const request = pool.request();
            request.input('body', sql.NVarChar, JSON.stringify(body)); // Bind the body parameter if provided
            request.input('userDetails', sql.NVarChar, JSON.stringify(userDetails.user)); // Bind the user parameter if provided

            request.output('errorMessage', sql.NVarChar)

            const result = await request.execute(spName);  // Call the stored procedure   

            output.errorMessage = result.output.errorMessage;
            results.push(...result.recordsets || []);
        } else {
            for (const queryObj of queries) {
                const { sp, params, queryType } = queryObj; // Dynamic stored procedure name and parameters
                const request = pool.request(); // No need for a transaction here

                const validParams = await getSPParameters(sp, pool);
                // Bind parameters dynamically
                if (params) {
                    const filteredParams = queryType === 'Export' ? params.filter(obj => obj.enable) : params;

                    for (const param of filteredParams) {
                        if (validParams.includes(param.name.toLowerCase())) {
                            request.input(param.name, param.type, getParamValue(param.value));

                        }
                    }
                }

                request.output('errorMessage', sql.NVarChar)
                const result = await request.execute(sp);  // Call the stored procedure     

                output.errorMessage = result.output.errorMessage;
                results.push(...result.recordsets || []);
            }
        }


        if (output.errorMessage) {
            return { success: true, results, error: output.errorMessage };
        }
        return { success: true, results };
    } catch (error) {
        console.log(error);
        fs.appendFileSync('SPErrors.txt', `${new Date()} : ${JSON.stringify(queries)} \n\n${JSON.stringify(error)}\n\n`);
        return { success: false, results, error: error.message };
    } finally {
        if (pool) {
            await pool.close(); // Always close the pool when done
        }
    }
};

const executeStreamSP = async ({ sp, params = [], onRow }) => {
    const pool = await new sql.ConnectionPool(config).connect();
    const request = pool.request();
    request.stream = true;

    // Add valid params only
    const validParams = await getSPParameters(sp, pool);
    for (const param of params.filter(p => p.enable)) {
        if (validParams.includes(param.name.toLowerCase())) {
            request.input(param.name, param.type, getParamValue(param.value));
        }
    }

    return new Promise((resolve, reject) => {
        request.on('row', onRow);

        request.on('error', async (err) => {
            await pool.close();
            reject(err);
        });

        request.on('done', async () => {
            await pool.close();
            resolve();
        });

        request.execute(sp);
    });
};


export { executeTransaction, executeSP, executeStreamSP }