import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performLabelPrintActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'LabelGRPrint',
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
        if (['FetchByLabelIds', 'SerialNumbers'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
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
export { performLabelPrintActions }