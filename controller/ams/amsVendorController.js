import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performAmsVendorAction = async (req, res) => {
    const { id: userid, roleid, firstname: currentUser, empcode: currentUserEmpcode } = req.userDetails.user
    const {
        totalentry: limit,
        pageNo,
        search='',
        action,
        method,
        vendorcode,
        vendorname,
        gst,
        email,
        mobile,
        address,
        remarks,
        id,
        status
    } = req.body
    const offSet = (pageNo - 1) * limit;

    try {

        let activity_type = ''
        let activity_data = ''
        if (action === 'Add') {
            activity_type = 'AMSVendor Created'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Created new User`
        } else if (action === 'Update') {
            activity_type = 'AMSVendor Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated the User`
        } else if (action === 'Delete') {
            activity_type = 'AMSVendor Deleted'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Deleted the User`
        } else if (action === 'StatusUpdate') {
            activity_type = 'AMSVendor Status Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated User Status`
        }

        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([
            {
                sp: `USP_AMS_vendor`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action },
                    { name: 'vendorcode', type: sql.NVarChar, value: vendorcode },
                    { name: 'vendorname', type: sql.NVarChar, value: vendorname },
                    { name: 'gst', type: sql.NVarChar, value: gst },
                    { name: 'email', type: sql.NVarChar, value: email },
                    { name: 'mobile', type: sql.BigInt, value: mobile },
                    { name: 'address', type: sql.NVarChar, value: address },
                    { name: 'remarks', type: sql.NVarChar, value: remarks },
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
        if (['Add', 'Update', 'Delete', 'StatusUpdate'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }
        if (action === 'AmsVendorsList') {
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
            return res.status(201).send({ success, data, paginate: { totalPage, totalRecords }, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


export { performAmsVendorAction }