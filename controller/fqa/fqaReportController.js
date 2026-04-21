import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performFQAReportActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'FQAReport',
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
        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};

const performFQAQuarantineReportActions = async (req, res) => {
    const { globalPlant, plantid: userPlantid, id: userid, roleid } = req.userDetails.user;
    const {
        globalPlantId,
        plantid,
        totalentry: limit,
        pageNo,
        search = '',
        action,
        method
    } = req.body;

    const offSet = (pageNo - 1) * limit;

    try {
        // Other actions (non-Allocate)
        const response = await executeSP([
            {
                sp: `FQAQuarantineReport`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search?.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action },

                    { name: 'globalPlantId', type: sql.Int, value: globalPlantId },
                    { name: 'plantid', type: sql.Int, value: globalPlant ? plantid : userPlantid },

                    { name: 'userid', type: sql.Int, value: userid },
                    { name: 'roleid', type: sql.Int, value: roleid }
                ],
            },
        ]);
        const { success, error, results } = response
        const [data = [], [{ count: totalRecords = 0 } = {}] = []] = results

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
        if (['Fetch'].includes(action)) {
            const totalPage = Math.ceil(totalRecords / limit);
            return res.status(201).send({ success, data, paginate: { totalPage, totalRecords }, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};


const performFQARejectionReportActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'FQARejectionReport',
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
        if (['Update', 'Remove'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: true, success, message: 'success', action, method });
        }
        if (action === 'FetchLabel') {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ success, data: data[0] || {}, action, method });
        }

        if (['QuarantineLocations', 'FetchDrafts'].includes(action)) {
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
    performFQAReportActions,
    performFQAQuarantineReportActions,
    performFQARejectionReportActions
}

