import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performDeliveryChellanActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        let uploadinvoicename = null
        if (req.files) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const uploadinvoice = req.files.uploadinvoice || ''
            uploadinvoicename = 'docs/invoice/' + uniqueSuffix + uploadinvoice.name
            uploadinvoice.mv('./assets/docs/invoice/' + uniqueSuffix + uploadinvoice.name)
        }

        const response = await executeSP({
            spName: 'DeliveryChellan',
            userDetails: req.userDetails,
            headers: req.headers,
            body: {
                ...req.body,
                plannoArr: req.body.plannoArr && Array.isArray(req.body.plannoArr) ? req.body.plannoArr : req.body.plannoArr && JSON.parse(req.body.plannoArr),
                uploadinvoice: uploadinvoicename
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
        if (['PlannoValidate'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                data,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: true, success, data, message: 'success', action, method });
        }
        if (['Update', 'UpdateReceivedDate'].includes(action)) {
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
    performDeliveryChellanActions
}