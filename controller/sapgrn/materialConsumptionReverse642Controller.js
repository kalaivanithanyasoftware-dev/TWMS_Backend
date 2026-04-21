import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";
const performMaterialConsumptionReverse642Action = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'MaterialConsumptionReverse642',
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
                method
            });
        }
        if (action === 'ReverseConsumedMaterial') {
            return res.status(201).send({ notify: true, success, message: 'Success', data, action, method });
        }
        if (['MaterialDocNosList', 'FetchMaterialDocumentNos'].includes(action)) {
            return res.status(201).send({ notify: false, success, message: 'success', data, action, method });
        }
        if (action === 'Fetch') {
            return res.status(201).send({ success, data, action, method });
        }

        return res.status(201).send({ notify: false, success, data, message: 'Invalid Action', action, method });

    } catch (error) {
        return res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};
export { performMaterialConsumptionReverse642Action }