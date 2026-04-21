import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";
import fs from "fs";

const performMaterialConversionAction = async (req, res) => {
    const { action, method } = req.body;
    try {
        let conversionAttachmentName = null
        let reelsInfo = []
        if (req.body.reelsInfo) {
            reelsInfo = JSON.parse(req.body.reelsInfo || "[]") || []
        }
        if (req.files) {
            const date = Date.now()
            const randomNo = Math.round(Math.random() * 1E9)
            const conversionAttachment = req.files.conversionAttachment || ''
            const fileName = date + '-' + randomNo + '-' + conversionAttachment.name
            conversionAttachmentName = 'docs/materialConversion/' + fileName
            conversionAttachment.mv('./assets/docs/materialConversion/' + fileName)

            const uploadPath = './assets/docs/materialConversion/' + fileName;
            // Move file safely
            await new Promise((resolve, reject) => {
                conversionAttachment.mv(uploadPath, err => {
                    if (err) reject(err)
                    else resolve()
                })
            })
            // Upload to FTP
            await safeRun(() => uploadToFTP(uploadPath, `/AAFEES/309 Files/${fileName}`), "Upload 309 file from Material Conversion");
        }
        const response = await executeSP({
            spName: 'MaterialConversion',
            userDetails: req.userDetails,
            headers: req.headers,
            body: { ...req.body, conversionAttachment: conversionAttachmentName, reelsInfo }
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
        if (action === 'MaterialConversion') {
            if (data.length) {
                const { 0: { fileName = '' } } = results[1]
                const {
                    INWARD: {
                        local_309_CSVPath, local_309_TxTPath, remote_309_CSVPath, remote_309_TxTPath,
                        headers: { I_309_CSV, I_309_TXT }
                    }
                } = getSapFilePaths(fileName);

                // 102 file creation 
                await safeRun(() => {
                    if (!fs.existsSync(local_309_CSVPath)) fs.writeFileSync(local_309_CSVPath, I_309_CSV, "utf8");
                }, "Write 309 CSV");

                await safeRun(() => {
                    if (!fs.existsSync(local_309_TxTPath)) fs.writeFileSync(local_309_TxTPath, I_309_TXT, "utf8");
                }, "Write 309 TXT");
                // Data preparation
                const filedata = data.map(obj => {
                    const { docDate, postingDate, materialSlip, docHeaderText, sendingPlant, sendingStLoc, receivingMaterial, supplyingMaterial, qty, serialno, conversionAttachment } = obj;
                    const filePath = 'ftp://10.108.5.13/AAFEES/309 Files/' + conversionAttachment.split('/').pop()
                    return [docDate, postingDate, materialSlip, docHeaderText, sendingPlant, sendingStLoc, receivingMaterial, supplyingMaterial, qty, serialno, filePath];
                })
                // Append rows
                await safeRun(() => appendRowsToCSV(local_309_CSVPath, filedata), "Append 309 CSV");
                await safeRun(() => appendRowsToTxt(local_309_TxTPath, filedata), "Append 309 TXT");

                // FTP Uploads
                await safeRun(() => uploadToFTP(local_309_TxTPath, remote_309_TxTPath), "Upload 309 TXT");
                await safeRun(() => uploadToFTP(local_309_CSVPath, remote_309_CSVPath), "Upload 309 CSV");
            }
            return res.status(201).send({ notify: true, success, message: 'Success', data, action, method });
        }
        if (['FetchMaterial', 'TPNList', 'ToTPNList'].includes(action)) {
            return res.status(201).send({ notify: false, success, message: 'success', data, action, method });
        }
        if (action === 'Fetch') {
            return res.status(201).send({ success, data, action, method });
        }

        return res.status(201).send({ notify: false, success, data, message: 'Invalid Action', action, method });

    } catch (error) {
        return res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};
export { performMaterialConversionAction }