import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performLocationAction = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'Location',
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
        })
        if (['Add', 'Upload', 'Update', 'Delete', 'StatusUpdate'].includes(action)) {
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
        if (['PlantCode', 'StorageLocation', 'LocationType'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


export { performLocationAction };
