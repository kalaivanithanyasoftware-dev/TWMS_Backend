import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";
import fs from "fs";

const performOutwardVerificationActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'OutwardVerification',
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
        if (error) return res.status(201).send({
            notify: true,
            success: false,
            error: true,
            message: error,
            action, method
        })
        if (['CompleteOutwardVerification'].includes(action)) {
            const { 0: { fileName = '' } = {} } = results[3] || []
            if (data.length) {
                const {
                    INWARD: {
                        local_313_CSVPath, local_313_TxTPath, remote_313_CSVPath, remote_313_TxTPath,
                        headers: { I_313_CSV, I_313_TXT }
                    }
                } = getSapFilePaths(fileName);

                // 102 file creation 
                await safeRun(() => {
                    if (!fs.existsSync(local_313_CSVPath)) fs.writeFileSync(local_313_CSVPath, I_313_CSV, "utf8");
                }, "Write 313 CSV");

                await safeRun(() => {
                    if (!fs.existsSync(local_313_TxTPath)) fs.writeFileSync(local_313_TxTPath, I_313_TXT, "utf8");
                }, "Write 313 TXT");
                // Data preparation
                const filedata = data.map(obj => {
                    const { mr, itemNo, tpn, picked_qty, serialno } = obj;
                    return [mr, itemNo, tpn, picked_qty, serialno];
                })
                // Append rows
                await safeRun(() => appendRowsToCSV(local_313_CSVPath, filedata), "Append 313 CSV");
                await safeRun(() => appendRowsToTxt(local_313_TxTPath, filedata), "Append 313 TXT");

                // FTP Uploads
                await safeRun(() => uploadToFTP(local_313_TxTPath, remote_313_TxTPath), "Upload 313 TXT");
                await safeRun(() => uploadToFTP(local_313_CSVPath, remote_313_CSVPath), "Upload 313 CSV");
            }
            if ((results?.[1] || []).length) {
                const {
                    INWARD: {
                        local_301_CSVPath, local_301_TxTPath, remote_301_CSVPath, remote_301_TxTPath,
                        headers: { I_301_CSV, I_301_TXT }
                    }
                } = getSapFilePaths();

                // 102 file creation 
                await safeRun(() => {
                    if (!fs.existsSync(local_301_CSVPath)) fs.writeFileSync(local_301_CSVPath, I_301_CSV, "utf8");
                }, "Write 301 CSV");

                await safeRun(() => {
                    if (!fs.existsSync(local_301_TxTPath)) fs.writeFileSync(local_301_TxTPath, I_301_TXT, "utf8");
                }, "Write 301 TXT");
                // Data preparation
                const filedata = (results?.[1] || []).map(obj => {
                    const { materialSlip, headerText, PlantCode, LocationName, GLAcct, docDate, postingDate, receivingPlant, ToLocationName, tpn, picked_qty, serialno } = obj;
                    return [materialSlip, headerText, PlantCode, LocationName, GLAcct, docDate, postingDate, receivingPlant, ToLocationName, tpn, picked_qty, serialno];
                })
                // Append rows
                await safeRun(() => appendRowsToCSV(local_301_CSVPath, filedata), "Append 301 CSV");
                await safeRun(() => appendRowsToTxt(local_301_TxTPath, filedata), "Append 301 TXT");

                // FTP Uploads
                await safeRun(() => uploadToFTP(local_301_TxTPath, remote_301_TxTPath), "Upload 301 TXT");
                await safeRun(() => uploadToFTP(local_301_CSVPath, remote_301_CSVPath), "Upload 301 CSV");
            }

            if (results?.[2]?.length) {
                const {
                    INWARD: {
                        local_541_CSVPath, local_541_TxTPath, remote_541_CSVPath, remote_541_TxTPath,
                        headers: { I_541_CSV, I_541_TXT }
                    }
                } = getSapFilePaths();

                // --- safeRun helper (reuse this everywhere) ---
                const safeRun = async (fn, label) => {
                    try {
                        await fn();
                    } catch (err) {
                        console.error(`⚠️ ${label} failed:`, err.message);
                    }
                };

                // 541 file creation
                await safeRun(() => {
                    if (!fs.existsSync(local_541_CSVPath)) fs.writeFileSync(local_541_CSVPath, I_541_CSV, "utf8");
                }, "Write 541 CSV");

                await safeRun(() => {
                    if (!fs.existsSync(local_541_TxTPath)) fs.writeFileSync(local_541_TxTPath, I_541_TXT, "utf8");
                }, "Write 541 TXT");

                // Data preparation
                const filedata = (results?.[2] || []).map(obj => {
                    const { planno, materialSlip, headerText, plant, STLoc, reasonforMoment, vendorno, pono, poitem, material, quantity, tpnsSTLoc, uom, issued_qty, serialno } = obj;
                    return [planno, materialSlip, headerText, plant, STLoc, reasonforMoment, vendorno, pono, poitem, material, quantity, tpnsSTLoc, uom, issued_qty, serialno];
                });

                // Append rows
                await safeRun(() => appendRowsToCSV(local_541_CSVPath, filedata), "Append 541 CSV");
                await safeRun(() => appendRowsToTxt(local_541_TxTPath, filedata), "Append 541 TXT");

                // Upload to FTP
                await safeRun(() => uploadToFTP(local_541_CSVPath, remote_541_CSVPath), "Upload 541 CSV");
                await safeRun(() => uploadToFTP(local_541_TxTPath, remote_541_TxTPath), "Upload 541 TXT");
            }
            return res.status(201).send({ notify: true, success, message: 'success', action, method });
        }

        if (['GetDeliveryOrderInfo'].includes(action)) {
            if (!data[0] || !results[1]?.length) {
                return res.status(401).send({
                    notify: true,
                    success: false,
                    message: errorMessages.scanValidDelivery,
                    boxDetails: [],
                    doDetails: [],
                    reelInfo: [],
                    action,
                    method
                });
            }
            return res.status(201).send({
                notify: false,
                success,
                doDetails: data,
                boxDetails: results[1] || [],
                reelInfo: results[2] || [],
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
    performOutwardVerificationActions
}