import { poolPromise, sql } from "../config/db.js";
import moment from "moment"
const getSupplierStatusCode = async (supplierid, currentStatus) => {
    // const pool = await poolPromise;
    // const supplierStatusQuery = await pool.request()
    //     .input('supplierid', sql.Int, supplierid)
    //     .query(`SELECT ISNULL(OutwardProcessStatus,'') OutwardProcessStatus FROM ms_supplier WHERE id = @supplierid`);

    // const supplierStatusList = supplierStatusQuery.recordset[0]?.OutwardProcessStatus?.split(',').map(Number) || [];

    // const statusOrderQuery = await pool.request()
    //     .input('currentStatus', sql.Int, currentStatus)
    //     .query(`SELECT OrderNumber,StatusCode FROM OutwardProcessStatusMaster WHERE StatusCode NOT IN(22,3) ORDER BY OrderNumber ASC`);

    // const statuslist = statusOrderQuery.recordset

    // // **Determine the next available status** 
    // let nextStatusIndex = supplierStatusList.indexOf(currentStatus) + 1;
    // let nextStatus = currentStatus
    // // console.log(nextStatusIndex,supplierStatusList[nextStatusIndex],statuslist);

    // if (supplierStatusList[nextStatusIndex]) {
    //     const { OrderNumber, StatusCode } = statuslist.find(obj => obj.StatusCode === supplierStatusList[nextStatusIndex]) || {}

    //     // const { StatusCode } = statuslist.find(obj => obj.OrderNumber === OrderNumber - 1) || {}
    //     nextStatus = StatusCode
    // } else {
    //     nextStatus = currentStatus; // If no next status, retain current
    // }
    // console.log(nextStatus);

    return { nextStatus: currentStatus }
}

const errorMessages = {
    somethingWentWrong: "Unable to complete the request due to a server issue. Please try again later or contact the administrator.",
    holdError: `Unable to complete the request when holding DO due to a server issue, please contact your administrator.`, // "Hold Error, please contact your administrator.",
    rejectError: `Unable to complete the request when rejecting DO due to a server issue, please contact your administrator.`, // "Reject Error, please contact your administrator.",
    confirmError: `Unable to complete the request when confirming DO due to a server issue, please contact your administrator.`, // "Confirm Error, please contact your administrator.",
    scanValidDelivery: `Please Scan Valid Delivery #`
}
const getSapFilePaths = (fileName) => {
    const curDataTime = moment().format('YYYY-MM-DD HH-mm-ss');
    const newFileName = fileName || curDataTime
    return {
        INWARD: {
            local_101_CSVPath: `./SAPFiles/101_${newFileName}.csv`,
            remote_101_CSVPath: `/AAFEES/INWARD/101/101_${newFileName}.csv`,

            local_101_TxTPath: `./SAPFiles/101_${newFileName}.txt`,
            remote_101_TxTPath: `/AAFEES/INWARD/101/101_${newFileName}.txt`,

            local_102_CSVPath: `./SAPFiles/102_${newFileName}.csv`,
            remote_102_CSVPath: `/AAFEES/INWARD/102/102_${newFileName}.csv`,

            local_102_TxTPath: `./SAPFiles/102_${newFileName}.txt`,
            remote_102_TxTPath: `/AAFEES/INWARD/102/102_${newFileName}.txt`,

            local_301_CSVPath: `./SAPFiles/301_${newFileName}.csv`,
            remote_301_CSVPath: `/AAFEES/INWARD/301/301_${newFileName}.csv`,

            local_301_TxTPath: `./SAPFiles/301_${newFileName}.txt`,
            remote_301_TxTPath: `/AAFEES/INWARD/301/301_${newFileName}.txt`,


            local_309_CSVPath: `./SAPFiles/309_${newFileName}.csv`,
            remote_309_CSVPath: `/AAFEES/INWARD/309/309_${newFileName}.csv`,

            local_309_TxTPath: `./SAPFiles/309_${newFileName}.txt`,
            remote_309_TxTPath: `/AAFEES/INWARD/309/309_${newFileName}.txt`,

            local_MIRO_CSVPath: `./SAPFiles/MIRO_${newFileName}.csv`,
            remote_MIRO_CSVPath: `/AAFEES/INWARD/MIRO/MIRO_${newFileName}.csv`,

            local_MIRO_TxTPath: `./SAPFiles/MIRO_${newFileName}.txt`,
            remote_MIRO_TxTPath: `/AAFEES/INWARD/MIRO/MIRO_${newFileName}.txt`,

            local_311_CSVPath: `./SAPFiles/311_${newFileName}.csv`,
            remote_311_CSVPath: `/AAFEES/INWARD/311/311_${newFileName}.csv`,

            local_311_TxTPath: `./SAPFiles/311_${newFileName}.txt`,
            remote_311_TxTPath: `/AAFEES/INWARD/311/311_${newFileName}.txt`,

            local_315_CSVPath: `./SAPFiles/ZMIGO_315_${newFileName}.csv`,
            remote_315_CSVPath: `/AAFEES/INWARD/315/315_${newFileName}.csv`,

            local_315_TxTPath: `./SAPFiles/315_${newFileName}.txt`,
            remote_315_TxTPath: `/AAFEES/INWARD/315/315_${newFileName}.txt`,

            local_DMR_CSVPath: `./SAPFiles/DMR_${newFileName}.csv`,
            remote_DMR_CSVPath: `/AAFEES/INWARD/DMR/DMR_${newFileName}.csv`,

            local_DMR_TxTPath: `./SAPFiles/DMR_${newFileName}.txt`,
            remote_DMR_TxTPath: `/AAFEES/INWARD/DMR/DMR_${newFileName}.txt`,

            local_313_CSVPath: `./SAPFiles/313_${newFileName}.csv`,
            remote_313_CSVPath: `/AAFEES/INWARD/313/313_${newFileName}.csv`,

            local_313_TxTPath: `./SAPFiles/313_${newFileName}.txt`,
            remote_313_TxTPath: `/AAFEES/INWARD/313/313_${newFileName}.txt`,

            local_541_CSVPath: `./SAPFiles/541_${newFileName}.csv`,
            remote_541_CSVPath: `/AAFEES/INWARD/541/541_${newFileName}.csv`,

            local_541_TxTPath: `./SAPFiles/541_${newFileName}.txt`,
            remote_541_TxTPath: `/AAFEES/INWARD/541/541_${newFileName}.txt`,

            local_542_CSVPath: `./SAPFiles/542_${newFileName}.csv`,
            remote_542_CSVPath: `/AAFEES/INWARD/542/542_${newFileName}.csv`,

            local_542_TxTPath: `./SAPFiles/542_${newFileName}.txt`,
            remote_542_TxTPath: `/AAFEES/INWARD/542/542_${newFileName}.txt`,

            local_321_CSVPath: `./SAPFiles/321_${newFileName}.csv`,
            remote_321_CSVPath: `/AAFEES/INWARD/321/321_${newFileName}.csv`,

            local_321_TxTPath: `./SAPFiles/321_${newFileName}.txt`,
            remote_321_TxTPath: `/AAFEES/INWARD/321/321_${newFileName}.txt`,
            headers: {
                I_101_CSV: "PO No,Delivery Note,Header Text,DMR No,Item No,Material No,Qty,Serial No,File Link\n",
                I_102_CSV: "101 Document No,Doc Year,Header Text\n",
                I_301_CSV: "cc\n",

                I_309_CSV: "Doc Date,Posting Date,Material Slip,Doc Header Text,Sending Plant,Sending Stor loc,Receiving Material,Supplying Material,Qty,Serial No,File Link\n",
                I_311_CSV: "Material Slip,Header Text,Material No,Plant,From Stor Loc,To Stor Loc,Qty,Serial No\n",
                I_315_CSV: "",
                I_DMR_CSV: "Purchase Order No,BOE Number,BOE Date,Vehicle No,Invoice No,Invoice Date,Mode of Shipment,Invoice Amount,Gate Entry No,Gate Entry Date,HAWB No,MAWB No,Challan no,Challan date,LR No,No. of Boxes/Palletes,Transport Details,Cancelled DMR No,Inbound Delivery No\n",

                I_311_TXT: "Material Slip\tHeader Text\tMaterial No\tPlant\tFrom Stor Loc\tTo Stor Loc\tQty\tSerial No\n",
                I_315_TXT: "",


                I_101_TXT: "PO No\tDelivery Note\tHeader Text\tDMR No\tItem No\tMaterial No\tQty\tSerial No\tFile Link\n",
                I_102_TXT: "101 Document No\tDoc Year\tHeader Text\n",
                I_301_TXT: "Material Slip(K)\tHeader text(K)\tPlant(K)\tLocation(K)\tGL Acct (K)\tDoc Date\tPosting Date\tRec Plant\tRec Location\tMaterial\tQty\tSerial No\n",

                I_309_TXT: "Doc Date\tPosting Date\tMaterial Slip\tDoc Header Text\tSending Plant\tSending Stor Loc\tReceiving Material\tSupplying Material\tQty\tSerial No\tFile Link\n",

                I_DMR_TXT: "Purchase Order No\tBOE Number\tBOE Date\tVehicle No\tInvoice No\tInvoice Date\tMode of Shipment\tInvoice Amount\tGate Entry No\tGate Entry Date\tHAWB No\tMAWB No\tChallan no\tChallan date\tLR No\tNo. of Boxes/Palletes\tTransport Details\tCancelled DMR No\tInbound Delivery No\n",

                I_MIRO_CSV: "PO No,Reference Text,BOE No,BOE Dt,AWB NO,AWB Dt,AD Code,Port No,Port Date,PO Item No,BCD Amount,SWS Amount,Qty,Assessble Value\n",
                I_MIRO_TXT: "PO No\tReference Text\tBOE No\tBOE Dt\tAWB NO\tAWB Dt\tAD Code\nPort No\nPort Date\nPO Item No\tBCD Amount\tSWS Amount\nQty\tAssessble Value\n",

                I_313_CSV: "MR Number,Item No,Material,Issued Qty,Serial No\n",
                I_313_TXT: "MR Number\tItem No\tMaterial\tIssued Qty\tSerial No\n",

                I_541_CSV: "Delivery Order,PR No/Material Slip,Header Text,Plant,Header Str Loc,Reason for Movement,Vendor No,PO No,PO Item,Material,Quantity,TPN's Str Loc,UoM,Issue Qty,Serial No\n",
                I_541_TXT: "Delivery Order\tPR No/Material Slip\tHeader Text\tPlant\tHeader Str Loc\tReason for Movement\tVendor No\tPO No\tPO Item\tMaterial\tQuantity\tTPN's Str Loc\tUoM\tIssue Qty\tSerial No\n",

                I_542_CSV: "Doc Date,Posting Date,Material Slip,Header Text,Plant,Stor Loc,To ST Loc,541 Material Doc No,Vendor No,Material,Qty,Serial No\n",
                I_542_TXT: "Doc Date\tPosting Date\tMaterial Slip\tHeader Text\tPlant\tStor Loc\tTo ST Loc\t541 Material Doc No\tVendor No\tMaterial\tQty\tSerial No\n",

                I_321_CSV: "Material Doc,Material No,Qty\n",
                I_321_TXT: "Material Doc\tMaterial No\tQty\n",
            }
        },
        OUTWARD: {
            local_313_CSVPath: `./SAPFiles/313_${newFileName}.csv`,
            remote_313_CSVPath: `/AAFEES/OUTWARD/313/313_${newFileName}.csv`,

            local_313_TxTPath: `./SAPFiles/313_${newFileName}.txt`,
            remote_313_TxTPath: `/AAFEES/OUTWARD/313/13_${newFileName}.txt`,

            headers: {
                I_313_CSV: "MR Number,Item No,Material,Issued Qty,Serial No\n",
                I_313_TXT: "MR Number\tItem No\tMaterial\tIssued Qty\tSerial No\n"
            }
        }
    }
}

export { getSupplierStatusCode, errorMessages, getSapFilePaths }