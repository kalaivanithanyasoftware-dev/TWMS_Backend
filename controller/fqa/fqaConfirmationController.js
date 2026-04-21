import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";
import fs from "fs"
import path from "path"


const performFQAConfirmationActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        let body = { ...req.body };
        if (['FQAConfirm', 'Update', 'SplitReel', 'DeleteReel'].includes(action)) {
            if (typeof body.boxDetails === 'string') body.boxDetails = JSON.parse(body.boxDetails);
            if (typeof body.reelInfo === 'string') body.reelInfo = JSON.parse(body.reelInfo);
            if (typeof body.doDetails === 'string') body.doDetails = JSON.parse(body.doDetails);
            if (typeof body.fqaMeasurements === 'string') body.fqaMeasurements = JSON.parse(body.fqaMeasurements);
            if (typeof body.checklists === 'string') body.checklists = JSON.parse(body.checklists);
            if (typeof body.checklistData === 'string') body.checklistData = JSON.parse(body.checklistData);
            if (req.files) {
                const uploadDir = './assets/images/fqa/checklist/';
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

                for (const checklist of body.checklistData) {
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
            spName: 'FQAConfirmation',
            userDetails: req.userDetails,
            headers: req.headers,
            body: body
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


        if (['FQAConfirm', 'Update', 'SplitReel', 'DeleteReel'].includes(action)) {
            if (typeof body.boxDetails === 'string') body.boxDetails = JSON.parse(body.boxDetails);
            if (typeof body.reelInfo === 'string') body.reelInfo = JSON.parse(body.reelInfo);
            if (typeof body.doDetails === 'string') body.doDetails = JSON.parse(body.doDetails);
            if (typeof body.fqaMeasurements === 'string') body.fqaMeasurements = JSON.parse(body.fqaMeasurements);
            if (typeof body.checklists === 'string') body.checklists = JSON.parse(body.checklists);
            if (typeof body.checklistData === 'string') body.checklistData = JSON.parse(body.checklistData);
            if (req.files) {
                const uploadDir = './assets/images/iqa/checklist/';
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

                for (const checklist of body.checklistData) {
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
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: true, success, message: 'success', action, method });
        }

        if (action === 'GetFQAConfirmationList') {
            if (!data[0] || !results[1]?.length) {
                return res.status(401).send({
                    notify: true,
                    success: false,
                    message: errorMessages.scanValidDelivery,
                    doDetails: [],
                    boxDetails: [],
                    reelInfo: [],
                    checklists: [],
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
                checklists: results[3] || [],
                action,
                method
            });
        }
        if (['GetReelInfo', 'QuarantineLocations', 'SerialNumbers'].includes(action)) {
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
    performFQAConfirmationActions
}