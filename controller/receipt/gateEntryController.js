import { appendRowsToCSV, appendRowsToTxt, safeRun, uploadToFTP } from "../../config/auth.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages, getSapFilePaths } from "../constant.js";
import fs from "fs";

const performGateEntryAction = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'GateEntry',
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body
        }); 

        const { success, error, results } = response || {};
        const [data = []] = results || [];
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

        if (['Add', 'Update', 'Delete', 'StatusUpdate'].includes(action)) {
            if (error) {
                return res.status(201).send({
                    notify: true,
                    success: false,
                    error: true,
                    message: error,
                    data,
                    action,
                    method
                });
            }
            if (['Add', 'Update'].includes(action)) {
                const { 0: { fileName = '' } } = data
                const {
                    INWARD: {
                        local_DMR_CSVPath, local_DMR_TxTPath, remote_DMR_CSVPath, remote_DMR_TxTPath,
                        headers: { I_DMR_CSV, I_DMR_TXT }
                    }
                } = getSapFilePaths(fileName);

                // DMR file creation
                await safeRun(() => {
                    if (!fs.existsSync(local_DMR_CSVPath)) fs.writeFileSync(local_DMR_CSVPath, I_DMR_CSV, "utf8");
                }, "Write 101 CSV");

                await safeRun(() => {
                    if (!fs.existsSync(local_DMR_TxTPath)) fs.writeFileSync(local_DMR_TxTPath, I_DMR_TXT, "utf8");
                }, "Write 101 TXT");

                const I_DMR = data.map(obj => {
                    const { PONumber, BOENumber, BOEDate, vehicleNumber, invoiceNo, invoiceDate, shipmentMode, invoiceAmount, securitySerialNumber, receivedDate, HAWBNumber, MAWBNumber, ChallanNo, ChallanDate, LRNumber, noOfPackage, transportName, cancelledDMRNumber } = obj
                    return [PONumber, BOENumber, BOEDate, vehicleNumber, invoiceNo, invoiceDate, shipmentMode, invoiceAmount, securitySerialNumber, receivedDate, HAWBNumber, MAWBNumber, ChallanNo, ChallanDate, LRNumber, noOfPackage, transportName, cancelledDMRNumber]
                })

                // DMR 
                await safeRun(() => appendRowsToCSV(local_DMR_CSVPath, I_DMR), "Append DMR CSV");
                await safeRun(() => appendRowsToTxt(local_DMR_TxTPath, I_DMR), "Append DMR TXT");

                // Upload To FTP
                await safeRun(() => uploadToFTP(local_DMR_CSVPath, remote_DMR_CSVPath), "Upload DMR CSV");
                await safeRun(() => uploadToFTP(local_DMR_TxTPath, remote_DMR_TxTPath), "Upload DMR TXT");

            }
            return res.status(201).send({ notify: false, success, message: 'Success', data, action, method });
        }
        if (['GetTruckNumbersAutoFill', 'GetTransporterAutoFill', 'TruckSizeList', 'ModeOfTransportList', 'PlantCode', 'TruckNumbers', 'InwardDocTypeList', 'Shifts', 'SuppliersList', 'ModeOfTransport', 'PONumbersAutoFill', 'TPNNumbersAutoFill', 'InternalSuppliers', 'CheckInvoiceFromOtherPlant'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (action === 'Fetch') {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }

        return res.status(201).send({ notify: false, success, data, message: 'Invalid Action', data: [], action, method });

    } catch (error) {
        return res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};


export { performGateEntryAction }