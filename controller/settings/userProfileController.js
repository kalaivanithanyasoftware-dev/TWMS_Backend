import fs from "fs"
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performUserProfileAction = async (req, res) => {

    const { action, method, oldprofile } = req.body;
    try {
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
        const response = await executeSP({
            spName: 'UserProfile',
            userDetails: req.userDetails,
            headers: req.headers,
            body: { ...req.body, profil: profilename }
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
        if (['UpdateProfile'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }
        if (['UserProfile'].includes(action)) {
            return res.status(201).send({
                notify: false, success,
                userDetails: data[0] || {},
                loggedinDevices: results[1] || [],
                action,
                method
            });
        }
        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, data, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


export { performUserProfileAction }