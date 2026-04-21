
import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performShelfLifeExpiryActions = async (req, res) => {
    const { totalentry: limit, pageNo, search = '', action, method } = req.body
    const offSet = (pageNo - 1) * limit;
    // try {
    //     const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeTransaction([
    //         {
    //             query: queries[name] + limitOffset + `${CTEQueries.shelf_life_expiry} 
    //             SELECT 
    //             ${name === 'shelf_life_expiry' ? 'SUM(count)' : 'COUNT(*)'} AS count 
    // 		            FROM (
    //                         SELECT COUNT(*) AS count 
    //                         FROM LabelData 
    //                         ${CTEJoinAndWhereQueries[name].split('ORDER BY')[0]}
    //                     ) AS sl;`,
    //             params: [
    //                 { name: 'search', type: sql.NVarChar, value: '%' + search?.trim() + '%' },
    //                 { name: 'offset', type: sql.Int, value: offSet },
    //                 { name: 'limit', type: sql.Int, value: limit },
    //             ]
    //         }
    //     ])) || {}
    //     const totalPage = Math.ceil(totalRecords / limit);
    //     if (!success) {
    //         return res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    //     }
    //     res.status(201).send({ data, paginate: { totalPage, totalRecords } });

    // } catch (error) {
    //     res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    // }

    try {
        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([
            {
                sp: `ShelfLifeExpiry`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search?.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action }
                ]
            }
        ])) || {}

        if (!success) return res.status(401).send({
            notify: true,
            success,
            message: errorMessages.somethingWentWrong,
            errorMessage: `${error}`,
            action, method
        })
        if (method === 'Fetch') {
            const totalPage = Math.ceil(totalRecords / limit);
            return res.status(201).send({ success, data, paginate: { totalPage, totalRecords }, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


const performInwardShelfLifeExpiryActions = async (req, res) => {
    const { totalentry: limit, pageNo, search = '', action, method } = req.body
    const offSet = (pageNo - 1) * limit;
    // try {
    //     // const name = reportType === 'reel' ? 'inward_shelf_life_expiry' : reportType === 'part' ? 'inward_shelf_life_expiry_partwise' : ''
    //     const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeTransaction([
    //         {
    //             query: queries[name] + limitOffset + `${CTEQueries.inward_shelf_life_expiry} 
    //             SELECT 
    //             ${name === 'inward_shelf_life_expiry' ? 'SUM(count)' : 'COUNT(*)'} AS count 
    // 		            FROM (
    //                         SELECT COUNT(*) AS count 
    //                         FROM LabelData 
    //                         ${CTEJoinAndWhereQueries[name].split('ORDER BY')[0]}
    //                     ) AS sl;`,
    //             params: [
    //                 { name: 'search', type: sql.NVarChar, value: '%' + search?.trim() + '%' },
    //                 { name: 'offset', type: sql.Int, value: offSet },
    //                 { name: 'limit', type: sql.Int, value: limit },
    //             ]
    //         }
    //     ])) || {}
    //     const totalPage = Math.ceil(totalRecords / limit);
    //     if (!success) {
    //         return res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    //     }
    //     res.status(201).send({ data, paginate: { totalPage, totalRecords } });
    // } catch (error) {
    //     res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    // }

    try {
        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([
            {
                sp: `InwardShelfLifeExpiry`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search?.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action }
                ]
            }
        ])) || {}

        if (!success) return res.status(401).send({
            notify: true,
            success,
            message: errorMessages.somethingWentWrong,
            errorMessage: `${error}`,
            action, method
        })
        if (method === 'Fetch') {
            const totalPage = Math.ceil(totalRecords / limit);
            return res.status(201).send({ success, data, paginate: { totalPage, totalRecords }, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}

export { performShelfLifeExpiryActions, performInwardShelfLifeExpiryActions }