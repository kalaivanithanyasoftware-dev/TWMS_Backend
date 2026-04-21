import fs from "fs"
import { sql, poolPromise } from "../../config/db.js";
import { executeSP, executeTransaction } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performUserAction = async (req, res) => {
    const { action, method, oldprofile } = req.body;
    try {
        let profilename = null
        if (req.files) {
            if (action === 'Update' && oldprofile && fs.existsSync('assets/images/users/' + oldprofile)) {
                fs.unlinkSync('assets/images/users/' + oldprofile)
            }

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

            const profile = req.files.profile || ''
            profilename = 'images/users/' + uniqueSuffix + profile.name
            profile.mv('./assets/images/users/' + uniqueSuffix + profile.name)
        }
        const response = await executeSP({
            spName: 'Users',
            userDetails: req.userDetails,
            headers: req.headers,
            body: { ...req.body, profile: profilename }
        });
        const { success, error, results } = response

        const [data = []] = results
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
        if (['UsersList', 'RolesList', 'PlantCodeList', 'SuppliersList', 'DepartmentsList'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, data, message: 'Invalid Type', data: [], action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}

const getCSVData = async (req, res) => {
    try {
        const route = req.headers.route
        const { MType, datasetKey } = req.body
        const response = await executeSP({
            spName: 'Export',
            userDetails: req.userDetails,
            headers: req.headers,
            body: { ...req.body, route, datasetKey: MType || datasetKey }
        });
        const { success, error, results } = response || {};
        const [headers = [], data = []] = results || [];

        return res.status(201).send({ success, headers, data, error });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}
const updateProfile = async (req, res) => {
    const { id: userid, usertype, oldprofile, roleid } = req.userDetails.user
    try {
        const { id, password, oldpassword } = req.body
        const { results: [[{ count = 0 } = {}] = []] = [] } = await executeTransaction([{
            query: 'SELECT COUNT(id) count FROM ms_user WHERE id=@userid AND password=@password AND del_status=0',
            params: [
                { name: 'password', type: sql.NVarChar, value: oldpassword },
                { name: 'userid', type: sql.Int, value: userid },
            ]
        }]) || {}
        if (!count) {
            return res.status(401).send({ success: false, data: 'Old password is incorrect' })
        }
        if (oldpassword == password) {
            return res.status(401).send({ success: false, data: 'New password cannot be same as old password' })
        }
        let profilename = null
        if (req.files) {
            if (oldprofile && fs.existsSync('assets/images/users/' + oldprofile)) {
                fs.unlinkSync('assets/images/users/' + oldprofile)
            }

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

            const profile = req.files.profile || ''
            profilename = 'images/users/' + uniqueSuffix + profile.name
            profile.mv('./assets/images/users/' + uniqueSuffix + profile.name)
        }

        let query = ``
        if (usertype === 'Tejas') {
            query = `UPDATE ms_user SET password=@password,profile=CASE WHEN @profile IS NULL THEN profile ELSE @profile END,updatedby=@updatedby,updateddate=GETDATE() WHERE id=@id;`
        } else if (usertype === 'Supplier') {
            query = `UPDATE ms_supplier SET password=@password,profile=CASE WHEN @profile IS NULL THEN profile ELSE @profile END,updatedby=@updatedby,updateddate=GETDATE() WHERE id=@id;`

        } else {
            query = ``
        }
        const pool = await poolPromise;

        let activity_type = 'Profile Updated'
        let activity_data = 'User has Updated his Profile'
        await pool.request()
            .input('id', sql.Int, id)
            .input('updatedby', sql.Int, userid)
            .input('password', sql.NVarChar, password)
            .input('profile', sql.NVarChar, profilename || null)
            .input('userid', sql.Int, userid)
            .input('roleid', sql.Int, roleid)
            .input('activity_type', sql.NVarChar, activity_type)
            .input('activity_data', sql.NVarChar, activity_data)
            .query(`${query} INSERT INTO user_activity_log (userid,roleid,activity_type,activity_data) VALUES (@userid,@roleid,@activity_type,@activity_data);`);
        res.status(201).send({ data: 'success' })
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}

export { performUserAction, getCSVData, updateProfile }