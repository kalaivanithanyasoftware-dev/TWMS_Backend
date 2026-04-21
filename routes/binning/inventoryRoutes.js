import express from "express"
import { performInventoryDetailedReportAction, performInventoryReportAction } from "../../controller/binning/inventoryController.js";
const inventoryRoutes = express.Router();

inventoryRoutes.post('/performInventoryDetailedReportAction', performInventoryDetailedReportAction)
inventoryRoutes.post('/performInventoryReportAction', performInventoryReportAction)

export default inventoryRoutes