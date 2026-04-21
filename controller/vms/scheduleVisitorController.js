
import { changeFlatpickerDateToSqlFormat } from "../../config/auth.js";
import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performScheduleVisitorAction = async (req, res) => {
    const {
        globalPlant,
        plantid: userPlantid,
        id: userid, roleid, firstname: currentUser, empcode: currentUserEmpcode } = req.userDetails.user;

    const {
        globalPlantId,
        plantid,
        totalentry: limit,
        pageNo,
        search = '',
        action,
        method,
        id,
        Organizationid = '',
        visitor_name,
        vehicle_no,
        mobile_no = '',
        vaccination,
        address,
        state,
        city,
        laptop_serial_no,
        walkinName,
        walkin,
        to_meet,
        reason_for_visit = '',
        schedule_date = '',
        status,
        del_remarks,

    } = req.body;

    const offSet = (pageNo - 1) * limit;

    try {
        let activity_type = '';
        let activity_data = '';

        if (action === 'Add') {
            activity_type = 'ScheduleVisitor Created';
            activity_data = `${currentUser} (${currentUserEmpcode}) has Created new User`;
        } else if (action === 'Update') {
            activity_type = 'ScheduleVisitor Updated';
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated the User`;
        } else if (action === 'Delete') {
            activity_type = 'ScheduleVisitor Deleted';
            activity_data = `${currentUser} (${currentUserEmpcode}) has Deleted the User`;
        } else if (action === 'StatusUpdate') {
            activity_type = 'ScheduleVisitor Status Updated';
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated User Status`;
        }

        const schedule_dateArr = changeFlatpickerDateToSqlFormat(schedule_date)

        const [schedule_start_date, schedule_end_date] = Array.isArray(schedule_dateArr) ? schedule_dateArr : [schedule_dateArr, schedule_dateArr];

        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([{
            sp: `USP_VMS_Planned_Visitors`,
            params: [
                { name: 'search', type: sql.NVarChar, value: '%' + search + '%' },
                { name: 'offset', type: sql.Int, value: offSet },
                { name: 'limit', type: sql.Int, value: limit },
                { name: 'action', type: sql.NVarChar, value: action },
                { name: 'globalPlantId', type: sql.Int, value: globalPlantId },
                { name: 'plantid', type: sql.Int, value: globalPlant ? plantid : userPlantid },
                { name: 'Organizationid', type: sql.NVarChar, value: String(Organizationid) },
                { name: 'visitor_name', type: sql.NVarChar, value: visitor_name },
                { name: 'vehicle_no', type: sql.NVarChar, value: vehicle_no },
                { name: 'mobile_no', type: sql.NVarChar, value: mobile_no },
                { name: 'vaccination', type: sql.NVarChar, value: vaccination },
                { name: 'address', type: sql.NVarChar, value: address },
                { name: 'state', type: sql.NVarChar, value: state },
                { name: 'city', type: sql.NVarChar, value: city },
                { name: 'laptop_serial_no', type: sql.NVarChar, value: laptop_serial_no },
                { name: 'reason_for_visit', type: sql.NVarChar, value: reason_for_visit },
                { name: 'walkinName', type: sql.NVarChar, value: walkinName },
                { name: 'walkin', type: sql.Int, value: walkin },
                { name: 'to_meet', type: sql.Int, value: to_meet },
                { name: 'schedule_start_date', type: sql.NVarChar, value: schedule_start_date },
                { name: 'schedule_end_date', type: sql.NVarChar, value: schedule_end_date },
                { name: 'status', type: sql.Int, value: status },
                { name: 'id', type: sql.Int, value: id },
                { name: 'userid', type: sql.Int, value: userid },
                { name: 'roleid', type: sql.Int, value: roleid },
                { name: 'activity_type', type: sql.NVarChar, value: activity_type },
                { name: 'activity_data', type: sql.NVarChar, value: activity_data },
                { name: 'del_remarks', type: sql.NVarChar, value: del_remarks }
            ]
        }])) || {};

        if (!success) {
            return res.status(401).send({
                notify: true,
                success,
                message: errorMessages.somethingWentWrong,
                errorMessage: `${error}`,
                action,
                method
            });
        }

        if (['Add', 'Update', 'Upload', 'Delete', 'CheckIn', 'CheckOut', 'StatusUpdate'].includes(action)) {
            if (error) {
                return res.status(201).send({
                    notify: true,
                    success: false,
                    error: true,
                    message: error,
                    action,
                    method
                });
            }
            return res.status(201).send({
                notify: false,
                success,
                message: 'success',
                action,
                method
            });
        }

        if (['OrganizationList', 'CityList', 'StateList', 'EmployeeList'].includes(action)) {
            return res.status(201).send({
                notify: false,
                success: true,
                data,
                action,
                method
            });
        }
        if (['Fetch'].includes(action)) {
            const totalPage = Math.ceil(totalRecords / limit);
            return res.status(201).send({
                success,
                data: data,
                paginate: { totalPage, totalRecords },
                action,
                method
            });
        }
    } catch (error) {
        return res.status(401).send({
            data: [],
            paginate: {},
            error: `${error}`
        });
    }
};

export {
    performScheduleVisitorAction
};

