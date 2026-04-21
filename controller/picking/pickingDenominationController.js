import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performPickingDenominationActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'PickingDenomination',
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
                method,
            });
        }
        if (['UpdateOutStatus', 'RemoveDraft', 'RemoveTPNFromDO', 'PickSerialNo', 'RemoveSerialNo'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }

        if (action === 'GetPickingList') {
            if (!data[0]) {
                return res.status(201).send({
                    notify: true,
                    success: false,
                    message: errorMessages.scanValidDelivery,
                    doDetails: [],
                    drafts: [],
                    action,
                    method
                });
            }
            return res.status(201).send({
                notify: false,
                success,
                doDetails: data || [],
                drafts: results[1] || [],
                action,
                method
            });
        }
        if (action === 'PickDraft') {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                data: {},
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, data: data[0] || {}, action, method });
        }
        if (action === 'GetReelInfo') {
            return res.status(201).send({ notify: false, success, data, action, method });
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
    performPickingDenominationActions
}