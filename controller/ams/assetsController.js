import { changeDateToSqlFormat } from "../../config/auth.js";
import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";


const performAssetsAction = async (req, res) => {
    const { id: userid, roleid, firstname: currentUser, empcode: currentUserEmpcode, plantid } = req.userDetails.user

    const {
        totalentry: limit,
        pageNo,
        search='',
        action,
        method,
        id,
        plant_id,
        asset_Number,
        categoryid,
        assettypeid,
        brandid,
        model_Name,
        serial_Number,
        Specification,
        doc_Name,
        po_Number,
        po_Date,
        grir_Name,
        grir_Date,
        vendorid,
        
        // status,
        excelArray = []
    } = req.body
    const offSet = (pageNo - 1) * limit;

    try {

        let activity_type = ''
        let activity_data = ''
        if (action === 'Add') {
            activity_type = 'Category Created'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Created new User`
        } else if (action === 'Update') {
            activity_type = 'Category Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated the User`
        } else if (action === 'Delete') {
            activity_type = 'Category Deleted'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Deleted the User`
        } else if (action === 'StatusUpdate') {
            activity_type = 'Category Status Updated'
            activity_data = `${currentUser} (${currentUserEmpcode}) has Updated User Status`
        } 

        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = (await executeSP([
            {
                sp: `USP_AMS_Assets`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'action', type: sql.NVarChar, value: action },

                    { name: 'plant_id', type: sql.Int, value: plant_id },
                    { name: 'asset_number', type: sql.NVarChar, value: asset_Number },
                    { name: 'categoryid', type: sql.Int, value: categoryid },
                    { name: 'assettypeid', type: sql.Int, value: assettypeid },
                    { name: 'brandid', type: sql.Int, value: brandid },
                    { name: 'model_Name', type: sql.NVarChar, value: model_Name },
                    { name: 'serial_Number', type: sql.NVarChar, value: serial_Number },
                    { name: 'Specification', type: sql.NVarChar, value: Specification },
                    { name: 'doc_Name', type: sql.NVarChar, value: doc_Name },
                    { name: 'po_Number', type: sql.NVarChar, value: po_Number },
                    { name: 'po_Date', type: sql.Date, value: changeDateToSqlFormat(po_Date) },
                    { name: 'grir_Name', type: sql.NVarChar, value: grir_Name },
                    { name: 'grir_Date', type: sql.Date, value: changeDateToSqlFormat(grir_Date) },
                    { name: 'vendorid', type: sql.Int, value: vendorid },
                    { name: 'excelArray', type: sql.NVarChar, value: excelArray },
                    // { name: 'status', type: sql.Int, value: status },
                    { name: 'id', type: sql.Int, value: id },
                    { name: 'userid', type: sql.Int, value: userid },
                    { name: 'roleid', type: sql.Int, value: roleid },
                    { name: 'activity_type', type: sql.NVarChar, value: activity_type },
                    { name: 'activity_data', type: sql.NVarChar, value: activity_data }
                ]
            }
        ])) || {}
        if (!success) return res.status(401).send({
            notify: true,
            success,
            message: errorMessages.somethingWentWrong,
            errorMessage: `${error}`,
            action, method
            
            
        })
        if (['Add', 'Update', 'Upload', 'Delete', 'StatusUpdate'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                data,
                error: true,
                message: error,
                action, method
            })
            return res.status(201).send({ notify: false, success, data, message: 'success', action, method });
        }
        if (['VendorsList','PlantCodeList','AssetCategoryList','AssetTypeList','BrandsList'].includes(action)) {
            return res.status(201).send({
                notify: false,
                success: true,
                data,
                action,
                method
            })
        }

        if (['Fetch'].includes(action)) {
            const totalPage = Math.ceil(totalRecords / limit);
            return res.status(201).send({ success, data, paginate: { totalPage, totalRecords }, action, method });
        }
        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}
export {
    performAssetsAction
};
