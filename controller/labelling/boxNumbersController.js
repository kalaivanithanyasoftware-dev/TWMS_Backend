import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performBoxNumbersActions = async (req, res) => {
    try {
        const { action, method } = req.body;
        const response = (await executeSP({
            spName: 'BoxNumbers',
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body
        })) || {}

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

        if (['Add'].includes(action)) {
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
        if (action === 'Fetch') {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}
export { performBoxNumbersActions }