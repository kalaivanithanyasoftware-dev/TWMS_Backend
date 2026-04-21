
import xlsx from "node-xlsx";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performPutawayAction = async (req, res) => {
    const { action, method } = req.body;

    try {
        let excelJSONArray = []
        if (req.files) {
            const exceFile = req.files.excelfile
            const workSheetsFromBuffer = xlsx.parse(exceFile.data);

            workSheetsFromBuffer[0].data.shift();
            excelJSONArray = workSheetsFromBuffer[0].data.filter(arr => arr.length > 0)
            // console.log(excelJSONArray)
            // return res.status(201).send({data:'success'})
            // console.log(excelJSONArray);

        }
        const response = await executeSP({
            spName: 'Putaway',
            userDetails: req.userDetails,
            headers: req.headers,
            body: { ...req.body, excelJSONArray }
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

        if (['MoveToInventory', 'MoveToInventoryFromExcel', 'MoveBoxToInventory'].includes(action)) {
            if (error) {
                return res.status(201).send({
                    notify: true,
                    success: false,
                    error: true,
                    data,
                    message: error,
                    action,
                    method,
                });
            }
            return res.status(201).send({ notify: false, success, data, message: 'success', action, method });
        }
        if (['GetPartTypes', 'MixedLocations', 'Locations'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }

        return res.status(201).send({ notify: false, success, data, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
}
export { performPutawayAction }