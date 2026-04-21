import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performInventoryDetailedReportAction = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'InventoryDetailedReport',
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body
        });
        const { success, error, results } = response

        const [data = []] = results
        if (!success) {
            return res.status(401).send({
                notify: true,
                success,
                message: errorMessages.somethingWentWrong,
                errorMessage: `${error}`,
                action,
                method,
            });
        }
        if (['FetchLabelDetails', 'FetchLabelToFind'].includes(action)) {
            if (error) return res.status(201).send({
                data: [],
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, data: data[0] || {}, message: 'success', action, method });
        }
        if (['MoveToInventory', 'MoveBoxToInventory', 'SafeMaterial'].includes(action)) {
            if (error) {
                return res.status(201).send({
                    notify: true,
                    success: false,
                    error: true,
                    data,
                    message: error,
                    action,
                    method,
                });
            }
            return res.status(201).send({ notify: false, success, data, message: 'success', action, method });
        }
        if (['GetPartTypes', 'StorageLocations', 'SerialNumbers'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            const totalQtys = results[2][0] || {};
            return res.status(201).send({ success, data, paginate, ...totalQtys, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
}


const performInventoryReportAction = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'InventoryReport',
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body
        });
        const { success, error, results } = response

        const [data = []] = results
        if (!success) {
            return res.status(401).send({
                notify: true,
                success,
                message: errorMessages.somethingWentWrong,
                errorMessage: `${error}`,
                action,
                method,
            });
        }
        if (['Delete'].includes(action)) {
            if (error) {
                return res.status(201).send({
                    notify: true,
                    success: false,
                    error: true,
                    message: error,
                    action,
                    method,
                });
            }
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }


        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            const totalQtys = results[2][0] || {};
            return res.status(201).send({ success, data, paginate, ...totalQtys, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
}

export { performInventoryDetailedReportAction, performInventoryReportAction }