import { safeParse, safeRun, uploadToFTP } from "../../config/auth.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performInwardDataActions = async (req, res) => {
    const { action, method } = req.body;
    try {
        let upload_docname = null
        let inputs = safeParse(req.body.inputs)
        let excelArray = safeParse(req.body.excelArray)
        if (req.files) {
            const upload_doc = req.files.upload_doc || {}
            upload_docname = upload_doc.name
        }
        const response = await executeSP({
            spName: 'InwardData',
            userDetails: req.userDetails,
            headers: req.headers,
            body: { ...req.body, excelArray, upload_docname, path: 'docs/receipt/uploadinward/', ...inputs }
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

        if (['Add', 'Upload', 'Update', 'Delete', 'StatusUpdate', 'UploadSerialNumbers'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            if (['Add', 'Upload'].includes(action)) {
                if (req.files) {
                    const { fileName = '', path = '' } = data[0] || {}
                    const fullPathWithName = './assets/' + path + fileName
                    const upload_doc = req.files.upload_doc || {}
                    // const uploadPath = './assets/docs/receipt/uploadinward/' + fileName + upload_doc.name
                    // Move file safely  

                    if (fileName && path) {
                        await new Promise((resolve, reject) => {
                            upload_doc.mv(fullPathWithName, err => {
                                if (err) reject(err)
                                else resolve()
                            })
                        })

                        // Upload to FTP
                        await safeRun(() => uploadToFTP(fullPathWithName, `/AAFEES/101 Files/${fileName}`), "Upload Invoice file from Upload Inward data pdf");
                        data.length = 0
                    }
                }
            }
            return res.status(201).send({ notify: false, success, message: 'success', data, action, method });
        }
        if (['TruckNumbers', 'RevisionNoList', 'InwardDocTypeList', 'Shifts', 'SuppliersList', 'TruckSizeList', 'ModeOfTransport', 'SecuritySerialNumbers', 'PONumbersAutoFill', 'TPNNumbersAutoFill', 'FetchTPNDetailsForOtherPlant'].includes(action)) {
            return res.status(201).send({ notify: false, success, message: 'success', data, action, method });
        }
        if (action === 'Fetch') {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, message: `${error}` })
    }
}

export { performInwardDataActions } 
