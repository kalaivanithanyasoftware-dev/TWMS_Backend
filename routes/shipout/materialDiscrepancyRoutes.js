import express from "express"
import { getDiscrepancy, getDiscrepancyReels, performMaterialDiscrepancyActions, updateMaterialDiscrepancy } from "../../controller/shipout/materialDiscrepancyController.js";
const materialDiscrepancyRoutes = express.Router();

materialDiscrepancyRoutes.post('/performMaterialDiscrepancyActions', performMaterialDiscrepancyActions)
materialDiscrepancyRoutes.post('/get-discrepancy', getDiscrepancy)
materialDiscrepancyRoutes.post('/get-discrepancy-reels', getDiscrepancyReels)
materialDiscrepancyRoutes.post('/update-discrepancy', updateMaterialDiscrepancy)

export default materialDiscrepancyRoutes