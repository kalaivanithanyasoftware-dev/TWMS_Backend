import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";
import fs from "fs"

const performMaterialAcknowledgementActions = async (req, res) => {
    const { action, method, doReelsInfo, planNos } = req.body;
    try {
        let updatedArrayObj = {}
        if (['AcknowledgeMaterial'].includes(action)) {
            updatedArrayObj = {
                doReelsInfo: JSON.parse(doReelsInfo),
                planNos: JSON.parse(planNos || "[]")
            }
            for (const [i, obj] of updatedArrayObj.doReelsInfo.entries()) {
                let ack_attachmentname = null
                if (req.files && req.files[obj.reel_id]) {
                    const attachments = req.files[obj.reel_id] || ''
                    ack_attachmentname = 'docs/materialAck/' + obj.reel_id + Date.now() + '.' + req.files[obj.reel_id].name.split('.').pop()
                    attachments.mv('./assets/docs/materialAck/' + obj.reel_id + Date.now() + '.' + req.files[obj.reel_id].name.split('.').pop())
                }
                updatedArrayObj.doReelsInfo[i].ack_attachments = ack_attachmentname
            }
        }
        let ack_attachmentsname = null
        if (req.files) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const uploadinvoice = req.files.attachments || ''
            ack_attachmentsname = 'docs/materialAck/' + uniqueSuffix + uploadinvoice.name
            uploadinvoice.mv('./assets/docs/materialAck/' + uniqueSuffix + uploadinvoice.name)
        }
        const response = await executeSP({
            spName: 'MaterialAcknowledgement',
            userDetails: req.userDetails,
            headers: req.headers,
            body: { ...req.body, ...updatedArrayObj, ack_attachments: ack_attachmentsname }
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
        if (['AcknowledgeMaterial'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            if (req.body.ackMode === 'Single' && data.length > 0) {
                const returnMaterials = data.filter(obj => obj.status === Number(6))
                if (returnMaterials.length) {
                    const {
                        INWARD: {
                            local_542_CSVPath, local_542_TxTPath, remote_542_CSVPath, remote_542_TxTPath,

                            headers: { I_542_CSV, I_542_TXT }
                        }
                    } = getSapFilePaths()

                    // File creation
                    await safeRun(() => {
                        if (!fs.existsSync(local_542_CSVPath)) fs.writeFileSync(local_542_CSVPath, I_542_CSV, "utf8");
                    }, "Write 542 CSV");

                    await safeRun(() => {
                        if (!fs.existsSync(local_542_TxTPath)) fs.writeFileSync(local_542_TxTPath, I_542_TXT, "utf8");
                    }, "Write 542 TXT");

                    // Data prep
                    const filedata = data.map(obj => {
                        const { docDate, postingDate, materialSlip, headerText, plant, stloc, materialDocNo, vendorcode, material, quantity, serialno } = obj;
                        return [docDate, postingDate, materialSlip, headerText, plant, stloc, materialDocNo, vendorcode, material, quantity, serialno];
                    })
                    // Append to files
                    await safeRun(() => appendRowsToCSV(local_542_CSVPath, filedata), "Append 542 CSV");
                    await safeRun(() => appendRowsToTxt(local_542_TxTPath, filedata), "Append 542 TXT");

                    // FTP Uploads
                    await safeRun(() => uploadToFTP(local_542_TxTPath, remote_542_TxTPath), "Upload 542 TXT");
                    await safeRun(() => uploadToFTP(local_542_CSVPath, remote_542_CSVPath), "Upload 542 CSV");
                }
            }
            return res.status(201).send({ notify: true, success, message: 'success', action, method });
        }

        if (['GetPendingAck'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({
                notify: false, success,
                data: data[0] || {},
                action,
                method
            });
        }
        if (['GetReelInfo'].includes(action)) {
            return res.status(201).send({
                notify: false, success,
                boxDetails: data,
                doDetails: results[1] || {},
                action, method
            });
        }
        if (['GetReelInfoByPlanno', 'GetBoxReelInfo', 'SuppliersList'].includes(action)) {
            return res.status(201).send({
                notify: false, success,
                data,
                action,
                method
            });
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
    performMaterialAcknowledgementActions
}