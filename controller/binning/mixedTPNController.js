import { sql, poolPromise } from "../../config/db.js";
import { executeTransaction } from "../../custom/mssqlExecution.js";
import { limitOffset, queries } from "../../custom/queries.js";

const getMixedTPNs = async (req, res) => {
    const { totalentry: limit, pageNo, search } = req.body
    const offSet = (pageNo - 1) * limit;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('search', sql.NVarChar, '%' + search + '%')
            .input('offset', sql.Int, offSet)
            .input('limit', sql.Int, limit)
            .query(queries.mixed_tpn + limitOffset + ' SELECT COUNT(*) totalRecords FROM ' + queries.mixed_tpn.split('FROM')[1].split('ORDER')[0]);

        let { totalRecords } = result.recordsets[1][0]
        let totalPage = Math.ceil(totalRecords / limit);
        res.status(201).send({ data: result.recordset, paginate: { totalPage: totalPage, totalRecords: totalRecords } });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}

const checkValidMpnTpn = async (req, res) => {
    try {
        const { label_id, locationid } = req.body
        const pool = await poolPromise;

        const getMixedTpns = await pool.request()
            .input('locationid', sql.Int, locationid)
            .query(`SELECT location FROM ms_location WHERE del_status=0 AND status=1 AND mixedtpn=1 AND id=@locationid`)
        if (!getMixedTpns.recordset.length) {
            return res.status(401).send({ data: 'This Location is Not a Mixed TPN Location!' })
        }

        const getResult = await pool.request()
            .input('label_id', sql.NVarChar, label_id.replace('GRNLBL', '').replace('LBL', ''))
            .query('SELECT COUNT(id) count FROM cyclecount_wall_to_wall_label_splitup WHERE label_id=@label_id');
        if (getResult.recordset[0]?.count <= 0) {
            return res.status(401).send({ data: 'Scan Valid Label !' })
        }
        const getGRNLabelExists = await pool.request()
            .input('label_id', sql.NVarChar, label_id.replace('GRNLBL', '').replace('LBL', ''))
            .query(`SELECT COUNT(label_id) count FROM mixed_tpn_new WHERE label_id=@label_id`)

        if (getGRNLabelExists.recordset[0]?.count > 0) {
            return res.status(401).send({ data: 'Already Scanned This Reel !' })
        }

        res.status(201).send({ data: 'success' })
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}

const addMixedTPN = async (req, res) => {
    const { id: userid } = req.userDetails.user
    try {
        const { label_id, mpn, tpn, locationid, boxno, quantity } = req.body
        const pool = await poolPromise;

        const getMixedTpns = await pool.request()
            .input('locationid', sql.Int, locationid)
            .query(`SELECT location FROM ms_location WHERE del_status=0 AND status=1 AND mixedtpn=1 AND id=@locationid`)
        if (!getMixedTpns.recordset.length) {
            return res.status(401).send({ data: 'This Location is Not a Mixed TPN Location!' })
        }
        const getResult = await pool.request()
            .input('label_id', sql.NVarChar, label_id.replace('GRNLBL', '').replace('LBL', ''))
            .query('SELECT COUNT(id) count FROM cyclecount_wall_to_wall_label_splitup WHERE label_id=@label_id');
        if (getResult.recordset[0]?.count <= 0) {
            return res.status(401).send({ data: 'Scan Valid Label !' })
        }

        const getGRNLabelExists = await pool.request()
            .input('label_id', sql.NVarChar, label_id.replace('GRNLBL', '').replace('LBL', ''))
            .query(`SELECT COUNT(label_id) count FROM mixed_tpn_new WHERE label_id=@label_id AND del_status=0`)

        if (getGRNLabelExists.recordset[0]?.count > 0) {
            return res.status(401).send({ data: 'Already Scanned This Reel !' })
        }
        await pool.request()
            .input('label_id', sql.NVarChar, label_id.replace('GRNLBL', '').replace('LBL', ''))
            .input('mpn', sql.NVarChar, mpn)
            .input('tpn', sql.NVarChar, tpn)
            .input('locationid', sql.Int, locationid)
            .input('boxno', sql.NVarChar, boxno)
            .input('quantity', sql.Int, quantity)
            .input('createdby', sql.Int, userid)
            .query('INSERT INTO mixed_tpn_new (label_id,mpn,tpn,locationid,boxno,quantity,createdby) VALUES (@label_id,@mpn,@tpn,@locationid,@boxno,@quantity,@createdby)');
        res.status(201).send({ data: 'success' })
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}


const deleteMixedTPN = async (req, res) => {
    try {
        const { id: userid } = req.userDetails.user
        const { id } = req.body
        const { success, error } = (await executeTransaction([{
            query: `UPDATE mixed_tpn_new SET del_status=1,deletedby=@deletedby,deleteddate=GETDATE() WHERE id=@id`,
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

export { getMixedTPNs, checkValidMpnTpn, addMixedTPN, deleteMixedTPN }