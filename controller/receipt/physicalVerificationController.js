import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";
import fs from "fs"

const performPhysicalVerificationAction = async (req, res) => {

    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'PhysicalVerification',
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

        if (['AddPhysicalVerification'].includes(action)) {
            if (error) {
                return res.status(201).send({
                    notify: true,
                    success: false,
                    error: true,
                    message: error,
                    action,
                    method
                });
            }
            const { 0: { fileName = '' } } = results[2]

            const {
                INWARD: {
                    local_101_CSVPath, local_101_TxTPath, remote_101_CSVPath, remote_101_TxTPath, // 101  
                    local_MIRO_CSVPath, local_MIRO_TxTPath, remote_MIRO_TxTPath, remote_MIRO_CSVPath,
                    headers: { I_101_CSV, I_101_TXT, I_MIRO_CSV, I_MIRO_TXT }
                }
            } = getSapFilePaths(fileName);

            // 101 file creation
            await safeRun(() => {
                if (!fs.existsSync(local_101_CSVPath)) fs.writeFileSync(local_101_CSVPath, I_101_CSV, "utf8");
            }, "Write 101 CSV");

            await safeRun(() => {
                if (!fs.existsSync(local_101_TxTPath)) fs.writeFileSync(local_101_TxTPath, I_101_TXT, "utf8");
            }, "Write 101 TXT");

            // Data preparation
            const I_101 = data.map(obj => {
                const { PONumber, invoiceNo, SAPDMRNumber, itemNo, tpn_number, total_quantity, serialno, upload_doc } = obj;
                let filePath = ''
                if (upload_doc?.startsWith('docs')) {
                    // filePath = upload_doc?.startsWith('docs') ? req.headers.origin + '/assets/' + upload_doc : ''
                    filePath = 'ftp://10.108.5.13/AAFEES/101 Files/' + upload_doc.split('/').pop()
                }
                return [PONumber, invoiceNo, invoiceNo, SAPDMRNumber, itemNo, tpn_number, total_quantity, serialno, filePath];
            })
            // Append rows
            await safeRun(() => appendRowsToCSV(local_101_CSVPath, I_101), "Append 101 CSV");
            await safeRun(() => appendRowsToTxt(local_101_TxTPath, I_101), "Append 101 TXT");

            // Upload to FTP
            await safeRun(() => uploadToFTP(local_101_CSVPath, remote_101_CSVPath), "Upload 101 CSV");
            await safeRun(() => uploadToFTP(local_101_TxTPath, remote_101_TxTPath), "Upload 101 TXT");

            if (results?.[1]?.length) {
                // DMR file creation
                await safeRun(() => {
                    if (!fs.existsSync(local_MIRO_CSVPath)) fs.writeFileSync(local_MIRO_CSVPath, I_MIRO_CSV, "utf8");
                }, "Write 101 CSV");

                await safeRun(() => {
                    if (!fs.existsSync(local_MIRO_TxTPath)) fs.writeFileSync(local_MIRO_TxTPath, I_MIRO_TXT, "utf8");
                }, "Write 101 TXT");

                const I_MIRO = (results?.[1] || []).map(obj => {
                    const { PONumber, ReferenceText, BOENumber, BOEDate, HAWBNumber, HAWBDate, ADCode, PortNo, PortDate, POItemNo, BCDAmount, SWSAmount, Qty, AssessbleValue } = obj
                    return [PONumber, ReferenceText, BOENumber, BOEDate, HAWBNumber, HAWBDate, ADCode, PortNo, PortDate, POItemNo, BCDAmount, SWSAmount, Qty, AssessbleValue]
                })

                // MIRO 
                await safeRun(() => appendRowsToCSV(local_MIRO_CSVPath, I_MIRO), "Append MIRO CSV");
                await safeRun(() => appendRowsToTxt(local_MIRO_TxTPath, I_MIRO), "Append MIRO TXT");

                // Upload To FTP
                await safeRun(() => uploadToFTP(local_MIRO_CSVPath, remote_MIRO_CSVPath), "Upload MIRO CSV");
                await safeRun(() => uploadToFTP(local_MIRO_TxTPath, remote_MIRO_TxTPath), "Upload MIRO TXT");
            }

            return res.status(201).send({ notify: false, success, message: 'Success', action, method });
        }
        if (['RSDetails', 'MPNList', 'StorageLocationsList', 'SecuritySerialNumbers', 'UsersList'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Action', action, method });

    } catch (error) {
        return res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};

const performInwardPrintAction = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'InwardPrint',
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
        if (['InwardPrintData'].includes(action)) {
            return res.status(201).send({
                notify: false, success,
                data,
                truck_details: results[1][0] || {},
                action, method

            });
        }
        if (action === 'Fetch') {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Action', action, method });

    } catch (error) {
        return res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};


const performBoxLabelPrintAction = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'BoxLabelPrint',
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
        if (['Delete'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
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
export { performPhysicalVerificationAction, performInwardPrintAction, performBoxLabelPrintAction }