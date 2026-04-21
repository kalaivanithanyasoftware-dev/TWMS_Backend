import { sql } from "../../config/db.js";
import { executeSP, executeTransaction } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performVisitorReportAction = async (req, res) => {
    const { id: userid, roleid, firstname: currentUser, empcode: currentUserEmpcode } = req.userDetails.user
    const {
        totalentry: limit,
        pageNo,
        search,
        action,
        method,
        approve_remarks,
        rejected_remarks,
        reason_for_visit,
        id
    } = req.body;
    const offSet = (pageNo - 1) * limit;

    try {
        let activity_type = ''
        let activity_data = ''
        if (action === 'Add') {
            activity_type = 'Approval Created'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Created new User`
        } else if (action === 'Update') {
            activity_type = 'Approval Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated the User`
        } else if (action === 'Delete') {
            activity_type = 'Approval Deleted'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Deleted the User`
        } else if (action === 'StatusUpdate') {
            activity_type = 'Approval Status Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated User Status`
        }

        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([
            {
                sp: `USP_VMS_VisitorsReport`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + (search || '') + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action },
                    { name: 'id', type: sql.Int, value: id },
                    { name: 'userid', type: sql.Int, value: userid },
                    { name: 'approve_remarks', type: sql.NVarChar, value: approve_remarks },
                    { name: 'rejected_remarks', type: sql.NVarChar, value: rejected_remarks },
                    { name: 'reason_for_visit', type: sql.NVarChar, value: reason_for_visit },


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
        if (['Approve', 'Reject'].includes(action)) {
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

            return res.status(201).send({ success, data: data, paginate: { totalPage, totalRecords }, action, method });
        }
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
};

export { performVisitorReportAction };