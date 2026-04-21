import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";
import fs from "fs"
const performReverseGRNAction = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'ReverseGRN',
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
                method
            });
        }
        if (action === 'ReverseGRN') {
            const { 0: { fileName = '' } } = data[0]
            const {
                INWARD: {
                    local_102_CSVPath, local_102_TxTPath, remote_102_CSVPath, remote_102_TxTPath, // 102
                    headers: { I_102_CSV, I_102_TXT }
                }
            } = getSapFilePaths(fileName);

            // 102 file creation
            await safeRun(() => {
                if (!fs.existsSync(local_102_CSVPath)) fs.writeFileSync(local_102_CSVPath, I_102_CSV, "utf8");
            }, "Write 102 CSV");

            await safeRun(() => {
                if (!fs.existsSync(local_102_TxTPath)) fs.writeFileSync(local_102_TxTPath, I_102_TXT, "utf8");
            }, "Write 102 TXT");

            // Data preparation
            const I_102 = data.map(obj => {
                const { grn_number, year, headerText } = obj;
                return [grn_number, year, headerText]
            });
            // Append rows
            await safeRun(() => appendRowsToCSV(local_102_CSVPath, I_102), "Append 102 CSV");
            await safeRun(() => appendRowsToTxt(local_102_TxTPath, I_102), "Append 102 TXT");

            // Upload to FTP
            await safeRun(() => uploadToFTP(local_102_CSVPath, remote_102_CSVPath), "Upload 102 CSV");
            await safeRun(() => uploadToFTP(local_102_TxTPath, remote_102_TxTPath), "Upload 102 TXT");
            return res.status(201).send({ notify: false, success, message: 'Success', data, action, method });
        }
        if (action === 'FetchGRNDetails') {
            return res.status(201).send({ notify: false, success, message: 'success', data, action, method });
        }
        if (action === 'Fetch') {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }

        return res.status(201).send({ notify: false, success, data, message: 'Invalid Action', action, method });

    } catch (error) {
        return res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};
export { performReverseGRNAction }