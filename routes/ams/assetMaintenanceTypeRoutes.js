import express from "express"
import { performAssetMaintenanceTypeAction } from "../../controller/ams/assetMaintenanceTypeController.js"; 

const assetMaintenanceTypeRoutes = express.Router();

assetMaintenanceTypeRoutes.post('/assetMaintenanceType', performAssetMaintenanceTypeAction)

export default assetMaintenanceTypeRoutes
