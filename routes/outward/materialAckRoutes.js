import express from "express"
import { acknowledgeMaterial, getMaterialAck, getAckVendorList, getPendingAcks, getMaterialAckDOReel, getMateriakAckBoxReelInfo, getMateriakAckBoxReelInfoByPlanno, updateDiscrepancy } from "../../controller/outward/materialAck.js";
const materialAckRoutes = express.Router();

materialAckRoutes.post('/get-material-ack', getMaterialAck)
materialAckRoutes.post('/get-material-ack-doreel', getMaterialAckDOReel)
materialAckRoutes.post('/get-material-ack-reel-info', getMateriakAckBoxReelInfo)
materialAckRoutes.post('/get-material-ack-reel-info-by-planno', getMateriakAckBoxReelInfoByPlanno)
materialAckRoutes.post('/ack-material', acknowledgeMaterial)
materialAckRoutes.post('/get-ack-vendor', getAckVendorList)
materialAckRoutes.post('/get-pending-acks', getPendingAcks)
materialAckRoutes.post('/update-discrepancy', updateDiscrepancy)

export default materialAckRoutes