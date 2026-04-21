import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

// DO Status
// 1 = Plan Assigned (DO Generated)
// 2 = Picked
// 22 Partially Picked
// 3 = Partially Boxed
// 4 = Box Done (Fully Boxed)
// 5 = Box Labeling Done
// 6 = FQA Pre-Inspection Done
// 7 = FQA Confirmation Done  
// 77 = FQA Rejected  
// 777 = FQC HOLD Done
// 8 = Outward Verification Done
// 99 = Stock Transfer Order Done
// 100 = STO Invoice Done
// 9 = OBD Documentation  Done
// 10 = LOgistics Docs  Done
// 11 = Loading Confirmation done
// 12 = E-Way bill done
// 13 = Ship Out Done
// 14 = Acknowledgement Fully Done
// 15 = Acknowledgement Partially Done (Acknowledgement Report) / Partially Rejected (Discrepancy List)
// 16 = Acknowledgement Fully Rejected (Fully Discrepancy)
// 17 = Tejas Discripancy Update Done (Acknowledge Rejected Materials)
// 18 = Supplier Discrepancy Done (Supplier Acknowledged for Rejected Materials After Tejas Discrepancy Done)


// Split Up (Is Out) Status
// null OR 0 = Yet to Be Picked
// 1 = Picked
// 2 = Box Done
// 3 = Box Labeling Done
// 4 = FQA Pre-Inspection Done
// 5 = FQA Confirmation Done
// 6 = FQA rejected
// 7 outward verification done
//  stock transfer order
//




const performBoxLabellingActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'BoxLabelling',
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
        if (['CompleteLabel'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: true, success, message: 'success', action, method });
        }

        if (action === 'GetBoxLabellingList') {
            if (!data[0] || !results[1]?.length) {
                return res.status(401).send({
                    notify: true,
                    success: false,
                    message: errorMessages.scanValidDelivery,
                    doDetails: {},
                    boxDetails: [],
                    action,
                    method
                });
            }
            return res.status(201).send({
                notify: false,
                success,
                doDetails: data || [],
                boxDetails: results[1] || [],
                action,
                method
            });
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
    performBoxLabellingActions
}