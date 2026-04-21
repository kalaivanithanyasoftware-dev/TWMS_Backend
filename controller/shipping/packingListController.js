import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performPackingListAction = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: "PackingList",
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body,
        });

        const { success, error, results } = response;

        // Default structure
        const [data = []] = results;

        if (!success) {
            return res.status(500).send({
                notify: true,
                success,
                message: errorMessages.somethingWentWrong,
                errorMessage: `${error}`,
                action,
                method,
            });
        }


        if (action === "UpdatePackingList") {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(200).send({
                success,
                data,
                action,
                method,
            });
        }


        if (action === "Fetch") {
            const paginate = results?.[1]?.[0] || {};
            return res.status(200).send({
                success,
                data,
                paginate,
                action,
                method,
            });
        }

        if (action === "PlanNoTPNReelInfo") {
            return res.status(200).send({
                success,
                data,
                action,
                method,
            });
        }

        if (['SupplierList'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }

        // Unknown action
        return res.status(400).send({
            notify: true,
            success: false,
            message: "Invalid Action",
            action,
            method,
        });

    } catch (error) {
        return res.status(500).send({
            data: [],
            paginate: {},
            error: `${error}`,
            action,
            method,
        });
    }
};

export { performPackingListAction };
