import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";
import fs from "fs"
const performOBD542ReversalAction = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'OBD542Reversal',
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
        if (error) return res.status(201).send({
            notify: true,
            success: false,
            error: true,
            message: error,
            action, method
        })
        if (['StorageLocationList'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (action === 'ReverseOBD542') {
            const { 0: { fileName = '' } } = results[1]
            const {
                INWARD: {
                    local_542_CSVPath, local_542_TxTPath, remote_542_CSVPath, remote_542_TxTPath,
                    headers: { I_542_CSV, I_542_TXT }
                }
            } = getSapFilePaths(fileName)

            // File creation
            await safeRun(() => {
                if (!fs.existsSync(local_542_CSVPath)) fs.writeFileSync(local_542_CSVPath, I_542_CSV, "utf8");
            }, "Write 542 CSV");

            await safeRun(() => {
                if (!fs.existsSync(local_542_TxTPath)) fs.writeFileSync(local_542_TxTPath, I_542_TXT, "utf8");
            }, "Write 542 TXT");

            // Data prep
            const filedata = data.map(obj => {
                const { docDate, postingDate, materialSlip, headerText, plant, stloc, toStorageLocation, materialDocNo, vendorcode, material, quantity, serialno } = obj;
                return [docDate, postingDate, materialSlip, headerText, plant, stloc, toStorageLocation, materialDocNo, vendorcode, material, quantity, serialno];
            })
            // Append to files
            await safeRun(() => appendRowsToCSV(local_542_CSVPath, filedata), "Append 542 CSV");
            await safeRun(() => appendRowsToTxt(local_542_TxTPath, filedata), "Append 542 TXT");

            // FTP Uploads
            await safeRun(() => uploadToFTP(local_542_TxTPath, remote_542_TxTPath), "Upload 542 TXT");
            await safeRun(() => uploadToFTP(local_542_CSVPath, remote_542_CSVPath), "Upload 542 CSV");
        }
        if (action === 'FetchOBD542ReversalDetails') {
            return res.status(201).send({
                notify: false, success, message: 'success',
                OBDDetails: data,
                ReelsInfo: results[1] || [],
                action,
                method
            });
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
export { performOBD542ReversalAction }