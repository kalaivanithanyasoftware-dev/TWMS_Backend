import { config, sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";
// await new sql.ConnectionPool(config).connect().then(async pool => console.log(await pool.query(`select isnull(CONVERT(VARCHAR(10), HAWBDate, 29), ''), HAWBDate from inward_gate_entry`)));
const performInwardReportActions = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'InwardReport',
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

        if (action === 'Fetch') {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}

export { performInwardReportActions }