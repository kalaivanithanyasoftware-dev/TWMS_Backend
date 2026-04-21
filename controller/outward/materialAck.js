import { sendMail } from "../../config/auth.js";
import { sql, poolPromise } from "../../config/db.js";
import { executeTransaction } from "../../custom/mssqlExecution.js";
import { limitOffset, queries } from "../../custom/queries.js";

const getMaterialAck = async (req, res) => {
    const { totalentry: limit, pageNo, search = '', status, supplierid } = req.body
    const offSet = (pageNo - 1) * limit;
    const { usertype, id: supplier_id } = req.userDetails.user
    try {
        const [data = [], [{ count: totalRecords = 0 } = {}]] = (await executeTransaction([
            {
                query: queries.material_ack + limitOffset + ` SELECT COUNT(*) count FROM (${queries.material_ack.split('ORDER BY')[0]}) AS t`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search?.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'status', type: sql.NVarChar, value: status },
                    { name: 'supplierid', type: sql.Int, value: usertype === 'Supplier' ? supplier_id : supplierid || null },
                    { name: 'usertype', type: sql.NVarChar, value: usertype },
                    { name: 'limit', type: sql.Int, value: limit }
                ]
            }
        ])).results || []
        const totalPage = Math.ceil(totalRecords / limit);
        res.status(201).send({ data, paginate: { totalPage, totalRecords } });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}

const getMaterialAckReport = async (req, res) => {
    const { totalentry: limit, pageNo, search = '', status, vendor } = req.body

    const offSet = (pageNo - 1) * limit;
    const { usertype, id: supplierid } = req.userDetails.user
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('search', sql.NVarChar, '%' + search + '%')
            .input('status', sql.NVarChar, status)
            .input('supplierid', sql.Int, usertype === 'Supplier' ? supplierid : vendor || null)
            .input('usertype', sql.NVarChar, usertype)
            .input('offset', sql.Int, offSet)
            .input('limit', sql.Int, limit)
            .query(queries.material_ack_report + limitOffset + queries.material_ack_report);
        let totalRecords = result.rowsAffected[1]
        let totalPage = Math.ceil(result.rowsAffected[1] / limit);
        res.status(201).send({ data: result.recordset, paginate: { totalPage: totalPage, totalRecords: totalRecords } });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}
const getMaterialAckDOReel = async (req, res) => {
    const { planno } = req.body
    try {
        const [box_details = [], [do_details = {}]] = (await executeTransaction([
            {
                query: `WITH CombinedData AS (
                    SELECT  
                        ins.box_label_id, 
                        ins.quantity, 
                        u.firstname + ' ' + u.lastname AS boxby_Name, 
                        u.empcode AS boxby_code, 
                        u.profile AS boxby_profile, 
                        r.rolename AS boxby_role, 
                        ins.box_date,
                        1 AS reel_count
                    FROM 
                        ops_inventory_wall_to_wall_new_splitup AS ins
                    INNER JOIN 
                        ms_location AS loc ON loc.id = ins.locationid
                    INNER JOIN 
                        ms_user AS u ON u.id = ins.box_by
                    INNER JOIN 
                        ms_role AS r ON r.id = u.roleid
                    WHERE 
                        ins.planno = @planno AND ISNULL(ins.status,0)=0 AND ins.box_label_id IS NOT NULL AND ins.del_status = 0 AND ISNULL(ins.fqa_status,1)=1

                    UNION ALL

                    SELECT  
                        ins.box_label_id, 
                        ins.quantity, 
                        u.firstname + ' ' + u.lastname AS boxby_Name, 
                        u.empcode AS boxby_code, 
                        u.profile AS boxby_profile, 
                        r.rolename AS boxby_role, 
                        ins.box_date,
                        1 AS reel_count
                    FROM 
                        ops_inventory_new_splitup AS ins 
                    INNER JOIN 
                        ms_location AS loc ON loc.id = ins.locationid
                    INNER JOIN 
                        ms_user AS u ON u.id = ins.box_by
                    INNER JOIN 
                        ms_role AS r ON r.id = u.roleid
                    WHERE 
                        ins.planno = @planno AND ISNULL(ins.status,0)=0 AND ins.box_label_id IS NOT NULL AND ins.del_status = 0 AND ISNULL(ins.fqa_status,1)=1
                )
                SELECT  
                    box_label_id,
                    SUM(quantity) AS quantity,
                    MAX(boxby_Name) AS boxby_Name,
                    MAX(boxby_code) AS boxby_code,
                    MAX(boxby_profile) AS boxby_profile,
                    MAX(boxby_role) AS boxby_role,
                    CONVERT(VARCHAR(19), MAX(box_date), 29) AS box_date,
                    COUNT(*) AS no_of_reel
                FROM 
                    CombinedData
                GROUP BY 
                    box_label_id 
                ORDER BY 
                    box_date;

                SELECT TOP (1) d.planno,d.cm_refid,UPPER(d.po) as po,sp.suppliername vendor,upper(d.tpn) tpn,d.planned_requested_qty pick_qty,d.confirm_qty issued_qty FROM planning_outward AS d INNER JOIN ms_supplier AS sp ON sp.id=d.supplierid WHERE d.del_status=0 AND d.planno=@planno;`,
                params: [
                    { name: 'planno', type: sql.NVarChar, value: planno }
                ]
            }
        ])).results || []
        res.status(201).send({ box_details, do_details });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}


const getMateriakAckBoxReelInfo = async (req, res) => {
    const { box_label_id, planno } = req.body
    try {
        const [data = []] = (await executeTransaction([
            {
                query: `SELECT ins.id,CONCAT('GRNLBL',COALESCE(
                        CAST(ins.grn_label_id AS NVARCHAR),
                        ins.grn_label_split_id
	                )) reel_id,ins.box_label_id,ins.palletno,ins.tpn,UPPER(l.location) location,ins.quantity FROM ops_inventory_new_splitup AS ins INNER JOIN ms_location AS l ON l.id=ins.locationid WHERE box_label_id=@box_label_id AND planno=@planno AND ins.del_status=0 AND ISNULL(ins.fqa_status,1)=1
            UNION
            SELECT ins.id,CONCAT('LBL',COALESCE(
                        CAST(ins.grn_label_id AS NVARCHAR),
                        ins.grn_label_split_id
	                )) reel_id,ins.box_label_id,ins.palletno,ins.tpn,UPPER(l.location) location,ins.quantity FROM ops_inventory_wall_to_wall_new_splitup AS ins INNER JOIN ms_location AS l ON l.id=ins.locationid WHERE box_label_id=@box_label_id AND planno=@planno AND ins.del_status=0 AND ISNULL(ins.fqa_status,1)=1`,
                params: [
                    { name: 'box_label_id', type: sql.NVarChar, value: box_label_id },
                    { name: 'planno', type: sql.NVarChar, value: planno }
                ]
            }
        ])).results || []
        res.status(201).send({ data });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}


const getMateriakAckBoxReelInfoByPlanno = async (req, res) => {
    const { planno } = req.body
    try {
        const [data = []] = (await executeTransaction([
            {
                query: `SELECT ins.id,CONCAT('GRNLBL',COALESCE(
                        CAST(ins.grn_label_id AS NVARCHAR),
                        ins.grn_label_split_id
	                )) reel_id,ins.box_label_id,ins.palletno,ins.tpn,UPPER(l.location) location,ins.quantity FROM ops_inventory_new_splitup AS ins INNER JOIN ms_location AS l ON l.id=ins.locationid WHERE planno=@planno AND ISNULL(ins.status,0)=0 AND ins.del_status=0 AND ISNULL(ins.fqa_status,1)=1
            UNION
            SELECT ins.id,CONCAT('LBL',COALESCE(
                        CAST(ins.grn_label_id AS NVARCHAR),
                        ins.grn_label_split_id
	                )) reel_id,ins.box_label_id,ins.palletno,ins.tpn,UPPER(l.location) location,ins.quantity FROM ops_inventory_wall_to_wall_new_splitup AS ins INNER JOIN ms_location AS l ON l.id=ins.locationid WHERE planno=@planno AND ISNULL(ins.status,0)=0 AND ins.del_status=0 AND ISNULL(ins.fqa_status,1)=1`,
                params: [
                    { name: 'planno', type: sql.NVarChar, value: planno }
                ]
            }
        ])).results || []
        res.status(201).send({ data });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}
const acknowledgeMaterial = async (req, res) => {
    const { id: userid } = req.userDetails.user

    try {
        const { doReelsInfo, box_details, action, remarks, po, planno, tpn, pick_qty, issued_qty, planNos } = req.body
        let htmlBody = ``
        const queries = []
        if (planNos) {
            for (const obj of planNos) {
                queries.push({
                    query: `UPDATE planning_outward SET status=14,ack_by=@ack_by,ack_date=getdate() WHERE planno=@planno;
                    UPDATE ops_inventory_new_splitup SET is_out=13 WHERE planno=@planno AND del_status=0 AND is_out=12;
                    UPDATE ops_inventory_wall_to_wall_new_splitup SET is_out=13 WHERE planno=@planno AND del_status=0 AND is_out=12;`,
                    params: [
                        { name: 'planno', type: sql.NVarChar, value: obj.planno },
                        { name: 'ack_by', type: sql.Int, value: userid }
                    ]
                })
                htmlBody += `<tr>
                                <td>${obj.po}</td>
                                <td>${obj.planno}</td> 
                                <td>${obj.tpn}</td> 
                                <td>${obj.confirm_qty}</td> 
                                <td>${obj.confirm_qty}</td> 
                            </tr>`
            }
        } else {
            let attachmentsname = null
            const doReelsInfoArr = JSON.parse(doReelsInfo)
            let quantity = 0
            let confirm_qty = 0
            let reject_qty = 0
            for (const obj of doReelsInfoArr) {
                quantity += Number(obj.quantity)
                confirm_qty += Number(obj.confirm_qty)
                if (obj.status !== 1)
                    reject_qty += Number(obj.quantity) === (obj.confirm_qty) ? obj.confirm_qty : Math.abs(obj.quantity - obj.confirm_qty)
                let ack_attachmentname = null
                if (req.files && req.files[obj.reel_id]) {
                    const attachments = req.files[obj.reel_id] || ''
                    ack_attachmentname = 'docs/materialAck/' + obj.reel_id + Date.now() + '.' + req.files[obj.reel_id].name.split('.').pop()
                    attachments.mv('./assets/docs/materialAck/' + obj.reel_id + Date.now() + '.' + req.files[obj.reel_id].name.split('.').pop())
                }
                const label_id = obj.reel_id.replace('GRNLBL', '').replace('LBL', '')
                let updateQuery = ``
                if (obj.reel_id.startsWith('GRNLBL')) {
                    updateQuery = `UPDATE ops_inventory_new_splitup SET is_out=13,ack_qty=@ack_qty,status=@status,ack_remarks=@ack_remarks,ack_attachments=@ack_attachments,ack_reject_qty=@ack_reject_qty WHERE COALESCE(CAST(grn_label_id AS NVARCHAR), grn_label_split_id)=@grn_label_id AND planno=@planno;`
                } else if (obj.reel_id.startsWith('LBL')) {
                    updateQuery = `UPDATE ops_inventory_wall_to_wall_new_splitup SET is_out=13,ack_qty=@ack_qty,status=@status,ack_remarks=@ack_remarks,ack_attachments=@ack_attachments,ack_reject_qty=@ack_reject_qty WHERE COALESCE(CAST(grn_label_id AS NVARCHAR), grn_label_split_id)=@grn_label_id AND planno=@planno;`
                } else {

                }
                queries.push({
                    query: updateQuery,
                    params: [
                        { name: 'planno', type: sql.NVarChar, value: planno },
                        { name: 'grn_label_id', type: sql.NVarChar, value: `${label_id}` },
                        { name: 'ack_qty', type: sql.Int, value: obj.confirm_qty },
                        { name: 'ack_reject_qty', type: sql.Int, value: Number(obj.quantity) === (obj.confirm_qty) ? obj.confirm_qty : Math.abs(obj.quantity - obj.confirm_qty) },
                        { name: 'status', type: sql.Int, value: obj.status },
                        { name: 'ack_remarks', type: sql.NVarChar, value: obj.ack_remarks },
                        { name: 'ack_attachments', type: sql.NVarChar, value: ack_attachmentname },
                        { name: 'ack_by', type: sql.Int, value: userid }
                    ]
                })
            }
            const status = doReelsInfoArr.every(obj => obj.status !== 1) ? 16 : doReelsInfoArr.some(obj => obj.status !== 1) ? 15 : 14;

            queries.push({
                query: `UPDATE planning_outward SET ack_attachments=@ack_attachments,ack_received_qty=@ack_received_qty,ack_reject_qty=@ack_reject_qty,ack_by=@ack_by,ack_date=getdate(),status=@status WHERE planno=@planno;`,
                params: [
                    { name: 'planno', type: sql.NVarChar, value: planno },
                    { name: 'ack_attachments', type: sql.NVarChar, value: attachmentsname },
                    { name: 'ack_received_qty', type: sql.Int, value: confirm_qty },
                    { name: 'ack_reject_qty', type: sql.Int, value: reject_qty },
                    { name: 'status', type: sql.Int, value: status },
                    { name: 'ack_by', type: sql.Int, value: userid }
                ]
            })
            htmlBody = `<tr>
                        <td>${po}</td>
                        <td>${planno}</td> 
                        <td>${tpn}</td> 
                        <td>${issued_qty}</td> 
                        <td>${confirm_qty}</td> 
                    </tr>`
        }
        const { success, error } = await executeTransaction(queries)
        if (!success) return res.status(401).send({ data: 'failed', error })
        const html = `<html>

<head>
    <style>
        body {
            width: 50%;
            margin-left: auto;
            margin-right: auto;
            background-color: #f8f8f8;
            margin-top: 4rem;
            margin-bottom: 4rem;
        }

        .main {
            box-shadow: 0 4px 18px rgba(47, 43, 61, .1), 0 0 transparent, 0 0 transparent;
            border-radius: 5px;
            background-color: #ffffff;
            padding: 2rem;
            display: flex;
            height: -webkit-fill-available;
        }

        .content {
            position: relative;
        }

        .image {
            text-align: center;
        }

        .d-flex {
            display: flex;
            justify-content: center;
        }

        .container {
            width: 100%;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table thead th,
        .table tbody td {
            padding: 0.6rem 1rem;
            border: 1px solid;
            text-align: center;
        }

        .mb-0 {
            margin-bottom: 0;
        }

        footer {
            position: absolute;
            bottom: 0;
        }
    </style>
</head>

<body>
    <div class="main">
        <div class="content">
            <header> 
                <h4 class="text-h4 mb-1">Material Acknowledged ✉️ </h4> 
            </header>
            <div class="d-flex">
                <div class="container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>PO /Order #</th>
                                <th>Delivery #</th>
                                <th>Requested TPN</th>
                                <th>Issued Qty</th>
                                <th>Received Qty</th>
                            </tr>
                        </thead>
                        <tbody>${htmlBody}</tbody>
                    </table>
                </div>
            </div>
            <footer>
                <p class="mb-0">Tejas Networks</p>
            </footer>
        </div>
    </div>
</body>

</html>`
        await sendMail({ service: 'Gmail', subject: 'Material Acknowledgement', html, to: 'parivallalin@gmail.com,manimaranramesh1402@gmail.com,velrajans@tejasnetworks.com,thiyagarajv@tejasnetworks.com,dhivagarr@tejasnetworks.com' })
        res.status(201).send({ data: 'success' })
    } catch (error) {
        // console.log(error);

        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}
const getAckVendorList = async (req, res) => {
    try {
        const { status } = req.body
        const { success, error, results: [data = []] } = (await executeTransaction([{
            query: `SELECT DISTINCT d.supplierid AS id, s.suppliername vendor FROM planning_outward AS d INNER JOIN ms_supplier AS s ON s.id=d.supplierid WHERE d.del_status=0 AND d.status IN (SELECT value FROM STRING_SPLIT(@status, ',')) ORDER BY s.suppliername`,
            params: [
                { name: 'status', type: sql.NVarChar, value: status }
            ]
        }])) || {}
        if (!success) return res.status(401).send({ data: [], error: `${error}` })
        res.status(201).send({ data });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }

}

const getPendingAcks = async (req, res) => {
    try {
        const { supplierid, status } = req.body
        const { usertype, id: supplier_id } = req.userDetails.user
        const [[{ count: pendingAck = 0 } = {}], [{ count: pendingDiscrepancy = 0 } = {}]] = (await executeTransaction([{
            query: `SELECT COUNT(id) count FROM planning_outward WHERE del_status=0 AND status=13 AND supplierid=CASE WHEN @usertype='Supplier' OR (@supplierid!='' AND @status=13) THEN @supplierid ELSE supplierid END;
            SELECT COUNT(id) count FROM planning_outward WHERE del_status=0 AND status=17 AND supplierid=CASE WHEN @usertype='Supplier' THEN @supplierid ELSE supplierid END`,
            params: [
                { name: 'supplierid', type: sql.Int, value: usertype === 'Supplier' ? supplier_id : supplierid || null },
                { name: 'usertype', type: sql.NVarChar, value: usertype },
                { name: 'status', type: sql.Int, value: status.split(',')[0] }
            ]
        }])).results || []
        res.status(201).send({ data: { pendingAck, pendingDiscrepancy } });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }

}



const updateDiscrepancy = async (req, res) => {
    try {
        const { planno, cm_refid } = req.body
        const { pick_qty, confirm_qty, ack_received_qty, ack_reject_qty } = req.body

        let reject_qty = 0;
        let query = ''
        if ((confirm_qty <= pick_qty) || (confirm_qty > pick_qty && ack_received_qty < pick_qty)) {
            if ((confirm_qty > pick_qty && ack_received_qty < pick_qty)) {
                reject_qty = pick_qty - ack_reject_qty
            }
            query = `DECLARE @rej_qty int = (SELECT ISNULL(SUM(ack_reject_qty),0) FROM ops_inventory_new_splitup WHERE planno=@planno AND del_status=0 AND status IN(2,4));
            UPDATE planning_cmlist SET planned_requested_qty=planned_requested_qty-GREATEST(@reject_qty,0),confirm_qty=confirm_qty-@reject_qty WHERE id=@cm_refid`
        }
        await executeTransaction([
            {
                query: `UPDATE planning_outward SET status=18 WHERE planno=@planno;${query}`,
                params: [
                    { name: 'cm_refid', type: sql.Int, value: cm_refid },
                    { name: 'planno', type: sql.NVarChar, value: planno },
                    { name: 'reject_qty', type: sql.Int, value: reject_qty }
                ]
            }
        ])
        res.status(201).send({ data: 'success' });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }

}

export {
    getMaterialAck,
    getMaterialAckDOReel,
    getMateriakAckBoxReelInfo,
    getMateriakAckBoxReelInfoByPlanno,
    acknowledgeMaterial,
    getAckVendorList,
    getPendingAcks,
    updateDiscrepancy
}