import { executeSP } from "../../custom/mssqlExecution.js";

const performSAPAuditReportActions = async (req, res) => {
    const { action, method } = req.body;
    try {
        const route = req.headers.route
        const response = await executeSP({
            spName: 'SAPAuditReport',
            userDetails: req.userDetails,
            headers: req.headers,
            body: { ...req.body, route }
        });
        const { success, results } = response || {};
        const [headers = [], data = [], pagination = []] = results || [];

        if (action === 'Fetch') {
            // await new Promise(resolve => setTimeout(resolve, 20000));
            const paginate = pagination[0] || {};
            return res.status(201).send({ success, headers, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}
export { performSAPAuditReportActions }