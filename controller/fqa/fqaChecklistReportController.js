import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";



// const performFQAChecklistReportActions = async (req, res) => {
//     const { action, method } = req.body;

//     try {
//         let body = { ...req.body };
//         let errorMessage = null;

//         const response = await executeSP({
//             spName: 'FQAChecklistReport',
//             userDetails: req.userDetails,
//             headers: req.headers,
//             body
//         });
        
//         const { success, error, results, output } = response;

//         if (output && output.errorMessage) {
//             errorMessage = output.errorMessage;
//         }

//         const [data = []] = results;
        
//         if (!success) {
//             return res.status(401).send({
//                 notify: true,
//                 success,
//                 message: errorMessages.somethingWentWrong,
//                 errorMessage: error || errorMessage,
//                 action,
//                 method
//             });
//         }
        
//         if (action === 'Revert') {
//             if (errorMessage) {
//                 return res.status(400).send({
//                     success: false,
//                     errorMessage: errorMessage,
//                     action,
//                     method
//                 });
//             }
//             console.log(action,"action",method,"method");
            
//             return res.status(201).send({ 
//                 success: true, 
//                 message: 'Reverted successfully',
//                 action, 
//                 method 
//             });
//         }
        
//         if (['CheckList'].includes(action)) {
//             return res.status(201).send({ 
//                 success, 
//                 labels: data, 
//                 checklists: results[1], 
//                 action, 
//                 method 
//             });
//         }
        
//         if (['QuarantineLocations', 'Locations'].includes(action)) {
//             return res.status(201).send({ success, data, action, method });
//         }

//         if (action === 'Fetch') {
//             const paginate = results[1][0] || {};
//             return res.status(201).send({ success, data, paginate, action, method });
//         }
        
//         return res.status(201).send({ 
//             notify: false, 
//             success, 
//             message: 'Invalid Type', 
//             action, 
//             method 
//         });
//     } catch (error) {
//         res.status(401).send({ 
//             data: [], 
//             paginate: {}, 
//             error: `${error}`,
//             success: false,
//             errorMessage: error.message
//         });
//     }
// }
// export { performFQAChecklistReportActions }
const performFQAChecklistReportActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        let body = { ...req.body };
        let errorMessage = null;

        if (['Revert', 'CheckList', 'QuarantineLocations', 'Locations', 'Fetch'].includes(action)) {
            if (body.checklistData && typeof body.checklistData === 'string') 
                body.checklistData = JSON.parse(body.checklistData);
            if (body.failedImages && typeof body.failedImages === 'string') 
                body.failedImages = JSON.parse(body.failedImages);
            
            if (req.files && action === 'Revert') {
                const uploadDir = './assets/images/fqa/checklist/';
                if (!fs.existsSync(uploadDir)) 
                    fs.mkdirSync(uploadDir, { recursive: true });

                for (const [fileKey, fileValue] of Object.entries(req.files)) {
                    let files = fileValue;
                    if (!Array.isArray(files)) files = [files];

                    const savedNames = [];
                    for (const file of files) {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const fileName = uniqueSuffix + '-' + file.name;
                        const filePath = path.join(uploadDir, fileName);
                        await file.mv(filePath);
                        savedNames.push('images/fqa/checklist/' + fileName);
                    }
                    
                    body[fileKey] = savedNames.join(',');
                }
            }
        }
 
        const response = await executeSP({
            spName: 'FQAChecklistReport',
            userDetails: req.userDetails,
            headers: req.headers,
            body: body
        });
         
        
        const { success, error, results, output } = response;
 
        const [data = []] = results;
        
        if (!success) {
            return res.status(401).send({
                notify: true,
                success,
                message: errorMessages.somethingWentWrong,
                errorMessage: error || errorMessage,
                action,
                method
            });
        }
        
        if (action === 'Revert') {
            if (errorMessage) {
                return res.status(400).send({
                    success: false,
                    errorMessage: errorMessage,
                    action,
                    method
                });
            } 
            
            return res.status(201).send({ 
                success: true, 
                message: 'Reverted successfully',
                action, 
                method 
            });
        }
        
        if (['CheckList'].includes(action)) {
            return res.status(201).send({ 
                success, 
                labels: data, 
                checklists: results[1] || [], 
                action, 
                method 
            });
        }
        
        if (['QuarantineLocations', 'Locations'].includes(action)) {
            return res.status(201).send({ success, data, action, method });
        }

        if (action === 'Fetch') {
            const paginate = results[1] && results[1][0] ? results[1][0] : {};
            return res.status(201).send({ success, data, paginate, action, method });
        }
        
        return res.status(201).send({ 
            notify: false, 
            success, 
            message: 'Invalid Type', 
            action, 
            method 
        });
    } catch (error) {
        console.error('Error in performFQAChecklistReportActions:', error);
        res.status(401).send({ 
            data: [], 
            paginate: {}, 
            error: `${error}`,
            success: false,
            errorMessage: error.message
        });
    }
};
export { performFQAChecklistReportActions }
