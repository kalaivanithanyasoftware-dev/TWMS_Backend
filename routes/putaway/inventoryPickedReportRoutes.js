import express from "express"
import { performInventoryPickedReportActions } from "../../controller/putaway/inventoryPickedReport.js";
const inventoryPickedReportRoutes = express.Router();

inventoryPickedReportRoutes.post('/performInventoryPickedReportActions', performInventoryPickedReportActions)

export default inventoryPickedReportRoutes