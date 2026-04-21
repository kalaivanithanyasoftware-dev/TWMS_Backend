import { sql } from "../../config/db.js";
import { executeSP, executeTransaction } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performAssetScrapAction = async (req, res) => {
    const { id: userid, roleid, firstname: currentUser, empcode: currentUserEmpcode } = req.userDetails.user
    const {
        totalentry: limit,
        pageNo,
        search='',
        action,
        method,
        is_scrap_reason,
        id
    } = req.body;
    const offSet = (pageNo - 1) * limit;

    try { 
        let filesnames = []
        let filesUrls = []
        if (req.files) {
            for (const file of req.files.asset_attachment_url) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                filesUrls.push('images/assetScrap/' + uniqueSuffix + file.name)
                filesnames.push(uniqueSuffix + file.name)
                file.mv('./assets/images/assetScrap/' + uniqueSuffix + file.name)
            }
        }

        let activity_type = ''
        let activity_data = ''
        if (action === 'Add') {
            activity_type = 'AssetScrap Created'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Created new User`
        } else if (action === 'Update') {
            activity_type = 'AssetScrap Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated the User`
        } else if (action === 'Delete') {
            activity_type = 'AssetScrap Deleted'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Deleted the User`
        } else if (action === 'StatusUpdate') {
            activity_type = 'AssetScrap Status Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated User Status`
        }
        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([
            {
                sp: `USP_AMS_AssetScrap`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + (search.trim() || '') + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action },
                    { name: 'is_scrap_reason', type: sql.NVarChar, value: is_scrap_reason },
                    { name: 'asset_attachment_name', type: sql.NVarChar, value: filesnames.join(',') },
                    { name: 'asset_attachment_url', type: sql.NVarChar, value: filesUrls.join(',') },
                    { name: 'id', type: sql.Int, value: id },
                    { name: 'userid', type: sql.Int, value: userid },
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

        if (['Scrap'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
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
                    specification: row.specification
                },
                serial_no: row.serial_number,
                doc_name: row.doc_name,
                po_number_date: {
                    po_number: row.po_number,
                    po_date: row.po_date
                },
                giri_number_date: {
                    grir_name: row.grir_name,
                    grir_date: row.grir_date
                },
                vendor_name: row.vendor_name
               
            }));

            return res.status(201).send({ success, data: filteredData, paginate: { totalPage, totalRecords }, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};

export { performAssetScrapAction };

