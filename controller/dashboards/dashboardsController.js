import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performDashboardsActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'Dashboard',
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
        if (['SelfLifeExpiryChart', 'SAPvsPhysicalStockChart'].includes(action)) {
            return res.status(201).send({ notify: false, data: data[0], success, message: 'success', action, method });
        }
        if (action === 'TruckWiseTATChart') {
            return res.status(201).send({ notify: false, success, chart: data, truckData: results[1], action, method });
        }
        return res.status(201).send({ notify: false, success, data, action, method });
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}


export { performDashboardsActions }