import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";
import fs from "fs"

const performlocationTransferActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'LocationTransfer',
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
        if (['LocationTransfer'].includes(action)) {
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

            const { 0: { fileName = '' } } = results[1]
            const {
                INWARD: {
                    local_311_CSVPath, local_311_TxTPath, remote_311_CSVPath, remote_311_TxTPath,

                    headers: {
                        I_311_CSV, I_311_TXT
                    }
                }
            } = getSapFilePaths()
            if (req.body.transferType === 'StorageLocation') {
                const filedata = data.map(obj => {
                    const { materialslip, HeaderText, MaterialNo, plant, fromSTLoc, toSTLoc, quantity, serialno } = obj;
                    return [materialslip, HeaderText, MaterialNo, plant, fromSTLoc, toSTLoc, quantity, serialno];
                })
                // File creation
                await safeRun(() => {
                    if (!fs.existsSync(local_311_CSVPath)) fs.writeFileSync(local_311_CSVPath, I_311_CSV, "utf8");
                }, "Write 311 CSV");

                await safeRun(() => {
                    if (!fs.existsSync(local_311_TxTPath)) fs.writeFileSync(local_311_TxTPath, I_311_TXT, "utf8");
                }, "Write 311 TXT");

                await safeRun(() => appendRowsToCSV(local_311_CSVPath, filedata), "Append 311 CSV");
                await safeRun(() => appendRowsToTxt(local_311_TxTPath, filedata), "Append 311 TXT");

                await safeRun(() => uploadToFTP(local_311_TxTPath, remote_311_TxTPath), "Upload 311 TXT");
                await safeRun(() => uploadToFTP(local_311_CSVPath, remote_311_CSVPath), "Upload 311 CSV");

            }
            // ✅ Final response still success (even if some steps failed) 
            return res.status(201).send({ notify: false, success, data, message: 'success', action, method });
        }
        if (['PlantCodeList', 'GetFromInternalLocations', 'GetToInternalLocations', 'GetFromLocationsByPlant', 'GetToLocationsByPlant', 'StorageLocationList', 'GetFromInternalLocationsBySTLoc', 'GetToInternalLocationsBySTLoc'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (['Fetch'].includes(action)) {
            return res.status(201).send({ success, reelsInfo: data, tpnWiseData: results[1] || [], action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
}
export { performlocationTransferActions }