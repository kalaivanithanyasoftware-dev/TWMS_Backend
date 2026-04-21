import { executeSP } from "../../custom/mssqlExecution.js";

const performDailyStatusReportActions = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'DailyStatusReport',
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body
        });
        const { success, results } = response || {};
        const [data = []] = results || [];

        if (action === 'Fetch') {
            return res.status(201).send({ success, data, action, method });
        }
        return res.status(201).send({ notify: false, success, data, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}

export { performDailyStatusReportActions }