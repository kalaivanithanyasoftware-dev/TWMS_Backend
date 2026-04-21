import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performLabelGenerationActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'LabelGeneration',
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
        if (action === 'FetchLabelToSplit') {
            if (error) return res.status(201).send({
                data: [],
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ success, data: data[0] || {}, lastSequence, action, method });
        }
        if (action === 'ValidateLabelData') {
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
        if (['Suppliers', 'AutoSuggestMake', 'ValidateLabelData', 'MakeList', 'FetchReelsFromOtherPlant'].includes(action)) {
            return res.status(201).send({ success, data, results: results, action, method });
        }
        if (['Add', 'Update'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action,
                method
            })
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }
        if (action === 'Fetch') {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, data, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}
export { performLabelGenerationActions }