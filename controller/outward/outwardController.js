import { sql, poolPromise } from "../../config/db.js";
import { CTEJoinAndWhereQueries, CTEQueries } from "../../custom/CTEAndJoinsQueries.js";
import { executeTransaction } from "../../custom/mssqlExecution.js";
import { limitOffset, queries } from "../../custom/queries.js";

const getVendorList = async (req, res) => {
    try {
        const pool = await poolPromise;
        const getVendor = await pool.query(`SELECT DISTINCT cm.supplierid AS id,sp.suppliername AS vendor FROM planning_cmlist AS cm INNER JOIN ms_supplier AS sp ON sp.id=cm.supplierid  WHERE cm.status=1 AND sp.status=1 AND sp.del_status=0 AND cm.del_status=0 ORDER BY vendor`);
        res.status(201).send({ data: getVendor.recordset || [] });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}

const getCMvsSAP = async (req, res) => {
    const { totalentry: limit, pageNo, search = '', status } = req.body
    const offSet = (pageNo - 1) * limit;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('search', sql.NVarChar, '%' + search + '%')
            .input('offset', sql.Int, offSet)
            .input('status', sql.Int, status)
            .input('limit', sql.Int, limit)
            .query(queries.cmvssap + limitOffset + queries.cmvssap);
        let totalRecords = result.rowsAffected[1]
        let totalPage = Math.ceil(result.rowsAffected[1] / limit);
        res.status(201).send({ data: result.recordset, paginate: { totalPage: totalPage, totalRecords: totalRecords } });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


const getPicklistGeneration = async (req, res) => {
    const { totalentry: limit, pageNo, search = '', status } = req.body
    const offSet = (pageNo - 1) * limit;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('search', sql.NVarChar, '%' + search + '%')
            .input('offset', sql.Int, offSet)
            .input('status', sql.NVarChar, String(status))
            .input('limit', sql.Int, limit)
            .query(queries.picklist_generation + limitOffset + `${CTEQueries.picklist_generation} SELECT COUNT(*) AS count FROM PlanningDetails pd ${CTEJoinAndWhereQueries.picklist_generation}`);
        let { count } = result.recordsets[1][0]
        let totalPage = Math.ceil(count / limit);
        res.status(201).send({ data: result.recordset, paginate: { totalPage: totalPage, totalRecords: count } });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


const getPicklistPrint = async (req, res) => {
    const { id: planno } = req.body
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('planno', sql.NVarChar, planno)
            .query(`SELECT d.id out_id,d.cm_refid as cm_id,i.id as inven_id,d.po, d.planno, upper(d.tpn) as tpn, upper(i.palletno) palletno, upper(i.location) location, i.quantity, d.planned_requested_qty as req_qty, '' as noofpallet, '' as noofbox, '' as totalqty, '' as remarks,sp.suppliername vendor,u.firstname+' '+u.lastname pick_by,r.rolename as pick_byrole,u.empcode as pick_byempcode,isnull(u.profile,'') pick_byprofile FROM planning_outward AS d INNER JOIN ms_supplier AS sp ON sp.id=d.supplierid inner join ops_inventory AS i ON i.tpn=d.tpn inner join ms_user as u on u.id=d.pick_by inner join ms_role as r on r.id=u.roleid where d.planno=@planno AND i.del_status=0`);
        res.status(201).send({ data: result.recordset });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


const deletePicklist = async (req, res) => {
    const { id: planno, pick_qty, cm_refid, tpn } = req.body
    const { id: userid, roleid } = req.userDetails.user
    try {
        let activity_type = 'Plan Deleted'
        let activity_data = 'User has Deleted Picklist'
        const { success, error } = (await executeTransaction([{
            query: `update planning_cmlist set status=1,planned_requested_qty=planned_requested_qty-GREATEST(@pick_qty,0),planno=null where id=@cm_refid;
                update planning_sapstocklist SET availablequantity=availablequantity+@pick_qty WHERE material=@tpn
                UPDATE planning_outward SET del_status=1,deletedby=@deletedby,deleteddate=GETDATE() where planno=@planno;
                INSERT INTO user_activity_log (userid,roleid,activity_type,activity_data) VALUES (@userid,@roleid,@activity_type,@activity_data);`,
            params: [
                { name: 'planno', type: sql.NVarChar, value: planno },
                { name: 'cm_refid', type: sql.Int, value: cm_refid },
                { name: 'tpn', type: sql.NVarChar, value: tpn },
                { name: 'pick_qty', type: sql.Int, value: pick_qty },
                { name: 'userid', type: sql.Int, value: userid },
                { name: 'roleid', type: sql.Int, value: roleid },
                { name: 'activity_type', type: sql.NVarChar, value: activity_type },
                { name: 'activity_data', type: sql.NVarChar, value: activity_data },
                { name: 'deletedby', type: sql.Int, value: userid }
            ]
        }])) || {}
        if (!success) return res.status(401).send({ data: 'failed', error: `${error}` })
        res.status(201).send({ data: 'success' });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}

const deleteMultiplePicklist = async (req, res) => {
    const { deleteRecords } = req.body
    const { id: userid, roleid } = req.userDetails.user
    try {
        const queries = []
        let activity_type = 'Plan Deleted'
        let activity_data = 'User has Deleted Picklist'
        for (const obj of deleteRecords) {
            queries.push({
                query: `update planning_cmlist set planned_requested_qty=planned_requested_qty-GREATEST(@pick_qty,0),planno=null where id=@cm_refid;
                update planning_sapstocklist SET availablequantity=availablequantity+@pick_qty WHERE material=@tpn
                UPDATE planning_outward SET del_status=1,deletedby=@deletedby,deleteddate=GETDATE() where planno=@planno;
                INSERT INTO user_activity_log (userid,roleid,activity_type,activity_data) VALUES (@userid,@roleid,@activity_type,@activity_data);`,
                params: [
                    { name: 'planno', type: sql.NVarChar, value: obj.id },
                    { name: 'cm_refid', type: sql.Int, value: obj.cm_refid },
                    { name: 'tpn', type: sql.NVarChar, value: obj.tpn },
                    { name: 'pick_qty', type: sql.Int, value: obj.pick_qty },
                    { name: 'userid', type: sql.Int, value: userid },
                    { name: 'roleid', type: sql.Int, value: roleid },
                    { name: 'activity_type', type: sql.NVarChar, value: activity_type },
                    { name: 'activity_data', type: sql.NVarChar, value: activity_data },
                    { name: 'deletedby', type: sql.Int, value: userid }
                ]
            })
        }
        const { success, error } = (await executeTransaction(queries)) || {}

        if (!success) return res.status(401).send({ data: 'failed', error: `${error}` })
        res.status(201).send({ data: 'success' });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


const updatePicklistPrintCount = async (req, res) => {
    const { id: planno } = req.body
    const { id: userid, roleid } = req.userDetails.user
    try {
        const pool = await poolPromise;
        let activity_type = 'Picklist Printed'
        let activity_data = 'User has Printed the Picklist'
        await pool.request()
            .input('planno', sql.NVarChar, planno)
            .input('userid', sql.Int, userid)
            .input('roleid', sql.Int, roleid)
            .input('activity_type', sql.NVarChar, activity_type)
            .input('activity_data', sql.NVarChar, activity_data)
            .query(`UPDATE planning_outward SET printcount=isnull(printcount,0)+1,first_printdate=ISNULL(first_printdate,GETDATE()),printdate=getdate() where planno=@planno;
            INSERT INTO user_activity_log (userid,roleid,activity_type,activity_data) VALUES (@userid,@roleid,@activity_type,@activity_data); 
            `);
        res.status(201).send({ data: 'success' });
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}

const getDetailedReport = async (req, res) => {
    const { totalentry: limit, pageNo, search } = req.body
    const offSet = (pageNo - 1) * limit;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('search', sql.NVarChar, '%' + search + '%')
            .input('offset', sql.Int, offSet)
            .input('limit', sql.Int, limit)
            .query(queries.detailed_report + limitOffset + `${CTEQueries.detailed_report} SELECT COUNT(*) AS count FROM PlanningDetails pd ${CTEJoinAndWhereQueries.detailed_report}`);

        let { count } = result.recordsets[1][0]
        let totalPage = Math.ceil(count / limit);
        res.status(201).send({ data: result.recordset, paginate: { totalPage: totalPage, totalRecords: count } });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error} ` })
    }
}
const getDeliveryTracking = async (req, res) => {
    const { planno } = req.body
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('planno', sql.NVarChar, planno)
            .query(`
        --Assigned
SELECT TOP(1) convert(varchar(16), po.assigned_on, 29) assigned_on, u.firstname + ' ' + u.lastname as assigned_by, u.empcode as assigned_byempcode, r.rolename as assigned_byrole, isnull(u.profile, '') assigned_byprofile FROM planning_outward AS po inner join ms_user as u on u.id = po.assigned_by inner join ms_role as r on r.id = u.roleid WHERE po.del_status = 0 AND planno = @planno order by po.id desc;

        --Picked
SELECT TOP(1) convert(varchar(16), p.denomination_date, 29) picked_on, u.firstname + ' ' + u.lastname as picked_by, u.empcode as picked_byempcode, r.rolename as picked_byrole, isnull(u.profile, '') picked_byprofile FROM planning_outward AS p inner join ms_user as u on u.id = p.denomination_by inner join ms_role as r on r.id = u.roleid 
WHERE p.del_status = 0 AND p.planno = @planno;

        --Partially Boxed
SELECT TOP(1) convert(varchar(16), p.box_date, 29) partially_box_on, u.firstname + ' ' + u.lastname as partially_box_by, u.empcode as partially_box_byempcode, r.rolename as partially_box_byrole, isnull(u.profile, '') partially_box_byprofile FROM planning_outward AS p inner join ms_user as u on u.id = p.box_by inner join ms_role as r on r.id = u.roleid WHERE p.del_status = 0 AND p.planno = @planno AND p.box_by IS NOT NULL ORDER BY p.id DESC;

        --Box Done(Fully Boxed)

SELECT TOP(1) convert(varchar(16), po.box_date, 29) box_on, u.firstname + ' ' + u.lastname as box_by, u.empcode as box_byempcode, r.rolename as box_byrole, isnull(u.profile, '') box_byprofile FROM planning_outward AS po inner join ms_user as u on u.id = po.box_by inner join ms_role as r on r.id = u.roleid 
WHERE po.del_status = 0 AND planno = @planno order by po.id desc;

        --Box Labeling Done

SELECT TOP(1) convert(varchar(16), po.labeldone_date, 29) label_on, u.firstname + ' ' + u.lastname as label_by, u.empcode as label_byempcode, r.rolename as label_byrole, isnull(u.profile, '') label_byprofile FROM planning_outward AS po inner join ms_user as u on u.id = po.labeldone_by inner join ms_role as r on r.id = u.roleid 
WHERE po.del_status = 0 AND planno = @planno order by po.id desc;

        --FQA Pre - Inspection Done
SELECT TOP(1) convert(varchar(16), po.pre_inspect_date, 29) pre_inspect_on, u.firstname + ' ' + u.lastname as pre_inspect_by, u.empcode as pre_inspect_byempcode, r.rolename as pre_inspect_byrole, isnull(u.profile, '') pre_inspect_byprofile FROM planning_outward AS po inner join ms_user as u on u.id = po.pre_inspect_by inner join ms_role as r on r.id = u.roleid 
WHERE po.del_status = 0 AND planno = @planno order by po.id desc;

        --FQA Confirmation Done
SELECT TOP(1) convert(varchar(16), po.fqa_date, 29) fqa_on, u.firstname + ' ' + u.lastname as fqa_by, u.empcode as fqa_byempcode, r.rolename as fqa_byrole, isnull(u.profile, '') fqa_byprofile FROM planning_outward AS po inner join ms_user as u on u.id = po.fqa_by inner join ms_role as r on r.id = u.roleid 
WHERE po.del_status = 0 AND planno = @planno order by po.id desc;

        --Dispatch Done
SELECT TOP(1) convert(varchar(16), po.dispatch_date, 29) dispatch_on, u.firstname + ' ' + u.lastname as dispatch_by, u.empcode as dispatch_byempcode, r.rolename as dispatch_byrole, isnull(u.profile, '') dispatch_byprofile FROM planning_outward AS po inner join ms_user as u on u.id = po.dispatch_by inner join ms_role as r on r.id = u.roleid 
WHERE po.del_status = 0 AND planno = @planno order by po.id desc;


SELECT TOP(1) convert(varchar(16), po.eway_bill_date, 29) ewaybill_on, u.firstname + ' ' + u.lastname as ewaybill_by, u.empcode as ewaybill_byempcode, r.rolename as ewaybill_byrole, isnull(u.profile, '') ewaybill_byprofile FROM planning_outward AS po inner join ms_user as u on u.id = po.eway_bill_by inner join ms_role as r on r.id = u.roleid 
WHERE po.del_status = 0 AND planno = @planno order by po.id desc;

SELECT TOP(1) convert(varchar(16), po.ship_date, 29) ship_on, u.firstname + ' ' + u.lastname as ship_by, u.empcode as ship_byempcode, r.rolename as ship_byrole, isnull(u.profile, '') ship_byprofile FROM planning_outward AS po inner join ms_user as u on u.id = po.ship_by inner join ms_role as r on r.id = u.roleid 
WHERE po.del_status = 0 AND planno = @planno order by po.id desc;

SELECT TOP(1) convert(varchar(16), po.ack_date, 29) ack_on, u.firstname + ' ' + u.lastname as ack_by, u.empcode as ack_byempcode, r.rolename as ack_byrole, isnull(u.profile, '') ack_byprofile FROM planning_outward AS po inner join ms_user as u on u.id = po.ack_by inner join ms_role as r on r.id = u.roleid 
WHERE po.del_status = 0 AND planno = @planno order by po.id desc; `);
        res.status(201).send({ data: Object.assign({}, ...result.recordsets.flat()) });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error} ` })
    }
}

const revetPlanningProcesses = async (req, res) => {
    const { revert_to, outward_id, inventory_id, reason: remarks } = req.body
    const { id: userid, roleid } = req.userDetails.user
    try {
        const pool = await poolPromise;
        let query = ``;
        let activity_type = ''
        let activity_data = ''
        if (revert_to === 'picking_denomination') {
            const getresult = await pool.request()
                .input('outward_id', sql.Int, outward_id)
                .query(`SELECT inventory_id,case when noofbox = 0 or noofbox is null then noofpallet else noofbox end * quantity totalqty FROM planning_outward_splitup WHERE outward_id = @outward_id`)
            const records = getresult.recordset;
            for (const obj of records) {
                await pool.request()
                    .input('totalqty', sql.Int, obj.totalqty)
                    .input('inventory_id', sql.Int, obj.inventory_id)
                    .query(`UPDATE ops_inventory SET quantity = quantity + @totalqty WHERE id = @inventory_id`);
            }

            query = `UPDATE planning_outward SET status = 1, picking_reverse_remarks = @remarks, picking_reversed_by = @reversed_by, picking_reversed_date = getdate() WHERE id = @outward_id;
            DELETE FROM planning_outward_splitup WHERE outward_id = @outward_id;
            INSERT INTO user_activity_log(userid, roleid, activity_type, activity_data) VALUES(@userid, @roleid, @activity_type, @activity_data); `

            activity_data = `User Reversed Record to Picking Denomination`;

        } else if (revert_to === 'qa_confirmation') {
            query = 'UPDATE planning_outward SET status=2,qa_reverse_remarks=@remarks,qa_reversed_by=@reversed_by,qa_reversed_date=getdate() WHERE id=@outward_id;UPDATE planning_outward_splitup SET status=1 WHERE id=@outward_id;'

            activity_data = 'User Reversed Record to QA Confirmation';

        } else if (revert_to === 'qa_confirmation1') {
            query = 'UPDATE planning_outward SET status=3 WHERE id=@outward_id;UPDATE planning_outward_splitup SET status=2 WHERE id=@outward_id;'
        } else {

        }
        await pool.request()
            .input('outward_id', sql.Int, outward_id)
            .input('inventory_id', sql.Int, inventory_id)
            .input('reversed_by', sql.Int, userid)
            .input('roleid', sql.Int, roleid)
            .input('activity_type', sql.NVarChar, activity_type)
            .input('activity_data', sql.NVarChar, activity_data)
            .input('remarks', sql.Int, remarks)
            .query(query);
        res.status(201).send({ data: 'success' });
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error} ` })
    }
}


const getPlannoReelInfo = async (req, res) => {
    const { planno } = req.body
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('planno', sql.NVarChar, planno)
            .query(`SELECT ins.id,CONCAT('GRNLBL',ins.grn_label_id) reel_id,ins.palletno,ins.tpn,UPPER(l.location) location,ins.quantity,CASE WHEN ISNULL(is_out,0)<=4 THEN 'Yet To FQA' WHEN ISNULL(fqa_status,1)=1 THEN 'FQA Confirmed' WHEN fqa_status=2 THEN 'FQA Rejected' ELSE 'NA' END status FROM ops_inventory_new_splitup AS ins INNER JOIN ms_location AS l ON l.id=ins.locationid WHERE planno=@planno AND ins.del_status=0
            UNION
            SELECT ins.id,CONCAT('LBL',ins.grn_label_id) reel_id,ins.palletno,ins.tpn,UPPER(l.location) location,ins.quantity,CASE WHEN ISNULL(is_out,0)<=4 THEN 'Yet To FQA' WHEN ISNULL(fqa_status,1)=1 THEN 'FQA Confirmed' WHEN fqa_status=2 THEN 'FQA Rejected' ELSE 'NA' END status FROM ops_inventory_wall_to_wall_new_splitup AS ins INNER JOIN ms_location AS l ON l.id=ins.locationid WHERE planno=@planno AND ins.del_status=0`);

        res.status(201).send({ data: result.recordset || [] });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}
export {
    getVendorList,
    getCMvsSAP,
    getPicklistGeneration,
    getPicklistPrint,
    deletePicklist,
    deleteMultiplePicklist,
    updatePicklistPrintCount,
    getDeliveryTracking,
    revetPlanningProcesses,
    // getPrintingQR
    getDetailedReport,
    getPlannoReelInfo
}