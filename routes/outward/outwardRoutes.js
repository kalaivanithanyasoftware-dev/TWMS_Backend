import express from "express"
import { deletePicklist, getCMvsSAP, getDeliveryTracking, getPicklistGeneration, getPicklistPrint,   getVendorList, revetPlanningProcesses, updatePicklistPrintCount, deleteMultiplePicklist, getDetailedReport, getPlannoReelInfo } from "../../controller/outward/outwardController.js";
const outwardRoutes = express.Router();

outwardRoutes.post('/get-vendor-list', getVendorList)
outwardRoutes.post('/get-cmvssap', getCMvsSAP)
outwardRoutes.post('/get-picklist-generation', getPicklistGeneration)
outwardRoutes.post('/get-picklist-print', getPicklistPrint)
outwardRoutes.post('/delete-picklist', deletePicklist)
outwardRoutes.post('/delete-multiple-picklist', deleteMultiplePicklist)
outwardRoutes.post('/update-picklist-print-count', updatePicklistPrintCount) 
outwardRoutes.post('/get-delivery-tracking', getDeliveryTracking)
outwardRoutes.post('/revert-planning-processes', revetPlanningProcesses)
outwardRoutes.post('/get-outward-detailed-report', getDetailedReport)
outwardRoutes.post('/get-planno-reel-info', getPlannoReelInfo)
// outwardRoutes.post('/get-picking-qr', getPrintingQR)



export default outwardRoutes