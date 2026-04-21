


import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performAssetMaintenanceTypeAction = async (req, res) => {
    const { id: userid, roleid, firstname: currentUser, empcode: currentUserEmpcode, plantid } = req.userDetails.user;

    const {
        totalentry: limit,
        pageNo,
        search='',
        action,
        method,
        id,
        maintanance_type,
        description,
        status,
        del_remarks,
        excelArray = []
    } = req.body;
    
    const offSet = (pageNo - 1) * limit;

    try {
        let activity_type = '';
        let activity_data = '';

        if (action === 'Add') {
            activity_type = 'AssetMaintenanceType Created';
            activity_data = `${currentUser} (${currentUserEmpcode}) has Created new User`;
        } else if (action === 'Update') {
            activity_type = 'AssetMaintenanceType Updated';
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated the User`;
        } else if (action === 'Delete') {
            activity_type = 'AssetMaintenanceType Deleted';
            activity_data = `${currentUser} (${currentUserEmpcode}) has Deleted the User`;
        } else if (action === 'StatusUpdate') {
            activity_type = 'AssetMaintenanceType Status Updated';
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated User Status`;
        }

        // Upload action
        // if (action === 'Upload' && excelFileData.length > 0) {
        //     for (const arr of excelFileData) {
        //         for (const [i] of arr.entries()) {
        //             arr[i] = String(arr[i]);
        //         }

        //         const result = await executeSP([
        //             {
        //                 sp: `[USP_ams_assetmaintenance]`,
        //                 params: [
        //                     { name: 'action', type: sql.NVarChar, value: action },
        //                     { name: 'plantid', type: sql.Int, value: plantid },
        //                     { name: 'maintanance_type', type: sql.NVarChar, value: arr[0] },
        //                     { name: 'description', type: sql.NVarChar, value: arr[1] },
        //                     { name: 'userid', type: sql.Int, value: userid },
        //                     { name: 'roleid', type: sql.Int, value: roleid },
        //                     { name: 'activity_type', type: sql.NVarChar, value: activity_type },
        //                     { name: 'activity_data', type: sql.NVarChar, value: activity_data }
        //                 ]
        //             }
        //         ]);

        //         if (!result.success) {
        //             return res.status(401).send({
        //                 notify: true,
        //                 success: false,
        //                 message: `Failed to Upload record`,
        //                 errorMessage: result.error,
        //                 action,
        //                 method
        //             });
        //         }
        //     }

        //     return res.status(201).send({
        //         notify: true,
        //         success: true,
        //         message: 'All records allocated successfully',
        //         action,
        //         method
        //     });
        // }

      
        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([{
            sp: `USP_ams_assetmaintenance`,
            params: [
                { name: 'search', type: sql.NVarChar, value: '%' + search.trim() + '%' },
                { name: 'offset', type: sql.Int, value: offSet },
                { name: 'limit', type: sql.Int, value:  limit }, 
                { name: 'action', type: sql.NVarChar, value: action },
                { name: 'plantid', type: sql.Int, value: plantid },
                { name: 'excelArray', type: sql.NVarChar, value: excelArray },

                { name: 'maintanance_type', type: sql.NVarChar, value: maintanance_type },
                { name: 'description', type: sql.NVarChar, value: description },
                { name: 'status', type: sql.Int, value: status },
                { name: 'id', type: sql.Int, value: id },
                { name: 'userid', type: sql.Int, value: userid },
                { name: 'roleid', type: sql.Int, value: roleid },
                { name: 'activity_type', type: sql.NVarChar, value: activity_type },
                { name: 'activity_data', type: sql.NVarChar, value: activity_data },
                { name: 'del_remarks', type: sql.NVarChar, value: del_remarks }
            ]
        }])) || {};

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


        if (action === 'Export') {
            return res.status(201).send({
                notify: false,
                success,
                data,
                message: 'Exported successfully',
                action,
                method
            });
        }

        if (['Add', 'Update','Upload', 'Delete', 'StatusUpdate'].includes(action)) {
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
            return res.status(201).send({
                notify: false,
                success,
                message: 'success',
                action,
                method
            });
        }

       
        if (action === 'AssetMaintenanceTypeList') {
            return res.status(201).send({
                notify: false,
                success: true,
                data,
                action,
                method
            });
        }

        if (action === 'Fetch') {
            const totalPage = Math.ceil(totalRecords / limit);
            return res.status(201).send({
                success,
                data,
                paginate: { totalPage, totalRecords },
                action,
                method
            });
        }

        return res.status(201).send({
            notify: false,
            success,
            message: 'Invalid Type',
            action,
            method
        });

    } catch (error) {
        return res.status(401).send({
            data: [],
            paginate: {},
            error: `${error}`
        });
    }
};

export {
    performAssetMaintenanceTypeAction
};

