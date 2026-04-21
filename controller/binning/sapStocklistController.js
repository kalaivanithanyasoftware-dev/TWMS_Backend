import { sql, poolPromise } from "../../config/db.js";
import { executeTransaction } from "../../custom/mssqlExecution.js";
import { limitOffset, queries } from "../../custom/queries.js";
import xlsx from "node-xlsx"

const getSapStockLists = async (req, res) => {
    const { totalentry: limit, pageNo, search } = req.body
    const offSet = (pageNo - 1) * limit;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('search', sql.NVarChar, '%' + search + '%')
            .input('offset', sql.Int, offSet)
            .input('limit', sql.Int, limit)
            .query(queries.ms_sap_stocklist + limitOffset + queries.ms_sap_stocklist);
        let totalRecords = result.rowsAffected[1]
        let totalPage = Math.ceil(result.rowsAffected[1] / limit);
        res.status(201).send({ data: result.recordset, paginate: { totalPage: totalPage, totalRecords: totalRecords } });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}



const addSapStockList = async (req, res) => {
    const { id: userid } = req.userDetails.user
    try {
        const { plant, tpn, quantity, value } = req.body
        const pool = await poolPromise;
        await pool.request()
            .input('plant', sql.NVarChar, `${plant}`)
            .input('tpn', sql.NVarChar, tpn)
            .input('quantity', sql.NVarChar, quantity)
            .input('value', sql.NVarChar, value)
            .input('createdby', sql.Int, userid)
            .query('INSERT INTO ms_sap_stocklist (plant,tpn,quantity,value,createdby) VALUES (@plant,@tpn,@quantity,@value,@createdby)');

        res.status(201).send({ data: 'success' })
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}



const uploadSapStockList = async (req, res) => {
    const { id: userid } = req.userDetails.user
    try {
        const exceFile = req.files.excelfile
        const workSheetsFromBuffer = xlsx.parse(exceFile.data);

        workSheetsFromBuffer[0].data.shift();
        const pool = await poolPromise;
        for (const [i, arr] of workSheetsFromBuffer[0].data.entries()) {
            await pool.request()
                .input('plant', sql.NVarChar, `${arr[0]}`)
                .input('tpn', sql.NVarChar, arr[1])
                .input('quantity', sql.NVarChar, `${arr[2]}`)
                .input('value', sql.Decimal, `${arr[3]}`)
                .input('createdby', sql.Int, userid)
                .query('INSERT INTO ms_sap_stocklist (plant, tpn, quantity, value, createdby) VALUES (@plant, @tpn, @quantity, @value, @createdby)');
        }


        res.status(201).send({ data: 'success' })
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}

const updateSapStockList = async (req, res) => {
    const { id: userid } = req.userDetails.user
    try {
        const { plant, tpn, quantity, value, id } = req.body
        const pool = await poolPromise;
        await pool.request()
            .input('plant', sql.NVarChar, plant)
            .input('tpn', sql.NVarChar, tpn)
            .input('quantity', sql.NVarChar, quantity)
            .input('value', sql.NVarChar, value)
            .input('id', sql.Int, id)
            .input('updatedby', sql.Int, userid)
            .query('UPDATE ms_sap_stocklist SET plant=@plant,tpn=@tpn,quantity=@quantity,value=@value,updatedby=@updatedby,updateddate=GETDATE() WHERE id=@id');
        res.status(201).send({ data: 'success' })
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}


const updateSapStockListStatus = async (req, res) => {
    const { id: userid } = req.userDetails.user
    try {
        const { status, id } = req.body
        const pool = await poolPromise;
        await pool.request()
            .input('status', sql.Int, status)
            .input('id', sql.Int, id)
            .input('updatedby', sql.Int, userid)
            .query('UPDATE ms_sap_stocklist SET status=@status,updatedby=@updatedby,updateddate=GETDATE() WHERE id=@id');
        res.status(201).send({ data: 'success' })
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}



const deleteSapStockList = async (req, res) => {
    try {
        const { id: userid } = req.userDetails.user
        const { id } = req.body
        const { success, error } = (await executeTransaction([{
            query: `UPDATE ms_sap_stocklist SET del_status=1,deletedby=@deletedby,deleteddate=GETDATE() WHERE id=@id`,
            params: [
                { name: 'id', type: sql.Int, value: id },
                { name: 'deletedby', type: sql.Int, value: userid }
            ]
        }])) || {}
        if (!success) return res.status(401).send({ data: 'failed', error: `${error}` })
        res.status(201).send({ data: 'success' })
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}


export { getSapStockLists, addSapStockList, uploadSapStockList, updateSapStockList, updateSapStockListStatus, deleteSapStockList }