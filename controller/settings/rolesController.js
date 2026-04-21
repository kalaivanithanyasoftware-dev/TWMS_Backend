import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performRolesAction = async (req, res) => {

    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'Roles',
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body
        });
        const { success, error, results } = response

        const [data = []] = results
        if (!success) return res.status(401).send({
            notify: true,
            success,
            message: errorMessages.somethingWentWrong,
            errorMessage: `${error}`,
            action, method
        });

        if (['Add', 'Update', 'Delete', 'StatusUpdate', 'UpdateScreenPosition', 'UpdateHomePage', 'UpdateScreenRights', 'UpdateScreenMenus', 'UpdateColumnsPermission', 'UpdateColumnOrderByRole'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                data,
                action, method
            });
            return res.status(201).send({ notify: false, success, message: 'success', data, action, method });
        }
        if (['FetchDatasetsByScreen', 'FetchColumnsByScreenRole', 'RolesList'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (action === 'FetchScreenRightsByRole') {
            const screenMenusList = results[1] || [];
            const plantAccess = results[2] || [];
            return res.status(201).send({
                notify: false, success,
                screenAccess: data.map(obj => ({
                    ...obj,
                    granted_permissions: obj.granted_permissions.split(',').filter(Boolean),
                    required_permissions: obj.required_permissions.split(',').filter(Boolean)
                })),
                screenMenusList,
                plantAccess,
                action,
                method
            });
        }
        if (action === 'FetchScreenRights') {
            return res.status(201).send({
                success,
                data: data.map(obj => {
                    const permissions = obj.permissions.split(',').map(Number).filter(Boolean)
                    const granted_permissions = obj.granted_permissions.split(',').map(Number).filter(Boolean)
                    return {
                        ...obj,
                        permissions: permissions.map(id => ({ id, checked: granted_permissions.includes(id) ? true : false })),
                        permision_name: obj.permision_name.split(',').filter(Boolean)
                    }
                }) || [], action, method
            });
        }
        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};

export { performRolesAction };