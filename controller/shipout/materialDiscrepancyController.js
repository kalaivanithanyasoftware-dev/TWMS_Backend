import { sql } from "../../config/db.js";
import { executeSP, executeTransaction } from "../../custom/mssqlExecution.js";
import { limitOffset, queries } from "../../custom/queries.js";
import { errorMessages } from "../constant.js";


const performMaterialDiscrepancyActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'MaterialDiscrepancy',
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body
        });
        const { success, error, results } = response

        const [data = []] = results

        if (!success) {
            return res.status(401).send({
                notify: true,
                success,
                message: errorMessages.somethingWentWrong,
                errorMessage: `${error}`,
                action,
                method,
            });
        }

        if (['DiscrepancyAcknowledge'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: true, success, message: 'success', action, method });
        }
        if (['GetReelInfo'].includes(action)) {
            return res.status(201).send({
                notify: false, success,
                data,
                action, method
            });
        }
        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};

const getDiscrepancy = async (req, res) => {
    const { totalentry: limit, pageNo, search = '', vendor } = req.body
    const offSet = (pageNo - 1) * limit;
    const { usertype, id: supplierid } = req.userDetails.user
    try {
        const [data = [], [{ count: totalRecords = 0 } = {}]] = (await executeTransaction([
            {
                query: queries.discrepancy + limitOffset + ` SELECT COUNT(*) count FROM (${queries.discrepancy.split('ORDER BY')[0]}) AS t`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search?.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'supplierid', type: sql.Int, value: usertype === 'Supplier' ? supplierid : vendor || null },
                    { name: 'usertype', type: sql.NVarChar, value: usertype }
                ]
            }
        ])).results || []
        const totalPage = Math.ceil(totalRecords / limit);
        res.status(201).send({ data, paginate: { totalPage, totalRecords } });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}


const getDiscrepancyReels = async (req, res) => {
    const { planno } = req.body
    try {
        const { success, error, results: [data = []] } = (await executeTransaction([
            {
                query: `
    SELECT 
	ins.id,
	'AUDITLBL' as Type,
	ins.planno,
	ins.tpn,
	ins.box_label_id,
	'LBL'+ins.grn_label_id as reel_id,
	ins.quantity,
	ins.ack_qty,
	CONVERT(VARCHAR(19),ins.rejected_date,29) as rejected_date, 
	CASE 
        WHEN ins.status = 1 THEN 'Received'
        WHEN ins.status = 2 THEN 'Shortage'
        WHEN ins.status = 3 THEN 'Excess'
        WHEN ins.status = 4 THEN 'Damage'
        WHEN ins.status = 5 THEN 'Others'
        ELSE 'Unknown' 
	END AS status,
	ins.ack_remarks,
	ISNULL(ins.ack_attachments,'') ack_attachments,
	ins.ack_reject_qty
FROM ops_inventory_wall_to_wall_new_splitup AS ins
INNER JOIN ms_location AS loc ON loc.id=ins.locationid 
WHERE ins.planno=@planno AND ins.is_out=13 AND ins.del_status=0 AND ISNULL(ins.status,0) NOT IN (0,1)
                
UNION

SELECT 
	ins.id,
	'GRNLBL' AS Type,
	ins.planno,
	ins.tpn,
	ins.box_label_id,
	'GRNLBL'+CONVERT(VARCHAR,COALESCE(ins.grn_label_id,ins.grn_label_split_id)) AS reel_id,
	ins.quantity,
	ins.ack_qty,
	CONVERT(VARCHAR(19),ins.rejected_date,29) as rejected_date,
	CASE 
        WHEN ins.status = 1 THEN 'Received'
        WHEN ins.status = 2 THEN 'Shortage'
        WHEN ins.status = 3 THEN 'Excess'
        WHEN ins.status = 4 THEN 'Damage'
        WHEN ins.status = 5 THEN 'Others'
        ELSE 'Unknown' 
	END AS status,
	ins.ack_remarks,
	ISNULL(ins.ack_attachments,'') ack_attachments,
	ins.ack_reject_qty
	FROM ops_inventory_new_splitup AS ins 
	INNER JOIN ms_location AS loc ON loc.id=ins.locationid 
	WHERE ins.planno=@planno AND ins.is_out=13 AND ins.del_status=0 AND ISNULL(ins.status,0) NOT IN (0,1) 
	ORDER BY id DESC`,
                params: [
                    { name: 'planno', type: sql.NVarChar, value: planno }
                ]
            }
        ])) || {}
        if (!success) return res.status(401).send({ data: errorMessages.somethingWentWrong, error: `${error}` })
        res.status(201).send({ data });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}

const updateMaterialDiscrepancy = async (req, res) => {
    const { reelInfo, planno, document_qty, document_no, document_remarks } = req.body
    try {
        const queries = []
        for (const obj of reelInfo) {
            const labelId = obj.reel_id.toUpperCase()
            let table = labelId.startsWith('GRNLBL') ? `ops_inventory_new_splitup` : labelId.startsWith('LBL') ? `ops_inventory_wall_to_wall_new_splitup` : ``
            queries.push({
                query: `UPDATE ${table} SET status=0 WHERE COALESCE(CAST(grn_label_id AS NVARCHAR), grn_label_split_id)=@grn_label_id; `,
                params: [
                    { name: 'grn_label_id', type: sql.NVarChar, value: labelId.replace('GRNLBL', '').replace('LBL', '') }
                ]
            })
        }

        queries.push({
            query: `UPDATE planning_outward SET status=17,document_qty=@document_qty,document_no=@document_no,document_remarks=@document_remarks WHERE planno=@planno;`,
            params: [
                { name: 'document_qty', type: sql.Int, value: document_qty },
                { name: 'planno', type: sql.NVarChar, value: planno },
                { name: 'document_no', type: sql.NVarChar, value: document_no },
                { name: 'document_remarks', type: sql.NVarChar, value: document_remarks }
            ]
        })
        const { success, error } = await executeTransaction(queries);
        if (!success) return res.status(401).send({ data: 'failed', error })
        res.status(201).send({ data: 'success' });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}

export {
    performMaterialDiscrepancyActions,
    getDiscrepancy,
    getDiscrepancyReels,
    updateMaterialDiscrepancy
}