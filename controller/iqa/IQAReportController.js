import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import fs from "fs"
import path from "path"
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";


const performIQAReportActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        // let body = { ...req.body };

        // // Handle FormData (file upload) for Confirm/Reject
        // if (['Confirm', 'Reject'].includes(action)) {
        //     if (typeof body.ids === 'string') body.ids = JSON.parse(body.ids);
        //     if (typeof body.labels === 'string') body.labels = JSON.parse(body.labels);
        //     if (typeof body.checklists === 'string') body.checklists = JSON.parse(body.checklists);
        //     if (typeof body.measurements === 'string') body.measurements = JSON.parse(body.measurements);

        //     if (req.files) {
        //         const uploadDir = './assets/images/iqa/checklist/';
        //         if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        //         for (const checklist of body.checklists) {
        //             const fileKey = `failedImage_${checklist.id}`;
        //             if (req.files[fileKey]) {
        //                 let files = req.files[fileKey];
        //                 if (!Array.isArray(files)) files = [files];

        //                 const savedNames = [];
        //                 for (const file of files) {
        //                     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        //                     const fileName = uniqueSuffix + '-' + file.name;
        //                     const filePath = path.join(uploadDir, fileName);
        //                     await file.mv(filePath);
        //                     savedNames.push('images/iqa/checklist/' + fileName);
        //                 }
        //                 checklist.failedImage = savedNames.join(',');
        //             }
        //         }
        //     }
        // }

        const response = await executeSP({
            spName: 'IQAReport',
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
        if (['Confirm', 'Reject'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action,
                method
            })
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

export { performIQAReportActions }
