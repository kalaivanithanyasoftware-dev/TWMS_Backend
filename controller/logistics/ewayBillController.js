import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performEWayBillActions = async (req, res) => {
    const { action, method } = req.body;

    try {

        let ewayBillDocumentName = null
        if (req.files) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const ewayBillDocument = req.files.ewayBillDocument || ''
            ewayBillDocumentName = 'docs/ewaybill/' + uniqueSuffix + ewayBillDocument.name
            ewayBillDocument.mv('./assets/docs/ewaybill/' + uniqueSuffix + ewayBillDocument.name)
        }
        const response = await executeSP({
            spName: 'EWayBill',
            userDetails: req.userDetails,
            headers: req.headers,
            body: {
                ...req.body,
                plannoArr: req.body.plannoArr && JSON.parse(req.body.plannoArr),
                ewayBillDocument: ewayBillDocumentName
            }
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
        if (['UpdateEWayBill'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: true, success, message: 'success', action, method });
        }

        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};

export {
    performEWayBillActions
}