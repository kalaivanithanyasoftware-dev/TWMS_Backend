import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performSupportTicketAction = async (req, res) => {
    const { id: userid, roleid, firstname: currentUser, empcode: currentUserEmpcode } = req.userDetails.user
    const {
        totalentry: limit,
        pageNo,
        search = '',
        action,
        method,
        support_remarks,
        support_type,
        ETA,
        id
    } = req.body;

    const offSet = (pageNo - 1) * limit;

    try {
        let activity_type = ''
        let activity_data = ''
        if (action === 'Add') {
            activity_type = 'Support Ticket Created'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Created new User`
        } else if (action === 'Update') {
            activity_type = 'Support Ticket Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated the User`
        } else if (action === 'Delete') {
            activity_type = 'Support Ticket Deleted'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Deleted the User`
        } else if (action === 'StatusUpdate') {
            activity_type = 'Support Ticket Status Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated User Status`
        }

        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([
            {
                sp: `USP_AMS_SupportTicket`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + (search.trim() || '') + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action },
                    { name: 'id', type: sql.Int, value: id },
                    { name: 'userid', type: sql.Int, value: userid },
                    { name: 'roleid', type: sql.Int, value: roleid },
                    { name: 'support_remarks', type: sql.VarChar, value: support_remarks || null },
                    { name: 'support_type', type: sql.VarChar, value: support_type || null },
                    { name: 'maintanance_id', type: sql.Int, value: req.body.maintenance_type || null },

                    { name: 'ETA', type: sql.DateTime, value: ETA || null }
                ]
            }
        ])) || {};

        if (!success) return res.status(401).send({
            notify: true,
            success,
            message: errorMessages.somethingWentWrong,
            errorMessage: `${error}`,
            action, method
        });

        if (['Ticket', 'Resolve_Ticket'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }

        if (['MaintenanceList'].includes(action)) {
            return res.status(201).send({
                notify: false,
                success: true,
                data,
                action,
                method
            })
        }

        if (['Fetch'].includes(action)) {
            const totalPage = Math.ceil(totalRecords / limit);
            const filteredData = data.map(row => ({
                ...row,
                asset_no: {
                    asset_number: row.asset_number,
                    plantcode: row.plantcode,
                    plantname: row.plantname
                },
                category: {
                    category: row.category,
                    assettype: row.assettype
                },
                specification: {
                    brandname: row.brandname,
                    model_name: row.model_name,
                    specification: row.specification,
                    serial_no: row.serial_number
                },


            }));

            return res.status(201).send({ success, data: filteredData, paginate: { totalPage, totalRecords }, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
    if (['Export'].includes(action)) {
        const totalPage = Math.ceil(totalRecords / limit);
        const filteredData = data.map(row => ({
            ...row,
            asset_no: {
                asset_number: row.asset_number,
                plantcode: row.plantcode,
                plantname: row.plantname
            },
            category: {
                category: row.category,
                assettype: row.assettype
            },
            specification: {
                brandname: row.brandname,
                model_name: row.model_name,
                specification: row.specification,
                serial_no: row.serial_number,
            },
        }));
        return res.status(201).send({ success, data: filteredData, paginate: { totalPage, totalRecords }, action, method });
    }
    return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
};
export { performSupportTicketAction };

