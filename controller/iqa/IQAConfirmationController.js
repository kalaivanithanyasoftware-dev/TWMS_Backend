import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import fs from "fs"
import path from "path"
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";

const performIQAConfirmationActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        let body = { ...req.body };

        // Handle FormData (file upload) for Confirm/Reject/ChecklistUpdate
        if (['Confirm', 'Reject', 'ChecklistUpdate'].includes(action)) {
            // Parse JSON string fields back to objects
            if (typeof body.ids === 'string') body.ids = JSON.parse(body.ids);
            if (typeof body.labels === 'string') body.labels = JSON.parse(body.labels);
            if (typeof body.checklists === 'string') body.checklists = JSON.parse(body.checklists);
            if (typeof body.measurements === 'string') body.measurements = JSON.parse(body.measurements);

            if (req.files) {
                const uploadDir = './assets/images/iqa/checklist/';
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

                // Process uploaded images per checklist item
                for (const checklist of body.checklists) {
                    const fileKey = `failedImage_${checklist.id}`;
                    if (req.files[fileKey]) {
                        let files = req.files[fileKey];
                        if (!Array.isArray(files)) files = [files];

                        const savedNames = [];
                        for (const file of files) {
                            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                            const fileName = uniqueSuffix + '-' + file.name;
                            const filePath = path.join(uploadDir, fileName);
                            await file.mv(filePath);
                            savedNames.push('images/iqa/checklist/' + fileName);
                        }
                        checklist.failedImage = savedNames.join(',');
                    }
                }
            }
        } 

        const response = await executeSP({
            spName: 'IQAConfirmation',
            userDetails: req.userDetails,
            headers: req.headers,
            body
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
        if (['QuarantineLocations', 'SerialNumbers'].includes(action)) {
            return res.status(201).send({ success, data, action, method });
        }

        if (['CheckList'].includes(action)) {
            return res.status(201).send({ success, labels: data, checklists: results[1], action, method });
        }
        if (['Confirm', 'Reject', 'ChecklistUpdate'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action,
                method
            })
            if (action === 'Confirm') {
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
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


export { performIQAConfirmationActions }