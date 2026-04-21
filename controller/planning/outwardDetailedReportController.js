import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performOutwardDetailedReportActions = async (req, res) => {
    const { plantid } = req.userDetails.user;
    const {
        totalentry: limit,
        pageNo,
        search = '',
        action,
        method,
        planno
    } = req.body;

    const offSet = (pageNo - 1) * limit;

    try {
        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = await executeSP([
            {
                sp: `OutwardDetailedReport`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search?.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action },

                    { name: 'plantid', type: sql.Int, value: plantid },
                    { name: 'planno', type: sql.NVarChar, value: planno }
                ],
            },
        ]);

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

        if (action === 'PlanNoReelInfo') {
            return res.status(201).send({ notify: false, success, data, action, method });
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

export {
    performOutwardDetailedReportActions
}