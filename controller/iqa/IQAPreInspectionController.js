import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import fs from "fs"
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";

const performIQAPreInspectionActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'IQAPreInspection',
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

        if (['SerialNumbers'].includes(action)) {
            return res.status(201).send({ success, data, action, method });
        }
        if (['IQAPreInsConfirm', 'IQAPreInsSkip'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action,
                method
            })
            if (action === 'IQAPreInsSkip') {
                const { 0: { fileName = '' } } = results[1]
                const {
                    INWARD: {
                        local_321_CSVPath, local_321_TxTPath, remote_321_CSVPath, remote_321_TxTPath,
                        headers: { I_321_CSV, I_321_TXT }
                    }
                } = getSapFilePaths(fileName);

                // 321 file creation
                await safeRun(() => {
                    if (!fs.existsSync(local_321_CSVPath)) fs.writeFileSync(local_321_CSVPath, I_321_CSV, "utf8");
                }, "Write 321 CSV");

                await safeRun(() => {
                    if (!fs.existsSync(local_321_TxTPath)) fs.writeFileSync(local_321_TxTPath, I_321_TXT, "utf8");
                }, "Write 321 TXT");

                // Data preparation
                const filedata = data.map(obj => {
                    const { materialDoc, materialNo, quantity } = obj;
                    return [materialDoc, materialNo, quantity];
                });

                // Append rows
                await safeRun(() => appendRowsToCSV(local_321_CSVPath, filedata), "Append 321 CSV");
                await safeRun(() => appendRowsToTxt(local_321_TxTPath, filedata), "Append 321 TXT");

                // Upload to FTP
                await safeRun(() => uploadToFTP(local_321_CSVPath, remote_321_CSVPath), "Upload 321 CSV");
                await safeRun(() => uploadToFTP(local_321_TxTPath, remote_321_TxTPath), "Upload 321 TXT");
            }
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }
        if (action === 'Fetch') {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, data, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}

export { performIQAPreInspectionActions }