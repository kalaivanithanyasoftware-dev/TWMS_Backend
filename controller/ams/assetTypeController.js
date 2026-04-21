import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";



const performAssetTypeAction = async (req, res) => {
    const {
        id: userid,
        roleid,
        firstname: currentUser,
        empcode: currentUserEmpcode
    } = req.userDetails.user

    const {
        totalentry: limit,
        pageNo,
        search = '',
        action,
        method,
        categoryid,
        id,
        description,
        assettype,
        status,
        excelArray = []
    } = req.body
    const offSet = (pageNo - 1) * limit;

    try {
        let activity_type = ''
        let activity_data = ''
        if (action === 'Add') {
            activity_type = 'Category Created'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Created new User`
        } else if (action === 'Update') {
            activity_type = 'Category Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated the User`
        } else if (action === 'Delete') {
            activity_type = 'Category Deleted'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Deleted the User`
        } else if (action === 'StatusUpdate') {
            activity_type = 'Category Status Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated User Status`
        }


        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([
            {
                sp: `USP_AMS_AssetType`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'excelArray', type: sql.NVarChar, value: excelArray },
                    { name: 'action', type: sql.NVarChar, value: action },
                    { name: 'categoryid', type: sql.NVarChar, value: categoryid },
                    { name: 'assettype', type: sql.NVarChar, value: assettype },
                    { name: 'description', type: sql.NVarChar, value: description },
                    { name: 'status', type: sql.Int, value: status },
                    { name: 'id', type: sql.Int, value: id },
                    { name: 'userid', type: sql.Int, value: userid },
                    { name: 'roleid', type: sql.Int, value: roleid },
                    { name: 'activity_type', type: sql.NVarChar, value: activity_type },
                    { name: 'activity_data', type: sql.NVarChar, value: activity_data }
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
        if (['Add', 'Update', 'Upload', 'Delete', 'StatusUpdate'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                data,
                action, method
            })
            return res.status(201).send({ notify: false, success, message: 'success', data, action, method });
        }
        if (action === 'AssetTypeList') {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (['Fetch'].includes(action)) {
            const totalPage = Math.ceil(totalRecords / limit);
            return res.status(201).send({ success, data, paginate: { totalPage, totalRecords }, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


export { performAssetTypeAction };