import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performMyPropertyAction = async (req, res) => {
    const { id: userid, roleid, firstname: currentUser, empcode: currentUserEmpcode } = req.userDetails.user
    const {
        totalentry: limit,
        pageNo,
        search = '',
        action,
        method,
        is_ticket_reason,
        id,
        ids = [],
        asset_number,
        return_reason,
        asset_id

    } = req.body;
    const offSet = (pageNo - 1) * limit;

    try {

        let filesnames = []
        let filesUrls = [] 

        if (req.files) {
            const files = req.files.ticket_attachment
            if (Array.isArray(files)) {
                for (const file of files) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    filesUrls.push('images/assetScrap/' + uniqueSuffix + file.name)
                    filesnames.push(uniqueSuffix + file.name)
                    file.mv('./assets/images/assetScrap/' + uniqueSuffix + file.name)
                }
            } else {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                filesUrls.push('images/assetScrap/' + uniqueSuffix + files.name)
                filesnames.push(uniqueSuffix + files.name)
                files.mv('./assets/images/assetScrap/' + uniqueSuffix + files.name)
            }

        }

        let activity_type = ''
        let activity_data = ''
        if (action === 'Add') {
            activity_type = 'Ticket Created'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Created new User`
        } else if (action === 'Update') {
            activity_type = 'Ticket Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated the User`
        } else if (action === 'Delete') {
            activity_type = 'Ticket Deleted'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Deleted the User`
        } else if (action === 'StatusUpdate') {
            activity_type = 'Ticket Status Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated User Status`
        }

        const response = (await executeSP([
            {
                sp: `USP_AMS_MyProperty`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + (search.trim() || '') + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action },
                    { name: 'asset_number', type: sql.NVarChar, value: asset_number },
                    { name: 'is_ticket_reason', type: sql.NVarChar, value: is_ticket_reason },
                    { name: 'ticket_attachment', type: sql.NVarChar, value: filesUrls.join(',') },
                    { name: 'asset_property_attachment_url', type: sql.NVarChar, value: filesUrls.join(',') },
                    { name: 'id', type: sql.Int, value: id },
                    { name: 'ids', type: sql.NVarChar, value: ids },
                    { name: 'userid', type: sql.Int, value: userid },
                    { name: 'return_reason', type: sql.NVarChar, value: return_reason || null },
                    { name: 'asset_id', type: sql.Int, value: asset_id || null },

                ]
            }
        ])) || {};
        const { success, error, results } = response
        const [data = [], [{ count: totalRecords = 0 } = {}] = []] = results
        if (!success) return res.status(401).send({
            notify: true,
            success,
            message: errorMessages.somethingWentWrong,
            errorMessage: `${error}`,
            action, method
        });
        if (['Ticket'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }

        if (['Ticket_Info'].includes(action)) {

            // return res.status(201).send({ success: true, ticketInfo: data[0] || {}, assetHistory: results[1][0] || {}, action, method });

            return res.status(201).send({ success: true, ticketInfoList: data || [], assetHistory: results[1][0] || {}, action, method });

        }


        if (['Asset_History'].includes(action)) {


            return res.status(201).send({ success: true, data, action, method });
        }

        if (['Return_Asset'].includes(action)) {
            return res.status(201).send({ success: true, message: 'Asset returned successfully', action, method });
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

                doc_name: row.doc_name,
                po_number_date: {
                    po_number: row.po_number,
                    po_date: row.po_date
                },
                giri_number_date: {
                    grir_name: row.grir_name,
                    grir_date: row.grir_date
                },
                supplier_name: row.supplier_name,

            }));

            return res.status(201).send({ success, data: filteredData, paginate: { totalPage, totalRecords }, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};

export { performMyPropertyAction };

