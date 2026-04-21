import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performAuditingActions = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'Auditing',
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
            action,
            method
        })
        if (action === 'FetchLabelToEdit') {
            if (error) return res.status(201).send({
                data: [],
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ success, data: data[0] || {}, action, method });
        }
        if (action === 'ScanDeliveryOrder') {
            if (error) return res.status(201).send({
                data: [],
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ success, data, action, method });
        }

        if (['MPNList', 'TPNList', 'StorageLocationsList', 'LocationList', 'SuppliersList', 'ValidateLabelData', 'FetchReelsByLocation', 'MakeList'].includes(action)) {

            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action,
                method
            })
            return res.status(201).send({ success, data, headers: results[1] || [], action, method });
        }
        if (['Create', 'Edit', 'Print', 'Remove', 'DraftUpdate', 'CreateBulkLabels', 'CycleCount'].includes(action)) {

            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action,
                method
            })
            return res.status(201).send({
                notify: false, success,
                data, // Using Only When Create
                message: 'success', action, method
            });
        }
        if (action === 'Fetch') {
            // const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, action, method });
        }
        return res.status(201).send({ notify: false, success, data, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


export { performAuditingActions }